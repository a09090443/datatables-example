import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Api, Config} from "datatables.net";
import {DataTableDirective, DataTablesModule} from "angular-datatables";
import 'datatables.net-responsive';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [
    DataTablesModule,
    HttpClientModule
  ],
  templateUrl: './table-example.component.html',
  styleUrl: './table-example.component.scss'
})
export class TableExampleComponent implements OnInit {
  private outputText: string | undefined;

  @ViewChild('dataModal') dataModal!: TemplateRef<any>;

  @ViewChild(DataTableDirective)
  private datatableElement: DataTableDirective | undefined;

  constructor(private modalService: NgbModal, private http: HttpClient) {
  }

  dtOptions: Config = {};

  ngOnInit(): void {
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
            return '<button type="button" id="edit" class="btn btn-warning btn-sm">編輯</button> ' +
              '<button type="button" id="del" class="btn btn-danger btn-sm">刪除</button>'
          },
        },
      ],
      responsive: true,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        $('#edit', row).off('click');
        $('#edit', row).on('click', () => {
          self.open(this.dataModal);
        });
        $('#del', row).off('click');
        $('#del', row).on('click', () => {
          self.del(row);
        });
        return row;
      },
      order: [[1, 'asc']],
      processing: true,
      //設定語言區塊(language),
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh_Hant.json"
      },
    };
  }

  closeResult: string | undefined;

  open(content: any) {
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
      return `with: ${reason}`;
    }
  }

  del(info: any) {
    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: Api<any>) => {
        dtInstance.row(info).remove().draw();
      });
    }
  }

  message = '';

  someClickHandler(info: any): void {
    this.open(this.dataModal);
    this.message = info.rowId + ' - ' + info.location;
  }

}
