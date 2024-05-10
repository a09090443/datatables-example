import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Products} from "../model/Products";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";

const COLUMNS_SCHEMA = [
  {
    key: 'rowId',
    type: 'text',
    label: '編號',
  },
  {
    key: 'name',
    type: 'text',
    label: '名稱',
  },
  {
    key: 'location',
    type: 'text',
    label: '存放位置',
  },
  {
    key: 'price',
    type: 'number',
    label: '價格',
  },
  {
    key: 'status',
    type: 'string',
    label: '狀態',
  },
  {
    key: 'purchase_date',
    type: 'date',
    label: '購買日期',
  },
  {
    key: 'size',
    type: 'string',
    label: '尺寸',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'app-table-simple',
  templateUrl: './table-simple.component.html',
  standalone: true,
  imports: [
    HttpClientModule,
    HttpClientModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatCheckbox,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgSwitch,
    NgIf,
    NgSwitchCase,
    DatePipe,
    NgSwitchDefault,
    NgForOf,
    ReactiveFormsModule
  ],
  styleUrl: './table-simple.component.scss'
})

export class TableSimpleComponent implements OnInit, AfterViewInit {

  pageSize = 10;
  pageSizeOptions = [10, 50, 100];
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  public searchForm: FormGroup = <FormGroup>{};

  dataSource: MatTableDataSource<Products> = new MatTableDataSource<Products>();
  @ViewChild(MatSort) dataSort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  selection = new SelectionModel<Products>(true, []);

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchData();
    this.searchFormInit();
  }

  getFilterPredicate() {
    return (row: Products, filters: string) => {
      // split string per '$' to array
      const filterArray = filters.split('$');
      const productName = filterArray[0];
      const price = filterArray[1];

      const matchFilter = [];

      // Fetch data from row
      const columnProductName = row.name;
      const columnPrice = row.price;

      // verify fetching data by our searching values
      const customFilterPN = columnProductName.toLowerCase().includes(productName);
      const customFilterP = columnPrice.toString().includes(price);

      // push boolean values into array
      matchFilter.push(customFilterPN);
      matchFilter.push(customFilterP);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      productName: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      price: new FormControl('')
    });
  }

  fetchData(): void {
    this.http.get('assets/data.json').subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.filterPredicate = this.getFilterPredicate();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.dataSort;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.dataSort.disableClear = true;
    this.dataSource.sort = this.dataSort;
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(data => this.selection.select(data));
  }

  public checkboxLabel(row?: any): string {
    return (!row)
      ? `${this.isAllSelected() ? 'select' : 'deselect'} all`
      : `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  removeSelectedRows() {
    const deleteItem = confirm("確定刪除?");
    if (deleteItem) {
      this.dataSource.data = this.dataSource.data.filter(item => !this.selection.isSelected(item));
    }
    console.log(this.dataSource.data);
  }

  removeRow(id: number) {
    const deleteItem = confirm("確定刪除?");
    if (deleteItem) {
      const data = this.dataSource.data;
      data.splice(
        this.paginator.pageIndex * this.paginator.pageSize + id,
        1
      );
      this.dataSource.data = data;
    }
    console.log(id);
  }

  addRow() {
    const newRow: Products = {
      rowId: Date.now().toString(),
      name: '',
      location: '',
      price: 0,
      status: '',
      purchase_date: '',
      size: ''
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  search() {
    const productName = this.searchForm.get('productName')?.value;
    const price = this.searchForm.get('price')?.value;
    const filterValue = productName.trim().toLowerCase() + '$' + price;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
