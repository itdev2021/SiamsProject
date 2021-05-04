import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { GlobalService } from '../../global.service';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  totalAmount = '0';
  constructor(private http: HttpClient,
    private globalService: GlobalService,
    public fb: FormBuilder) { }

  formSTS = this.fb.group({
    STSID: [0],
    WarehouseID_From: [0],
    WarehouseID_To: [0],
    STSDate: ['', Validators.required],
    Remarks: [''],
    DeliveryAddress: [''],
    ReferenceNo: ['', Validators.required],
    Amount: [0, Validators.required],
    Status: [-1],
    IsPrinted: [0],
    AssayDate: ['0001-01-01'],
    SupplierID: [1],
    RC: [new Date()],
    RCU: [0],
    DeleteIDs: [''],
    items: this.fb.array([])
  })

  saveOrUpdate() {
    var body = {
      ...this.formSTS.value,
      STSD: this.formSTS.get('items').value
    }
    return this.http.post(environment.apiURL + '/sts', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/sts');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/sts/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/sts/' + id);
  }

  updateStatus(id: number, url) {
    return this.http.put(environment.apiURL + url + id, '');
  }


  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formSTS.patchValue({
        STSID: res.sts.STSID,
        WarehouseID_From: res.sts.WarehouseID_From,
        WarehouseID_To: res.sts.WarehouseID_To,
        STSDate: res.sts.STSDate,
        Remarks: res.sts.Remarks,
        DeliveryAddress: res.sts.DeliveryAddress,
        ReferenceNo: res.sts.ReferenceNo,
        Amount: res.sts.Amount,
        AssayDate: res.sts.AssayDate,
        SupplierID: res.sts.SupplierID,
        Status: res.sts.Status
      });
      this.totalAmount = res.sts.TotalAmt,
        this.formSTS.setControl('items', this.setExistingItems(res.stsd));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        STSDID: i.STSDID,
        STSID: i.STSID,
        Code: i.ProductCode,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOMDescription: i.UOMDescription,
        Quantity: i.Quantity,
        UnitCost: i.UnitCost,
        Amount: i.Amount,
        LotNo: i.LotNo,
        ExpiryDate: i.ExpiryDate,
        ManufacturingDate: i.ManufacturingDate,
        Particulars: i.Particulars,
        AccountTitleIDDebit: i.AccountTitleIDDebit,
        AccountTitleIDCredit: i.AccountTitleIDCredit

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

  // Print Document
  PrintDocument(fg: FormGroup) {
    const documentDefinition = {
      pageSize: 'LETTER',
      pageOrientation: "portrate",
      content: [
        { text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true,  margin: [0, 5, 0, 0] },
        { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },
        { text: "Stock Transfer", fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
        {
          columns: [
            {
              width: 200,
              text: "Transaction No: " + this.globalService.padLeft(fg.value.STSID, '0', 10), fontSize: 8, bold: false, margin: [0, 5, 0, 0]
            },
            {
              width: '*',
              text: "Date: "+ formatDate(new Date, fg.value.STSDate, ('en-US')), fontSize: 7,alignment:'right', margin: [0, 5, 0, 0],

            },
          ]
        },
        {
          columns: [
            {
              width: 150,
              text: 'Transaction # : ' + fg.value.JournalEntryID
            },
            {
              width: 290,
              text: fg.value.HeaderReference
            },
            {
              width: '*',
              text: 'Date Entry : ' + formatDate(fg.value.DateEntry, "MM/dd/yyyy", ('en-US'))
            },

          ], margin: [0, 10, 0, 0], fontSize: 8
        },
        { text: 'Payable To : ' + fg.value.PayTo, fontSize: 8, margin: [0, 5, 0, 0] },
        { text: 'Remarks : ' + fg.value.Remarks, fontSize: 8, margin: [0, 5, 0, 5] },

        // line
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }], margin: [0, 0, 0, -1] },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }], margin: [0, 0, 0, 2] },
        this.getItemObject(fg),

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

  // Ledger
  PrintLedger(fg: FormGroup) {
    const documentDefinition = {
      pageSize: 'LETTER',
      pageOrientation: "portrate",
      content: [

        { text: "DRUGMAKER'S LABORATORIES INC.", fontSize: 15, bold: true, margin: [0, 5, 0, 0] },
        { text: "E & E Industrial Complex San Pedro Laguna", fontSize: 8, margin: [0, 0, 0, 0], italics: true },


        { text: "Payable Voucher Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 1.5 }] },

        {
          columns: [
            { text: 'Transaction # : ' + fg.value.JournalEntryID, fontSize: 10, margin: [0, 10, 0, 0] },
            { text: 'Date Entry : ' + formatDate(fg.value.DateEntry, "MM/dd/yyyy", ('en-US')), fontSize: 10, margin: [0, 10, 0, 0] },
          ], margin: [0, 5, 0, 0]
        },
        { text: 'Payable To : ' + fg.value.PayTo, fontSize: 10, margin: [0, 5, 0, 0] },
        {
          columns: [
            { text: 'P.O # : ' + fg.value.HeaderReferenceID, fontSize: 10, margin: [0, 0, 0, 0] },
            { text: 'Reference # : ' + fg.value.HeaderReference, fontSize: 10, margin: [0, 0, 0, 0] }

          ], margin: [0, 5, 0, 5]
        },

        // line
        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 0.5 }] },

        this.getItemObject(fg),
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

  // Get Details
  getItemObject(fg: FormGroup) {
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

          ...this.formSTS.get('items').value.map(res => {
            return [
              res.Code,
              res.AccountTitle,
              res.CostUnit,
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
