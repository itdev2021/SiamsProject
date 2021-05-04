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

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class IDSService {

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
    private costUnitService: CostUnitService) { }

  // assigning fields to control
  formIDS = this.fb.group({
    IDSID: [0],
    IDSDate: [0],
    Remarks: [''],
    Debit: [0, Validators.required],
    Credit: [0, Validators.required],
    PayToID: [0],
    PayTo: [''],
    PayToTypeID: [0],
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
    (<FormArray>this.formIDS.get('items')).push(
      this.fb.group({
        IDSDetailID: [0],
        AccountTitleID: [0],
        AccountTitle: [''],
        ReferenceNo: [''],
        PayToID: [0],
        PayTo: [''],
        PayToTypeID: [0],
        CostUnitID: [0],
        CostUnit: [''],
        EmployeeID: [0],
        AssignCCEID: [0],
        CostCenterID: [0],
        CostCenter: [''],
        Debit: [0],
        Credit: [0],
        Particulars: ['']
      })
    );
  }


  getPatchSupplier(row) {
    return this.formIDS.patchValue({
      PayToID: row.PayToID,
      PayTo: row.PayTo,
      PayToTypeID: row.PayToTypeID
    });
  }

  getPatchSupplierDetail(row, item) {
    return item.patchValue({
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
      PayTo:row.PayTo,
      PayToTypeID:row.PayToTypeID,
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

    for (let x = 0; x < this.formIDS.get('items')['length']; x++) {
      sumTotalPayment += parseFloat((<HTMLInputElement>document.getElementById("AdvsAmt" + x)).value);
    }
    this.formIDS.patchValue({
      TotalPayment: (Number(sumTotalPayment).toLocaleString('en-GB'))
    });

  }

  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formIDS.value,
      IDSDetail: this.formIDS.get('items').value
    }
    return this.http.post(environment.apiURL + '/IDS', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/IDS');
  }

  getReferenceNo(): any {
    return this.http.get(environment.apiURL + '/APReference/referenceNo');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/IDS/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/IDS/ledgerDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/IDS/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {

      this.formIDS.patchValue({
        IDSID: this.globalService.padLeft(res.ids.IDSID, '0', 10),
        IDSDate: res.ids.IDSDate,
        PayToID: res.ids.PayToID,
        PayToTypeID: res.ids.PayToTypeID,
        Reference: res.ids.Reference,
        Remarks: res.ids.Remarks,
        Debit: (Number(res.ids.Debit).toLocaleString('en-GB')),
        Credit: (Number(res.ids.Credit).toLocaleString('en-GB')),
        Status: res.ids.Status,
        IsPrinted: res.ids.IsPrinted,
        RC: res.ids.RC,
        RCU: res.ids.RCU,
      });

      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formIDS.controls.PayTo.patchValue(res.ids.PayToID == 0 ? '' : listArray.filter(x => x.PayToID == res.ids.PayToID)[0].PayTo);
      });

      this.formIDS.setControl('items', this.setExistingItems(res.idsDetails));

      this.getItemLedgerDetails(parseInt(res.ids.IDSID));
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
              IDSDetailID: i.IDSDetailID,
              AccountTitleID: i.AccountTitleID,
              AccountTitle: (i.AccountTitleID == 0 ? '' : debitlist.filter(u => u.AccountTitleID == i.AccountTitleID)[0].AccountTitle),
              ReferenceNo: i.ReferenceNo,
              PayToID: i.PayToID,
              PayToTypeID: i.PayToTypeID,
              PayTo: (i.PayToID == 0 ? '' : listArray.filter(x => x.PayToID == i.PayToID)[0].PayTo),
              CostUnitID: i.CostUnitID,
              CostUnit: (i.CostUnitID == 0 ? '' : costunitList.filter(x => x.CostUnitID == i.CostUnitID)[0].EmployeeName),
              EmployeeID: i.EmployeeID,
              AssignCCEID: i.AssignCCEID,
              CostCenterID: i.CostCenterID,
              Debit: i.Debit,
              Credit: i.Credit,
              Particulars: i.Particulars
            }))
          });
        });
      });
    });
    return formArray;
  }

  getItemLedgerDetails(id) {
    this.getLedgerDetails(id).subscribe(item => {
      const listArray = [...item.idsLedger];
      this.formIDS.setControl('voucherDetails', this.voucherDetails(listArray));
      this.formIDS.setControl('itemsLedger', this.ledgerDetails(listArray));
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
        { text: "Generated Debit Memo #" + this.globalService.padLeft(fg.value.IDSID, '0', 10), fontSize: 8, bold: true, margin: [0, 50, 0, 0] },
        {
          columns: [
            {
              width: 320,
              text: fg.value.Supplier, fontSize: 13, bold: true,
            },
            {
              width: 90,
              text: formatDate(fg.value.IDSDate, "MM/dd/yyyy", ('en-US')), fontSize: 13, bold: true,
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
            { width: '*', text: ' : ' + this.globalService.padLeft(fg.value.IDSID, '0', 10), fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Disbursement Date ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + formatDate(fg.value.IDSDate, "MM/dd/yyyy", ('en-US')), fontSize: 8, margin: [0, 10, 0, 0], }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Payable To ', fontSize: 8, margin: [0, 10, 0, 0] },
            { width: '*', text: ' : ' + fg.value.PayTo, fontSize: 8, margin: [0, 10, 0, 0], }
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