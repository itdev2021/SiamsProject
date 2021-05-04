import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
export class DisbursementService {

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
  formDV = this.fb.group({
    DisbursementID: [0],
    DisbursementDate: [0],
    SupplierID: ['', Validators.required],
    Supplier: ['', Validators.required],
    PayType: ['', Validators.required],
    CheckNo: [''],
    BankID: [0],
    BankName: [''],
    AccountTitleCreditID: ['', Validators.required],
    AccountTitleCredit: ['', Validators.required],
    Remarks: [''],
    TotalCash: [0],
    TotalCheck: [0],
    TotalOffset: [0],
    TotalDeposit: [0],
    TotalPayment: [0, Validators.required],
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
    (<FormArray>this.formDV.get('items')).push(
      this.fb.group({
        DisbursementDetailID: [0],
        ReferenceNo: row.ReferenceNo,
        TranNo: this.globalService.padLeft(row.ReceivingReceiptID, '0', 10),
        TranDate: row.ReceivingDate,
        Remarks: row.Remarks,
        BillingAmt: row.TotalCost,
        NetAmt: row.NetTotalCost,
        AccountTitleDebitID: row.AccountDebitID,
        AccountTitleDebit: row.AccountDebit
      })
    );
    this.updateTotal();
  }

  updateTotal() {
    let sumTotalCash = 0;
    let sumTotalCheck = 0;
    let sumTotalOffset = 0;
    let sumTotalDeposit = 0;
    let sumTotalPayment = 0;
    for (let x = 0; x < this.formDV.get('items')['length']; x++) {
      sumTotalCash += parseFloat(this.formDV.get('items').value[x].NetAmt)
      sumTotalPayment += parseFloat(this.formDV.get('items').value[x].NetAmt);
    }
    this.formDV.patchValue({
      TotalCash: (Number(sumTotalCash).toLocaleString('en-GB')),
      TotalCheck: (Number(sumTotalCheck).toLocaleString('en-GB')),
      // TotalOffset: (Number(sumTotalOffset).toLocaleString('en-GB')),
      // TotalDeposit: (Number(sumTotalDeposit).toLocaleString('en-GB')),
      TotalPayment: (Number(sumTotalPayment).toLocaleString('en-GB'))
    });
  }

  getPatchSupplier(row) {
    return this.formDV.patchValue({
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
        this.formDV.controls.AccountTitleCreditID.patchValue(bank.filter(x => x.BankID == this.formDV.value.BankID)[0].AccountTitleID)
        this.formDV.controls.AccountTitleCredit.patchValue(acct.filter(x => x.AccountTitleID == this.formDV.value.AccountTitleCreditID)[0].AccountTitle);
      });
    });
  }

  getPatchAccountTitle(row, i, item) {
    for (let x = 0; x < this.formDV.get('items')['length']; x++) {
      if (x == i) {
        item.patchValue({
          AccountTitleDebitID: row.AccountTitleID,
          AccountTitleDebit: row.AccountTitle
        });
      }
    }
  }


  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formDV.value,
      DisbursementDetail: this.formDV.get('items').value
    }
    return this.http.post(environment.apiURL + '/Disbursement', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/Disbursement');
  }

  getReceivingReceiptInfoBy(id: number): any {
    return this.http.get(environment.apiURL + '/ReceivingReceipt/references/' + id);
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/Disbursement/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/Disbursement/ledgerDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/Disbursement/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {

      this.formDV.patchValue({
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
        TotalPayment: (Number(parseFloat(res.dv.TotalPayment).toFixed(2)).toLocaleString('en-GB')),
        Status: res.dv.Status,
        IsPrinted: res.dv.IsPrinted,
        RC: res.dv.RC,
        RCU: res.dv.RCU,
      });


      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formDV.patchValue({
          Supplier: listArray.filter(x => x.PayToID == res.dv.SupplierID)[0].PayTo
        });
      });

      this.bankService.getBankList().subscribe(bank => {
        let bankList;
        bankList = bank;
        this.formDV.controls.BankName.patchValue(bankList.filter(x => x.BankID == res.dv.BankID)[0].BankName);
      });

      this.acctTitleService.getAccountTitleList().subscribe(resacct => {
        let acct;
        acct = resacct;
        this.formDV.controls.AccountTitleCredit.patchValue(acct.filter(x => x.AccountTitleID == res.dv.AccountTitleCreditID)[0].AccountTitle);
      });

      this.formDV.setControl('items', this.setExistingItems(res.dvDetails));

      this.getItemLedgerDetails(parseInt(res.dv.DisbursementID));
    });
  }

  setExistingItems(itemSets): FormArray {
    var Debitlist = [];

    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        Debitlist = res as [];
        formArray.push(this.fb.group({
          DisbursementDetailID: i.DisbursementDetailID,
          TranNo: this.globalService.padLeft(i.TranNo, '0', 10),
          TranDate: i.TranDate,
          ReferenceNo: i.ReferenceNo,
          Remarks: i.Remarks,
          BillingAmt: i.BillingAmt,
          NetAmt: i.NetAmt,
          AccountTitleDebitID: i.AccountTitleDebitID,
          AccountTitleDebit: Debitlist.filter(u => u.AccountTitleID == i.AccountTitleDebitID)[0].AccountTitle,
        }))
      });
    });
    return formArray;
  }

  getItemLedgerDetails(id) {

    this.getLedgerDetails(id).subscribe(item => {
      const listArray = [...item.srDebit, ...item.srCredit];
      this.formDV.setControl('voucherDetails', this.voucherDetails(listArray));
      this.formDV.setControl('itemsLedger', this.ledgerDetails(listArray));
    })
  }

  ledgerDetails(itemSets): FormArray {
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

  voucherDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    var groupedByData = this.groupByKey(itemSets, 'AccountCode')
    Object.keys(groupedByData);
    (Object.keys(groupedByData)).forEach(x => {
      formArray.push(this.fb.group({
        AccountCode: x,
        AccountTitle: groupedByData[x].map(x => x.AccountTitle)[0],
        Debit: (groupedByData[x].map(x => x.Debit)).reduce(function (a, b) { return a + b; }, 0),
        Credit: (groupedByData[x].map(x => x.Credit)).reduce(function (a, b) { return a + b; }, 0)
      }))
      this.voucherDebit += (groupedByData[x].map(x => x.Debit)).reduce(function (a, b) { return a + b; }, 0);
      this.voucherCredit += (groupedByData[x].map(x => x.Credit)).reduce(function (a, b) { return a + b; }, 0);
    })
    return formArray;
  }

  groupByKey(data, key) {
    return data.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };



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