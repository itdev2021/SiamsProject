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
import { CostUnitService } from '../../lookup/cost-unit.service';
import { BankService } from '../../accounting/bank.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class DisbursementDPService {

  referenceList = [];
  debit: number = 0;
  credit: number = 0;
  voucherDebit: number = 0;
  voucherCredit: number = 0;

  constructor(public http: HttpClient,
    public fb: FormBuilder,
    private acctTitleService: AccountTitleService,
    private deliveredService: DeliveredToService,
    private costUnitService: CostUnitService,
    private globalService: GlobalService,
    private bankService: BankService) { }

  // assigning fields to control
  formDDP = this.fb.group({
    CashDisbursementDPID: [0],
    CashDisbursementDPDate: ['', Validators.required],
    SupplierID: ['', Validators.required],
    Supplier: ['', Validators.required],
    CheckNo: ['', Validators.required],
    AccountTitleDebitID: ['', Validators.required],
    AccountTitleDebit: ['', Validators.required],
    AccountTitleCreditID: ['', Validators.required],
    AccountTitleCredit: ['', Validators.required],
    BankName: [''],
    Amount: ['', Validators.required],
    RecordDate: ['1/1/1900'],
    PostedDate: ['1/1/1900'],
    CostUnitID: [0],
    CostUnit: [''],
    Remarks: [''],
    Paytotypeid: [0],
    IDS: [0],
    PostedBy: [0],
    Status: [-1],
    RC: [new Date()],
    RCU: [0],
    items: this.fb.array([]),
    voucherDetails: this.fb.array([]),
    itemsLedger: this.fb.array([])
  });

  getPatchSupplier(row) {
    return this.formDDP.patchValue({
      Paytotypeid: row.PayToTypeID,
      SupplierID: row.PayToID,
      Supplier: row.PayTo
    });
  }

  getPatchCostUnit(row) {
    return this.formDDP.patchValue({
      CostUnitID: row.CostUnitID,
      CostUnit: row.EmployeeName
    });
  }

  getPatchAccountTitle(row, Acct) {
    if (Acct == "Debit") {
      return this.formDDP.patchValue({
        AccountTitleDebitID: row.AccountTitleID,
        AccountTitleDebit: row.AccountTitle
      });
    } else {
      return this.formDDP.patchValue({
        AccountTitleCreditID: row.AccountTitleID,
        AccountTitleCredit: row.AccountTitle
      });
    }
  }


  updateTotal(item) {
    let sumTotalPayment = 0;

    for (let x = 0; x < this.formDDP.get('items')['length']; x++) {
      sumTotalPayment += parseFloat((<HTMLInputElement>document.getElementById("AdvsAmt" + x)).value);
    }
    this.formDDP.patchValue({
      TotalPayment: (Number(sumTotalPayment).toLocaleString('en-GB'))
    });

  }


  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formDDP.value
    }
    return this.http.post(environment.apiURL + '/DisbursementDP', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/DisbursementDP');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/DisbursementDP/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/DisbursementDP/ledgerDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/DisbursementDP/' + id);
  }

  updateStatus(id: number, url, data) {
    console.log(data);
    return this.http.put(environment.apiURL + url + id, data);
  }


  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formDDP.patchValue({
        CashDisbursementDPID: this.globalService.padLeft(res.CashDisbursementDPID, '0', 10),
        CashDisbursementDPDate: res.CashDisbursementDPDate,
        SupplierID: res.SupplierID,
        CheckNo: res.CheckNo,
        Amount: res.Amount,
        AccountTitleDebitID: res.AccountTitleDebitID,
        CreditAccount: res.CreditAccount,
        AccountTitleCreditID: res.AccountTitleCreditID,
        RecordUser: res.RecordUser,
        RecordDate: res.RecordDate,
        PostedBy: res.PostedBy,
        PostedDate: res.PostedDate,
        CostUnitID: res.CostUnitID,
        Remarks: res.Remarks,
        Paytotypeid: res.Paytotypeid,
        IDS: res.IDS,
        Status: res.Status,
        RC: res.RC,
        RCU: res.RCU,
      });

      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formDDP.patchValue({
          Supplier: listArray.filter(x => x.PayToID == res.SupplierID)[0].PayTo
        });
      });

      this.bankService.getBankList().subscribe(bank => {
        let bankList;
        bankList = bank;
        this.formDDP.controls.BankName.patchValue(bankList.filter(x => x.AccountTitleID == res.AccountTitleCreditID)[0].BankName);
      });

      if (res.CostUnitID != 0) {
        this.costUnitService.getList().subscribe(costunilitList => {
          let costunit;
          costunit = costunilitList;
          this.formDDP.controls.CostUnit.patchValue(res.CostUnitID == 0 ? '' : costunit.filter(x => x.CostUnitID == res.CostUnitID)[0].EmployeeName)
        });
      }

      this.acctTitleService.getAccountTitleList().subscribe(resacct => {
        let acct;
        acct = resacct;
        this.formDDP.controls.AccountTitleDebit.patchValue(acct.filter(x => x.AccountTitleID == res.AccountTitleDebitID)[0].AccountTitle);
        this.formDDP.controls.AccountTitleCredit.patchValue(acct.filter(x => x.AccountTitleID == res.AccountTitleCreditID)[0].AccountTitle);
      });

      this.getItemLedgerDetails(parseInt(res.CashDisbursementDPID));
    });
  }

  getItemLedgerDetails(id) {

    this.getLedgerDetails(id).subscribe(item => {
      this.formDDP.setControl('voucherDetails', this.voucherDetails(item));
      this.formDDP.setControl('itemsLedger', this.ledgerDetails(item));
    })
  }

  ledgerDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    this.debit = 0;
    this.credit = 0;
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        formArray.push(this.fb.group({
          ReferenceNo: this.formDDP.value.CheckNo,
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
      formArray.push(this.fb.group({
        AccountCode: i.AccountCode,
        AccountTitle: i.AccountTitle,
        Debit: i.Debit,
        Credit: i.Credit,
      }));
      this.voucherDebit += i.Debit;
      this.voucherCredit += i.Credit;
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
        { text: "Generated Debit Memo #" + this.globalService.padLeft(fg.value.CashDisbursementDPID, '0', 10), fontSize: 8, bold: true, margin: [0, 50, 0, 0] },
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
        { text: "Cash Disbursement Down Payment Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 524 - 0, y2: 5, lineWidth: 2.5 }] },
        {
          columns: [
            { width: '15%', text: 'Transaction # ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + this.globalService.padLeft(fg.value.CashDisbursementDPID, '0', 10), fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Disbursement Date ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + formatDate(fg.value.CashDisbursementDPDate, "MM/dd/yyyy", ('en-US')), fontSize: 8, margin: [0, 10, 0, 0], }
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

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 524 - 0, y2: 5, lineWidth: 2.0 }] },

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
      fontSize: 9, margin: [0, 4, 0, 0],
    };
  }



}