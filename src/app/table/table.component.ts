import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatCell, MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {NgForOf, NgIf} from "@angular/common";
import {Products} from "../model/Products";
import {DataTablesModule} from "angular-datatables";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatInput} from "@angular/material/input";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    HttpClientModule,
    DataTablesModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    NgForOf,
    NgIf,
    MatCell,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatProgressSpinner,
    MatInput,
    MatCheckbox,
    FormsModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, AfterViewInit {

  pageSize = 10;
  pageSizeOptions = [10, 50, 100];
  displayedColumns: string[] = ['rowId', 'name', 'location', 'price', 'status', 'purchase_date', 'size', 'button'];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource: MatTableDataSource<Products[]> = new MatTableDataSource<Products[]>();
  @ViewChild(MatSort) dataSort: MatSort = new MatSort();

  selection = new SelectionModel<Products[]>(true, []);

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.dataSort.disableClear = true;
    this.dataSource.sort = this.dataSort;
  }

  fetchData(): void {
    this.http.get('assets/data.json').subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.dataSort;
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  public send(){
    console.log(this.selection.selected);
  }
}
