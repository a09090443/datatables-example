import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbDate, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Subject} from "rxjs";
import DataTables from "datatables.net";
import {DataTableDirective, DataTablesModule} from "angular-datatables";

declare function test(): void;

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgbDatepickerModule,
    HttpClientModule,
    DataTablesModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  isLoading = true;

  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  posts: any;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective | undefined;
  dtTrigger: Subject<any> = new Subject();

  onDateSelect(date: NgbDate) {
    console.log(date);
  }

  allUsers: any = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.dtOptions = {
      pageLength: 10,
      responsive: true,
      dom: 'Bfrtip',
      columns: [
        {
          width: '2%',
          class: 'dt-control',
          orderable: false,
          data: null,
          defaultContent: ''
        },
        {data: 'name'},
        {data: 'location'},
        {data: 'price'},
        {data: 'status'},
        {
          data: ''
        },
      ],
      order: {
        idx: 1,
        dir: ''
      },
      columnDefs: [{ targets: 0, orderable: false }],
      // buttons: [
      //   {
      //     className: '',
      //     extend: 'excel',
      //     sheetName: 'Company Code',
      //     title: 'Company Code List',
      //     exportOptions: {
      //       columns: [1, 2, 3],
      //       modifier: {
      //         page: 'current',
      //       },
      //     },
      //   },
      //   {
      //     extend: 'print',
      //     exportOptions: {
      //       columns: [1, 2, 3],
      //     },
      //   },
      // ],
    };

    this.http
      .get('assets/data.json')
      .subscribe((posts) => {
        this.posts = posts;
        this.isLoading = false;
        this.rerender();
        console.log(this.posts)
      });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  rerender(): void {
    // @ts-ignore
    this.dtElement?.dtInstance.then((dtInstance: DataTables["Api"]) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
