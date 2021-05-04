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
export class OtherDisbursementService {

  referenceList = [];
  debit: number = 0;
  credit: number = 0;
  voucherDebit: number = 0;
  voucherCredit: number = 0;

  constructor(public http: HttpClient,
    public fb: FormBuilder,
    private acctTitleService: AccountTitleService,
    private deliveredService: DeliveredToService,
    private globalService: GlobalService,
    private costUnitService: CostUnitService,
    private bankService: BankService,) { }

  // assigning fields to control
  formOD = this.fb.group({
    OtherDisbursementID: [0],
    OtherDisbursementDate: [0],
    Remarks: [''],
    Debit: [0, Validators.required],
    Credit: [0, Validators.required],
    PayToID: [0],
    PayTo: [''],
    PayToTypeID: [0],
    CheckNo: [''],
    BankName: [''],
    Reference: [''],
    Status: [-1],
    IsPrinted: [0],
    RC: [new Date()],
    RCU: [0],

    DeleteIDs: [''],
    items: this.fb.array([]),
    voucherDetails: this.fb.array([]),
    itemsLedger: this.fb.array([])
  });


  getItemRow() {
    (<FormArray>this.formOD.get('items')).push(
      this.fb.group({
        OtherDisbursementDetailID: [0],
        AccountTitleID: [0],
        AccountTitle: [''],
        ReferenceNo: [''],
        SIRR: [''],
        CostUnitID: [0],
        CostUnit: [''],
        EmployeeID: [0],
        AssignCCEID: [0],
        CostCenterID: [0],
        CostCenter: [''],
        Debit: [0],
        Credit: [0]
      })
    );
  }


  getPatchSupplier(row) {
    return this.formOD.patchValue({
      PayToID: row.PayToID,
      PayTo: row.PayTo,
      PayToTypeID: row.PayToTypeID
    });
  }

  patchByReferenceNo(row, item) {
    item.patchValue({
      AccountTitleID: row.AccountTitleID,
      AccountTitle: row.AccountTitle,
      ReferenceNo: row.ReferenceNo,
      PayToID: row.PayToID,
      PayTo: row.PayTo,
      PayToTypeID: row.PayToTypeID,
      Debit: row.Debit,
      Credit: row.Credit,
    });
  }

  getPatchAccountTitle(row, item) {
    item.patchValue({
      AccountTitleID: row.AccountTitleID,
      AccountTitle: row.AccountTitle
    });
  }

  getPatchCostUnit(row, item) {
    item.patchValue({
      CostUnit: row.EmployeeName,
      CostUnitID: row.CostUnitID,
      EmployeeID: row.EmployeeID,
      AssignCCEID: row.EmployeeID,
      CostCenterID: row.CostCenterID
    })
  }

  updateTotal() {
    let sumTotalPayment = 0;

    for (let x = 0; x < this.formOD.get('items')['length']; x++) {
      sumTotalPayment += parseFloat((<HTMLInputElement>document.getElementById("AdvsAmt" + x)).value);
    }
    this.formOD.patchValue({
      TotalPayment: (Number(sumTotalPayment).toLocaleString('en-GB'))
    });

  }

  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formOD.value,
      OtherDisbursementDetail: this.formOD.get('items').value
    }
    return this.http.post(environment.apiURL + '/OtherDisbursement', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/OtherDisbursement');
  }

  getReferenceNo(): any {
    return this.http.get(environment.apiURL + '/APReference/referenceNo');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/OtherDisbursement/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/OtherDisbursement/ledgerDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/OtherDisbursement/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      if (res.od == null) return;
      this.formOD.patchValue({
        OtherDisbursementID: this.globalService.padLeft(res.od.OtherDisbursementID, '0', 10),
        OtherDisbursementDate: res.od.OtherDisbursementDate,
        PayToID: res.od.PayToID,
        PayToTypeID: res.od.PayToTypeID,
        CheckNo: res.od.CheckNo,
        Reference: res.od.Reference,
        Remarks: res.od.Remarks,
        Debit: res.od.Debit,
        Credit: res.od.Credit,
        Status: res.od.Status,
        IsPrinted: res.od.IsPrinted,
        RC: res.od.RC,
        RCU: res.od.RCU,
      });

      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formOD.controls.PayTo.patchValue(res.od.PayToID == 0 ? '' : listArray.filter(x => x.PayToID == res.od.PayToID)[0].PayTo);
      });

      this.bankService.getBankList().subscribe(bank => {
        let bankList;
        bankList = bank;
        console.log(bankList);
        if (bankList.filter(x => x.AccountTitleID == res.od.AccountTitleID)[0] === undefined)
          this.formOD.controls.BankName.patchValue("");
        else
          this.formOD.controls.BankName.patchValue(bankList.bankList.filter(x => x.AccountTitleID == res.od.AccountTitleID)[0].BankName);
      });

      this.formOD.setControl('items', this.setExistingItems(res.odDetails));

      this.getItemLedgerDetails(parseInt(res.od.OtherDisbursementID));
    });
  }

  setExistingItems(itemSets): FormArray {
    var debitlist = [];
    var costunitList = [];
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        debitlist = res as [];
        this.deliveredService.getList().subscribe(item => {
          const listArray = [...item.supplier, ...item.customer, ...item.employee];
          this.costUnitService.getList().subscribe(cu => {
            costunitList = cu as [];
            formArray.push(this.fb.group({
              OtherDisbursementDetailID: i.OtherDisbursementDetailID,
              AccountTitleID: i.AccountTitleID,
              AccountTitle: (i.AccountTitleID == 0 ? '' : debitlist.filter(u => u.AccountTitleID == i.AccountTitleID)[0].AccountTitle),
              ReferenceNo: i.ReferenceNo,
              SIRR: i.SIRR,
              CostUnitID: i.CostUnitID,
              CostUnit: (i.CostUnitID == 0 ? '' : costunitList.filter(x => x.CostUnitID == i.CostUnitID)[0].EmployeeName),
              EmployeeID: i.EmployeeID,
              AssignCCEID: i.AssignCCEID,
              CostCenterID: i.CostCenterID,
              Debit: i.Debit,
              Credit: i.Credit
            }))
          });
        });
      });
    });
    return formArray;
  }

  getItemLedgerDetails(id) {
    this.getLedgerDetails(id).subscribe(item => {
      this.formOD.setControl('voucherDetails', this.voucherDetails(item));
      this.formOD.setControl('itemsLedger', this.ledgerDetails(item));
    })
  }
  ledgerDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    this.debit = 0;
    this.credit = 0;
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
        { text: "Generated Debit Memo #" + this.globalService.padLeft(fg.value.OtherDisbursementID, '0', 10), fontSize: 8, bold: true, margin: [0, 50, 0, 0] },
        {
          columns: [
            {
              width: 320,
              text: fg.value.Supplier, fontSize: 13, bold: true,
            },
            {
              width: 90,
              text: formatDate(fg.value.OtherDisbursementDate, "MM/dd/yyyy", ('en-US')), fontSize: 13, bold: true,
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
            { width: '*', text: ' : ' + this.globalService.padLeft(fg.value.OtherDisbursementID, '0', 10), fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Disbursement Date ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + formatDate(fg.value.OtherDisbursementDate, "MM/dd/yyyy", ('en-US')), fontSize: 8, margin: [0, 10, 0, 0], }
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

        this.getPrintLedgerDetails(fg),

        {
          table: {
            widths: [50, 324, 78, 66],
            body: [
              ['', '', '', ''],
              ['', { text: 'TOTAL', fontSize: 10, bold: true, alignment: 'right' },
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
          ...fg.value.itemsLedger.map(res => {
            return [
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