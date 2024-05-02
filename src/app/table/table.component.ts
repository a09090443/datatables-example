import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbDate, NgbDatepickerModule, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Subject} from "rxjs";
import DataTables, {Config} from "datatables.net";
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
export class TableComponent implements OnInit {

  constructor(private modalService: NgbModal, private http: HttpClient) {}

  dtOptions: Config = {};

  ngOnInit(): void {
    const self = this;
    this.dtOptions = {
      ajax: 'assets/data2.json',
      columns: [
        {
          width: '1%',
          orderable: false,
          data: null,
          defaultContent: '',
          className: 'dt-control'
        },
        {
          title: 'Name',
          data: 'name'
        },
        {
          title: 'Location',
          data: 'location'
        },
        {
          title: 'Price',
          data: 'price'
        },
        {
          title: 'Status',
          data: 'status'
        },
        {
          title: 'PurchaseDate',
          data: 'purchase_date',
          className: 'none'
        },
        {
          title: 'Size',
          data: 'size',
          className: 'none'
        },
        {
          width: '10%', data: null, title: "操作功能", orderable: false,
          render: function (data, type, row) {
            return '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsOOptiu8RJfPNOP4DkkBdRbGZghdHycRyyQ&s" alt="placeholder" width="150" height="150" />'
          },
          className: 'none'
        },
        {
          width: '10%', data: null, title: "操作功能", orderable: false,
          render: function (data, type, row) {
            return '<button class="btn btn-primary" #edit (click)="test()" id="edit">編輯</button> ' +
              '<button type="button" id="del" class="btn btn-danger btn-sm">刪除</button>'
          },
        },
      ],
      responsive: true,
      // rowCallback: (row: Node, data: any[] | Object, index: number) => {
      //   const self = this;
      //   // Unbind first in order to avoid any duplicate handler
      //   $('td.dt-control', row).off('click');
      //   $('td.dt-control', row).on('click', () => {
      //     self.someClickHandler(data);
      //   });
      //   return row;
      // },
      order: [[1, 'asc']],
      processing: true,
      //設定語言區塊(language),
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh_Hant.json"
      },
    };
  }
  closeResult: string | undefined;
  title: string | undefined;
  open(content: any, button: any) {
    if (button.id === 'add') {
      this.title = '新增資料';
    } else {
      this.title = '編輯資料';
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  test(){
    alert('test');
  }
  // message = '';
  // someClickHandler(info: any): void {
  //   this.message = info.rowId + ' - ' + info.location;
  // }

}
