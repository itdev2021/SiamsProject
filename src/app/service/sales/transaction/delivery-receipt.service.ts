import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { DeliveredToService } from '../../lookup/delivered-to.service';
import { GlobalService } from '../../global.service';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class DeliveryReceiptService {



  constructor(public http: HttpClient,
    public fb: FormBuilder,

    private globalService: GlobalService) { }

  // assigning fields to control
  formDR = this.fb.group({
    DeliveryReceiptID: [0],
    DeliveryDate: [''],
    CustomerID: [''],
    Customer: ['', Validators.required],
    ShippToAddressID: [0],
    ShippToAddress: [''],
    CostUnitID: [0],
    EmployeeID: [0],
    Employee: [''],
    CostCenterID: [0],
    AssignCCEID: [0],
    IsMember: [false],
    WarehouseID: ['', Validators.required],
    CreditTermsID: ['', Validators.required],
    ReferencePO: [''],
    Notes: [''],
    PriceListID: [0],
    DiscountSchemeID: [0],
    DRTypeID: [0],
    PreparedByID: [0],
    IsPrinted: [0],
    Status: [-1],
    RC: [new Date()],
    RCU: [''],
    DeleteIDs: [''],
    items: this.fb.array([])
  });


  getItemRow(row) {
    (<FormArray>this.formDR.get('items')).push(
      this.fb.group({
        DeliveryReceiptDetailID: [0],
        DeliveryReceiptID: [0],
        ProductID: [row.ProductCode],
        Product: [row.Product],
        UOMID: [0],
        UOM: [0],
        Quantity: [0],
        LotNo: [''],
        ExpiryDate: [''],
        Particulars: [''],
        ProductionDate: [''],
        PoNumber: [''],
        IsFree: [false],
      })
    );
  }

  getPatchCustomer(row) {
    return this.formDR.patchValue({
      CustomerID: row.PayToID,
      Customer: row.PayTo
    });
  }

  getPatchCustomerShipAdd(row) {
    return this.formDR.patchValue({
      ShippToAddressID: row.ShipToID,
      ShippToAddress: row.ShipAddress
    });
  }

  getPatchCostUnit(row) {
    return this.formDR.patchValue({
      CostUnitID: row.CostUnitID,
      CostUnit: row.CostUnit,
      EmployeeID: row.EmployeeID,
      Employee: row.EmployeeName,
      CostCenterID: row.CostCenterID,
      AssignCCEID: 1,
    });
  }


  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formDR.value,
      DeliveryReceiptDetail: this.formDR.get('items').value
    }
    return this.http.post(environment.apiURL + '/DeliveryReceipts', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/DeliveryReceipts');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/DeliveryReceipts/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/DeliveryReceipts/ledgerDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/DeliveryReceipts/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {

      this.formDR.patchValue({
        DisbursementID: this.globalService.padLeft(res.dv.DisbursementID, '0', 10),
        DisbursementDate: res.dv.DisbursementDate,
        SupplierID: res.dv.SupplierID,
        PayType: res.dv.PayType,
        CheckNo: res.dv.CheckNo,
        BankID: res.dv.BankID,
        AccountTitleCreditID: res.dv.AccountTitleCreditID,
        AccountTitleCredit: res.dv.AccountTitleCredit,
        Remarks: res.dv.Remarks,
        TotalCash: (Number(res.dv.TotalCash).toLocaleString('en-GB')),
        TotalCheck: (Number(res.dv.TotalCheck).toLocaleString('en-GB')),
        TotalOffset: (Number(res.dv.TotalOffset).toLocaleString('en-GB')),
        TotalDeposit: (Number(res.dv.TotalDeposit).toLocaleString('en-GB')),
        TotalPayment: (Number(res.dv.TotalPayment).toLocaleString('en-GB')),
        Status: res.dv.Status,
        IsPrinted: res.dv.IsPrinted,
        RC: res.dv.RC,
        RCU: res.dv.RCU,
      });


      // this.deliveredService.getList().subscribe(item => {
      //   const listArray = [...item.supplier, ...item.customer, ...item.employee];
      //   this.formDV.patchValue({
      //     Supplier: listArray.filter(x => x.PayToID == res.dv.SupplierID)[0].PayTo
      //   });
      // });

      this.formDR.setControl('items', this.setExistingItems(res.dvDetails));
    });
  }

  setExistingItems(itemSets): FormArray {
    var Debitlist = [];

    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        DisbursementDetailID: i.DisbursementDetailID,
        TranNo: this.globalService.padLeft(i.TranNo, '0', 10),
        TranDate: i.TranDate,
        ReferenceNo: i.ReferenceNo,
        Remarks: i.Remarks,
        BillingAmt: i.BillingAmt,
        NetAmt: i.NetAmt,

      }))

    });
    return formArray;
  }








  // Create PDF
  // Printing Information
  // Size letter 
  //8.5inc 230cm = 460 (230 / 8.5 = 27.05)
  //11inc  275cm = 745 (280 / 11 = 25)
  // // margin: [left, top, right, bottom]

  // // margin: [horizontal, vertical]
  // { text: 'another text', margin: [5, 2] },

  // // margin: equalLeftTopRightBottom
  // { text: 'last one', margin: 5 }

  // Print Document Header
  PrintDocument(fg: FormGroup) {
    const documentDefinition = {
      pageSize: 'LETTER',
      pageOrientation: "portrate",
      content: [
        { text: "Generated Debit Memo #" + this.globalService.padLeft(fg.value.DisbursementID, '0', 10), fontSize: 8, bold: true, margin: [0, 50, 0, 0] },
        {
          columns: [
            {
              width: 320,
              text: fg.value.Supplier, fontSize: 13, bold: true,
            },
            {
              width: 90,
              text: formatDate(fg.value.DisbursementDate, "MM/dd/yyyy", ('en-US')), fontSize: 13, bold: true,
            },
            {
              width: 100,
              text: 'STS # : ' + fg.value.STSNo, margin: [0, 2, 0, 0]
            },
            {
              width: 290,
              text: fg.value.HeaderReference
            },

          ], margin: [0, 20, 0, 0], fontSize: 8
        },
        { text: fg.value.Address, fontSize: 12, bold: true, margin: [0, 0, 0, 0] },
        this.getDocumentDetails(fg),
      ],

      footer: [
        { text: 'Prepared by: ' + fg.value.PreparedByName, fontSize: 12, bold: true, margin: [50, -200, 0, 25] },
        { text: fg.value.CheckedByName, fontSize: 12, bold: true, margin: [125, -0, 0, 0] },
      ],


    };
    pdfMake.createPdf(documentDefinition).open();
  }
  // Print Document Details
  getDocumentDetails(fg: FormGroup) {
    return {
      layout: 'noBorders',
      table: {
        headerRows: 1,
        widths: [40, 50, 270, 50, 50],
        body: [
          [
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],

          ...fg.value.items.map(res => {
            return [
              res.ReferenceNo,
              formatDate(res.ExpiryDate, "MM/dd/yyyy", ('en-US')),
              res.Product,
              res.UOMDescription,
              { text: Number(parseFloat(res.Quantity).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' }
            ];
          }),
        ]
      },
      fontSize: 9, margin: [0, 40, 0, 0],
    };
  }

  // Ledger
  PrintLedger(fg: FormGroup) {
    const documentDefinition = {
      pageSize: 'LETTER',
      pageOrientation: "portrate",
      content: [
        { text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0] },
        { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },
        { text: "Cash Disbursement Journal Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 2.5 }] },
        {
          columns: [
            { width: '15%', text: 'Transaction # ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + this.globalService.padLeft(fg.value.DisbursementID, '0', 10), fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Disbursement Date ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + formatDate(fg.value.DisbursementDate, "MM/dd/yyyy", ('en-US')), fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Payable To ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + fg.value.Supplier, fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Remarks # ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + fg.value.Remarks, fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 2.5 }] },

        this.getPrintFLedgerDetails(fg),

        {
          table: {
            widths: [50, 50, 270, 62, 60],
            body: [
              ['', '', '', '', ''],
              ['', '', { text: 'TOTAL', fontSize: 10, bold: true, alignment: 'right' },
                // { text: Number(this.debit).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right', margin: [0, 0, 5, 0] },
                // { text: Number(this.credit).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
              ],

            ]
          },
          layout: 'noBorders',
          fontSize: 9, bold: true, margin: [0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black'
        }
      },

      footer: function (currentPage, pageCount) {
        return [
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 552 - 0, y2: 5, lineWidth: 2.5 }], margin: [30, 0, 0, 0], },
          {
            columns: [
              {
                width: '40%',
                text: 'Generated by : System Administrator', fontSize: 8, bold: true, alignment: 'left', margin: [30, 5, 0, 0],
              },
              {
                width: '*',
                text: "Page " + currentPage.toString() + ' of ' + pageCount, fontSize: 8, alignment: 'center', margin: [30, 5, 0, 0],
              },
              {
                width: '40%',
                text: 'Generation Date: ' + formatDate(new Date(), "MM/dd/yyyy hh:mm:ss a", ('en-US')), fontSize: 8, bold: true, alignment: 'right', margin: [30, 5, 30, 0],
              }
            ],
          }];
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  // Get Details
  getPrintFLedgerDetails(fg: FormGroup) {
    return {
      layout: 'headerLineOnly',
      table: {
        headerRows: 1,
        widths: [50, 50, 240, 60, 60],
        body: [
          [
            { text: 'Reference', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
            { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],
          ...fg.value.itemsLedger.map(res => {
            return [
              res.ReferenceNo,
              res.AccountCode,
              res.AccountTitle,
              { text: Number(parseFloat(res.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
              { text: Number(parseFloat(res.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
            ];
          }),
        ]
      },
      fontSize: 9, margin: [0, 0, 0, 0],
    };
  }





}