import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {Products} from "../model/Products";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDialogModule} from "@angular/material/dialog";
import {HeaderComponent} from "../header/header.component";
import {HttpClient} from "@angular/common/http";
import {MatIcon} from "@angular/material/icon";

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
    type: 'file',
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
  selector: 'app-table',
  standalone: true,
  imports: [
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
    HeaderComponent,
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterViewInit {

  pageSize = 10;
  pageSizeOptions = [10, 50, 100];
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;

  dataSource: MatTableDataSource<Products[]> = new MatTableDataSource<Products[]>();
  @ViewChild(MatSort) dataSort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  selection = new SelectionModel<Products[]>(true, []);

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get('assets/data.json').subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
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
    const newRow: Products[] = [{
      rowId: Date.now().toString(),
      name: '',
      location: '',
      price: 0,
      status: '',
      purchase_date: '',
      size: ''
    }];
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  onFileSelected(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      console.log(file);
      // 在這裡，你可以添加檔案上傳的邏輯，比如將檔案上傳到伺服器
    }
  }

}
