import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { AccountTitleService } from '../../accounting/account-title.service';
import { DeliveredToService } from '../../lookup/delivered-to.service';
import { GlobalService } from '../../global.service';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { BankService } from '../../accounting/bank.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class DisbursementFATService {
  totalAmount = '0';
  referenceList = [];
  debit: number = 0;
  credit: number = 0;
  voucherDebit: number = 0;
  voucherCredit: number = 0;

  constructor(public http: HttpClient,
    public fb: FormBuilder,
    private acctTitleService: AccountTitleService,
    private deliveredService: DeliveredToService,
    private bankService: BankService,
    private globalService: GlobalService) { }

  // assigning fields to control
  formDFAT = this.fb.group({
    DisbursementFATID: [0],
    DisbursementFATDate: [0],
    SupplierID: ['', Validators.required],
    Supplier: ['', Validators.required],
    Remarks: [''],
    TotalPayment: [0, Validators.required],
    BankID:[0],
    BankName:[''],
    CheckNo:[''],
    Status: [-1],
    IsPrinted: [0],
    RC: [new Date()],
    RCU: [0],

    DeleteIDs: [''],
    items: this.fb.array([]),
    voucherDetails: this.fb.array([]),
    itemsLedger: this.fb.array([])
  });


  getItemRow(row) {
    (<FormArray>this.formDFAT.get('items')).push(
      this.fb.group({
        DisbursementFATDetailID: [0],
        ReferenceNo: row.ReferenceNo,
        TranNo: this.globalService.padLeft(row.ReceivingReceiptID, '0', 10),
        TranDate: row.ReceivingDate,
        Remarks: row.Remarks,
        BillingAmt: row.TotalCost,
        AdvsReference: [''],
        AdvsAmt: [0],
        OutstandingAmt: [0],
        AccountTitleDebitID: [row.AccountDebitID],
        AccountTitleDebit: row.AccountDebit,
        AccountTitleCredit: [''],
        AccountTitleCreditID: [0]
      })
    );
  }

  getAdvsReference(row, item) {
    item.patchValue({
      AdvsReference: this.globalService.padLeft(row.CashDisbursementDPID, '0', 10),
      AdvsAmt: row.TotalPayment,
      OutstandingAmt: (item.value.BillingAmt - row.TotalPayment),
      AccountTitleCreditID: row.AccountTitleCreditID,
      AccountTitleCredit: row.AccountTitleCredit,
    });
    this.updateTotal(item);
  }

  getPatchSupplier(row) {
    return this.formDFAT.patchValue({
      SupplierID: row.PayToID,
      Supplier: row.PayTo
    });
  }

  getPatchBank() {
    let bank = [];
    let acct = [];
    this.bankService.getBankList().subscribe(res => {
      this.acctTitleService.getAccountTitleList().subscribe(resacct => {
        bank = res as [];
        acct = resacct as [];
        this.formDFAT.controls.AccountTitleCreditID.patchValue(bank.filter(x => x.BankID == this.formDFAT.value.BankID)[0].AccountTitleID)
        this.formDFAT.controls.AccountTitleCredit.patchValue(acct.filter(x => x.AccountTitleID == this.formDFAT.value.AccountTitleCreditID)[0].AccountTitle);
      });
    });
  }

  getPatchAccountTitle(row, i, item, Acct) {
    for (let x = 0; x < this.formDFAT.get('items')['length']; x++) {
      if (x == i) {
        if (Acct == "Debit") {
          item.patchValue({
            AccountTitleDebitID: row.AccountTitleID,
            AccountTitleDebit: row.AccountTitle
          });
        } else {
          item.patchValue({
            AccountTitleCreditID: row.AccountTitleID,
            AccountTitleCredit: row.AccountTitle
          });
        }
      }
    }
  }

  updateTotal(item) {
    let sumTotalPayment = 0;

    for (let x = 0; x < this.formDFAT.get('items')['length']; x++) {
      sumTotalPayment += parseFloat((<HTMLInputElement>document.getElementById("AdvsAmt" + x)).value);
    }
    this.formDFAT.patchValue({
      TotalPayment: (Number(sumTotalPayment).toLocaleString('en-GB'))
    });

  }

  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formDFAT.value,
      DisbursementFATDetail: this.formDFAT.get('items').value
    }
    return this.http.post(environment.apiURL + '/DisbursementFAT', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/DisbursementFAT');
  }

  getReceivingReceiptInfoBy(id: number): any {
    return this.http.get(environment.apiURL + '/ReceivingReceipt/references/' + id);
  }

  getAdvsToReference(id: number): any {
    return this.http.get(environment.apiURL + '/DisbursementDP/advsTo/' + id);
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/DisbursementFAT/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/DisbursementFAT/ledgerDetails/' + id);
  }

  getVoucherDetails(id): any {
    return this.http.get(environment.apiURL + '/DisbursementFAT/voucherDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/DisbursementFAT/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {

      this.formDFAT.patchValue({
        DisbursementFATID: this.globalService.padLeft(res.dv.DisbursementFATID, '0', 10),
        DisbursementFATDate: res.dv.DisbursementFATDate,
        SupplierID: res.dv.SupplierID,
        Remarks: res.dv.Remarks,
        TotalPayment: (Number(res.dv.TotalPayment).toLocaleString('en-GB')),
        Status: res.dv.Status,
        IsPrinted: res.dv.IsPrinted,
        RC: res.dv.RC,
        RCU: res.dv.RCU,
      });


      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formDFAT.patchValue({
          Supplier: listArray.filter(x => x.PayToID == res.dv.SupplierID)[0].PayTo
        });
      });

      this.formDFAT.setControl('items', this.setExistingItems(res.dvDetails));

      this.getItemLedgerDetails(parseInt(res.dv.DisbursementFATID));

      this.getItemVoucherDetails(parseInt(res.dv.DisbursementFATID));
    });
  }

  setExistingItems(itemSets): FormArray {
    var Debitlist = [];

    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        Debitlist = res as [];

        formArray.push(this.fb.group({
          DisbursementFATDetailID: i.DisbursementFATDetailID,
          TranNo: this.globalService.padLeft(i.TranNo, '0', 10),
          TranDate: formatDate(i.TranDate, "MM/dd/yyyy", ('en-US')),
          ReferenceNo: i.ReferenceNo,
          Remarks: i.Remarks,
          BillingAmt: i.BillingAmt,
          AdvsReference: i.AdvsReference,
          AdvsAmt: i.AdvsAmt,
          OutstandingAmt: i.OutstandingAmt,
          AccountTitleDebitID: i.AccountTitleDebitID,
          AccountTitleDebit: (i.AccountTitleDebitID == 0 ? '' : Debitlist.filter(u => u.AccountTitleID == i.AccountTitleDebitID)[0].AccountTitle),
          AccountTitleCreditID: i.AccountTitleCreditID,
          AccountTitleCredit: (i.AccountTitleCreditID == 0 ? '' : Debitlist.filter(u => u.AccountTitleID == i.AccountTitleCreditID)[0].AccountTitle),
        }))
      });
    });
    return formArray;
  }

  getItemLedgerDetails(id) {
    this.getLedgerDetails(id).subscribe(item => {
      const listArray = [...item.srDebit, ...item.srCredit];
      this.formDFAT.setControl('voucherDetails', this.voucherDetails(listArray));
    })
  }
  
  ledgerDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    this.debit += 0;
      this.credit += 0;
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

  getItemVoucherDetails(id) {
    this.getVoucherDetails(id).subscribe(item => {
      const listArray = [...item.srDebit, ...item.srCredit];
      this.formDFAT.setControl('itemsLedger', this.voucherDetails(listArray));
    })
  }

  voucherDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    this.debit += 0;
      this.credit += 0;
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
        { text: "Generated Debit Memo #" + this.globalService.padLeft(fg.value.DisbursementFATID, '0', 10), fontSize: 8, bold: true, margin: [0, 50, 0, 0] },
        {
          columns: [
            {
              width: 320,
              text: fg.value.Supplier, fontSize: 13, bold: true,
            },
            {
              width: 90,
              text: formatDate(fg.value.DisbursementFATDate, "MM/dd/yyyy", ('en-US')), fontSize: 13, bold: true,
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
            { width: '*', text: ' : ' + formatDate(fg.value.DisbursementFATDate, "MM/dd/yyyy", ('en-US')), fontSize: 8, margin: [0, 10, 0, 0], }
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
                { text: Number(this.debit).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right', margin: [0, 0, 5, 0] },
                { text: Number(this.credit).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 9, bold: true, alignment: 'right' },
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