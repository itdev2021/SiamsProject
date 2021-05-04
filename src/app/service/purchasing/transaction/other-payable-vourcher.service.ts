import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { DeliveredToService } from '../../lookup/delivered-to.service';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { AccountTitleService } from '../../accounting/account-title.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class OtherPayableVourcherService {

  debit = '0';
  credit = '0';
  constructor(public http: HttpClient,
    public fb: FormBuilder,
    private deliveredService: DeliveredToService,
    private acctTitleService: AccountTitleService,) { }

  // assigning fields to control
  formOPV = this.fb.group({
    OtherPayableVoucherID: [0],
    OtherPayableVoucherDate: ['', Validators.required],
    PayTo: ['', Validators.required],
    PayToID: [0],
    PayToTypeID: [0],
    POReferenceID: [''],
    Reference: ['', Validators.required],
    Remarks: ['', Validators.required],
    Debit: [0],
    Credit: [0],
    Status: [-1],
    IsPrinted: [0],
    RC: [new Date()],
    RCU: [0],
    DeleteIDs: [''],
    items: this.fb.array([])
  });

  getPatchDelivered(row) {
    return this.formOPV.patchValue({
      PayToID: row.PayToID,
      PayTo: row.PayTo,
      PayToTypeID: row.PayToTypeID
    });
  }

  getItemRow() {
    (<FormArray>this.formOPV.get('items')).push(
      this.fb.group({
        OtherPayableVoucherDetailID: [0],
        OtherPayableVoucherID: [0],
        AccountTitleID: [-1],
        AccountTitle: [''],
        PayToID: [-1],
        PayToTypeID: [-1],
        CostUnitID: [-1],
        CostUnit: [''],
        EmployeeID: [-1],
        AssignCCEID: [-1],
        CostCenterID: [-1],
        Debit: [0],
        Credit: [0],
        Particulars: [''],
        ReferenceNo: ['']
      })
    );
  }

  getPatchAccountTitle(row, i, item) {
    item.patchValue({
      AccountTitle: row.AccountTitle,
      AccountTitleID: row.AccountTitleID,
    })
  }

  getPatchCostUnit(row, i, item) {
    item.patchValue({
      CostUnit: row.EmployeeName,
      CostUnitID: row.CostUnitID,
      EmployeeID: row.EmployeeID,
      AssignCCEID: row.EmployeeID,
      CostCenterID: row.CostCenterID,
      DivisionID: row.DivisionID,
    })
  }


  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formOPV.value,
      OtherPayableVoucherDetail: this.formOPV.get('items').value
    }
    return this.http.post(environment.apiURL + '/OtherPayableVoucher', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/OtherPayableVoucher');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/OtherPayableVoucher/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/OtherPayableVoucher/ledgerDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/OtherPayableVoucher/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  updatePrintSTS(frmPV) {
    return this.http.post(environment.apiURL + '/JournalEntryPrintInfo', frmPV);
  }


  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formOPV.patchValue({
        OtherPayableVoucherID: res.pv.OtherPayableVoucherID,
        OtherPayableVoucherDate: res.pv.OtherPayableVoucherDate,
        POReference: res.pv.POReference,
        Reference: res.pv.Reference,
        Remarks: res.pv.Remarks,
        Debit: res.pv.Debit,
        Credit: res.pv.Credit,
        Status: res.pv.Status,
        IsPrinted: res.pv.IsPrinted,
        RC: res.pv.RC,
        RCU: res.pv.RCU
      });

      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formOPV.patchValue({
          PayTo: (res.pv.PayToID == 0 ? '' : listArray.filter(x => x.PayToID == res.pv.PayToID)[0].PayTo)
        });
      });

      // this.totalAmount = res.sts.TotalAmt,
      this.formOPV.setControl('items', this.setExistingItems(res.pvDetails));

      this.getItemLedgerDetails(parseInt(res.pv.OtherPayableVoucherID));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        OtherPayableVoucherDetailID: i.OtherPayableVoucherDetailID,
        OtherPayableVoucherID: i.OtherPayableVoucherID,
        AccountTitleID: i.AccountTitleID,
        AccountCode: i.Code,
        AccountTitle: i.AccountTitle,
        CostUnitID: i.CostUnitID,
        CostUnit: i.EmployeeName,
        EmployeeID: i.EmployeeID,
        AssignCCEID: i.AssignCCEID,
        CostCenterID: i.CostCenterID,
        Debit: i.Debit,
        Credit: i.Credit,
        Particulars: i.Particulars,
        ReferenceNo: i.ReferenceNo,
      }))
    });
    return formArray;
  }

  // Print Information
  getSTSPrintInfoByID(id): any {
    return this.http.get(environment.apiURL + '/JournalEntryPrintInfo/' + id);
  }

  getItemLedgerDetails(id) {

    this.getLedgerDetails(id).subscribe(item => {
      const listArray = [...item];
      this.formOPV.setControl('voucherDetails', this.voucherDetails(listArray));
      this.formOPV.setControl('itemsLedger', this.ledgerDetails(listArray));
    })
  }

  ledgerDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        formArray.push(this.fb.group({
          AccountCode: i.AccountCode,
          AccountTitle: i.AccountTitle,
          Debit: i.Debit,
          Credit: i.Credit,
        }))
      });
      this.debit += i.Debit;
      this.credit += i.Credit;
    });
    return formArray;
  }

  voucherDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        formArray.push(this.fb.group({
          ReferenceNo: i.ReferenceNo,
          AccountCode: i.AccountCode,
          AccountTitle: i.AccountTitle,
          Debit: i.Debit,
          Credit: i.Credit,
        }))
      });
      this.debit += i.Debit;
      this.credit += i.Credit;
    });
    return formArray;
  }

  // Create PDF
  PrintDocument(fg: FormGroup) {
    const documentDefinition = {
      pageSize: 'LETTER',
      pageOrientation: "portrate",
      content: [
        // Size letter 
        //8.5inc 230cm = 460 (230 / 8.5 = 27.05)
        //11inc  275cm = 745 (280 / 11 = 25)
        // // margin: [left, top, right, bottom]

        // // margin: [horizontal, vertical]
        // { text: 'another text', margin: [5, 2] },

        // // margin: equalLeftTopRightBottom
        // { text: 'last one', margin: 5 }

        {
          columns: [
            {
              width: 450,
              text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0]
            },
            {
              width: '*',
              text: "Print Date: " + formatDate(new Date, "MM/dd/yyyy", ('en-US')) + '\nPrintTime: ' + formatDate(new Date, "hh:mm:ss aa", ('en-US')), fontSize: 7, margin: [0, 5, 0, 0],

            },
          ]
        },

        { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },
        { text: "Payable Voucher", fontSize: 10, bold: true, margin: [0, 0, 0, 0] },

        {
          columns: [
            {
              width: 150,
              text: 'Transaction # : ' + fg.value.OtherPayableVoucherID
            },
            {
              width: 290,
              text: fg.value.HeaderReference
            },
            {
              width: '*',
              text: 'Date Entry : ' + formatDate(fg.value.OtherPayableVoucherDate, "MM/dd/yyyy", ('en-US'))
            },

          ], margin: [0, 10, 0, 0], fontSize: 8
        },
        { text: 'Payable To : ' + fg.value.PayTo, fontSize: 8, margin: [0, 5, 0, 0] },
        { text: 'Remarks : ' + fg.value.Remarks, fontSize: 8, margin: [0, 5, 0, 5] },

        // line
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, -1] },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }], margin: [0, 0, 0, 2] },
        this.getDocumentDetails(fg),

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, 0] },

        {
          table: {
            widths: [50, 240, 100, 60, 60],
            body: [
              ['', '', '', '', ''],
              ['', '',
                { text: 'Grand Total', bold: true },
                { text: Number(parseFloat(fg.value.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                { text: Number(parseFloat(fg.value.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
              ],

            ]
          },
          layout: 'noBorders',
          fontSize: 9, bold: true, margin: [0, 0],
        },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, 0] },



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
        return {

          columns: [
            {
              width: '22%',
              text: "Page " + currentPage.toString() + ' of ' + pageCount, fontSize: 7
            },
            {
              width: '58%',
              text: ''
            },
            {
              width: '20%',
              columns: [
                {
                  text: 'Printed by:', fontSize: 8, bold: true
                },
                {
                  text: 'Administrator', fontSize: 8, bold: true
                }
              ]
            }
          ], margin: [10, 0, 0, 0],

        };
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  getDocumentDetails(fg: FormGroup) {
    return {
      layout: 'headerLineOnly',
      table: {
        headerRows: 1,
        widths: [50, 210, 100, 60, 60],
        body: [
          [
            { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Cost Unit', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
            { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],
          ...fg.value.items.map(res => {
            return [
              res.AccountCode,
              res.AccountTitle,
              res.CostUnit,
              { text: Number(parseFloat(res.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
              { text: Number(parseFloat(res.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' }
            ];
          }),
        ],
      },
      fontSize: 9, margin: [0, 0],
      canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }]
    };
  }


  // Ledger
  PrintLedger(fg: FormGroup) {
    const documentDefinition = {
      pageSize: 'LETTER',
      pageOrientation: "portrate",
      content: [
        // Size letter 
        //8.5inc 230cm = 460 (230 / 8.5 = 27.05)
        //11inc  275cm = 745 (280 / 11 = 25)
        // // margin: [left, top, right, bottom]
        // { columns:['sample']},

        // // margin: [horizontal, vertical]
        // { text: 'another text', margin: [5, 2] },

        // // margin: equalLeftTopRightBottom
        // { text: 'last one', margin: 5 }

        { text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0] },
        { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },


        { text: "Payable Voucher Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }] },

        {
          columns: [
            { text: 'Transaction # : ' + fg.value.OtherPayableVoucherID, fontSize: 10, margin: [0, 10, 0, 0] },
            { text: 'Date Entry : ' + formatDate(fg.value.OtherPayableVoucherDate, "MM/dd/yyyy", ('en-US')), fontSize: 10, margin: [0, 10, 0, 0] },
          ], margin: [0, 5, 0, 0]
        },
        { text: 'Payable To : ' + fg.value.PayTo, fontSize: 10, margin: [0, 5, 0, 0] },
        {
          columns: [
            { text: 'P.O # : ' + fg.value.POReferenceID, fontSize: 10, margin: [0, 0, 0, 0] },
            { text: 'Reference # : ' + fg.value.Reference, fontSize: 10, margin: [0, 0, 0, 0] }

          ], margin: [0, 5, 0, 5]
        },

        // line
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }] },

        this.getPrintLedgerDetails(fg),
        {

          table: {
            widths: [50, 240, 100, 60, 60],
            body: [
              ['', '', '', '', ''],
              ['', '', '',
                { text: Number(parseFloat(fg.value.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
                { text: Number(parseFloat(fg.value.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
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
      footer: [
        {
          columns: [
            {
              width: '10%',
              text: '', fontSize: 10, bold: true
            },
            {
              width: '60%',
              text: ''
            },
            {
              width: '20%',
              columns: [
                {
                  text: 'Printed by:', fontSize: 8, bold: true
                },
                {
                  text: 'Administrator', fontSize: 8, bold: true
                }
              ]
            }
          ], margin: [0, 0, 0, 0],
        }
      ],
      stylesFooter: {
        fontSize: 10,
        bold: true
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  getPrintLedgerDetails(fg: FormGroup) {
    return {
      layout: 'headerLineOnly',
      table: {
        headerRows: 1,
        widths: [50, 324, 60, 60],
        body: [
          [
            { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
            { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],

          ...fg.value.items.map(res => {
            return [
              res.AccountCode,
              res.AccountTitle,
              { text: Number(parseFloat(res.Debit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' },
              { text: Number(parseFloat(res.Credit).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), alignment: 'right' }
            ];
          }),
        ]
      },
      fontSize: 9, margin: [0, 0],
    };
  }
}
