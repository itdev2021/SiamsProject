import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { DeliveredToService } from '../../lookup/delivered-to.service';
import { AccountTitleService } from '../../accounting/account-title.service';
import { UserService } from '../../User/user.service';
import { GlobalService } from '../../global.service';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PurchaseReturnService {

  referenceList = [];
  debit: number = 0;
  credit: number = 0;

  constructor(public http: HttpClient,
    public fb: FormBuilder,
    private deliveredService: DeliveredToService,
    private acctTitleService: AccountTitleService,
    private userService: UserService,
    private globalService: GlobalService) { }

  // assigning fields to control
  formSR = this.fb.group({
    SupplierReturnsID: ['', Validators.required],
    SupplierReturnsDate: ['', Validators.required],
    SupplierReturnsNumber: [''],
    ReceivingReceiptReferenceNo: [''],
    ReceivingReceiptID: [''],
    SupplierID: [0],
    Supplier: ['', Validators.required],
    Address: [''],
    DebitNoteID: [''],
    Gross: [0],
    Discount: [''],
    DiscountAmount: [0],
    Net: [0, Validators.required],
    WarehouseID: ['', Validators.required],
    Remarks: ['', Validators.required],
    ReasonID: ['', Validators.required],
    PreparedByID: ['', Validators.required],
    CheckedBy: ['', Validators.required],
    PreparedByName: [''],
    CheckedByName: [''],
    Status: [-1],
    RC: [new Date()],
    RCU: [0],
    IsPrinted: [0],
    STSNo: [''],

    DeleteIDs: [''],
    items: this.fb.array([]),
    itemsLedger: this.fb.array([])
  });

  getPatchSupplier(row) {
    return this.formSR.patchValue({
      SupplierID: row.PayToID,
      Supplier: row.PayTo
    });
  }

  getItemRow() {
    (<FormArray>this.formSR.get('items')).push(
      this.fb.group({
        SupplierReturnsDetailID: [0],
        SupplierReturnsID: [0],
        ProductID: [0],
        Product: [''],
        UOMID: [0],
        UOMDescription: [''],
        WarehouseID: [0],
        Quantity: [0, Validators.required],
        UnitCost: [0, Validators.required],
        ComputedCost: [0],
        LotNo: [''],
        ExpiryDate: [''],
        ManufacturingDate: [''],
        ReservedInt: [0],
        Disc: [''],
        DiscAmount: [0],
        Gross: [0],
        ReferenceNo: [''],
        AccountTitleDebitID: [''],
        AccountTitleDebit: ['', Validators.required],
        AccountTitleCreditID: [''],
        AccountTitleCredit: ['', Validators.required],
        EWTRate: [''],
        EWT: [0],
        Vatable: [false],
        TotalGross: [0]
      })
    );
  }

  getPatchAccountTitle(row, i, item, Acct) {
    for (let x = 0; x < this.formSR.get('items')['length']; x++) {
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

  getPatchCostUnit(row, i, item) {

    for (let x = 0; x < this.formSR.get('items')['length']; x++) {
      if (x == i) {
        (<HTMLInputElement>document.getElementById("CostUnit" + x)).value = row.EmployeeName;
        item.controls.CostUnit.value = row.EmployeeName;
        item.controls.CostUnitID.value = row.CostUnitID;
        item.controls.EmployeeID.value = row.EmployeeID;
        item.controls.AssignCCEID.value = row.EmployeeID;
        item.controls.CostCenterID.value = row.CostCenterID;
        item.controls.DivisionID.value = row.DivisionID;
      }
    }
  }


  getPatchPurchaseItem(row, item, i) {
    for (let x = 0; x < this.formSR.get('items')['length']; x++) {
      if (x == i) {
        // item.controls.Product.patchValue(row.Product);
        item.patchValue({
          ProductID: row.ProductID,
          Product: row.Product,
          UOMID: row.UOMID,
          UOMDescription: row.UOMDescription,
          Quantity: row.Qty,
          UnitCost: row.UnitCost,
          ComputedCost: row.TotalCost,
          LotNo: row.LotNo,
          ExpiryDate: formatDate(row.ExpiryDate, "MM/dd/yyyy", ('en-US')),
          ManufacturingDate: formatDate(row.ManufacturingDate, "MM/dd/yyyy", ('en-US')),
          Disc: row.Disc,
          DiscAmount: row.DiscAmount,
          Gross: row.NetTotalCost,
          EWTRate: row.EWTRate,
          EWT: row.EWT,
          TotalGross: row.NetTotalEWT,
        });
      }
    }
  }


  // CRUD function
  saveOrUpdate() {
    var body = {
      ...this.formSR.value,
      SupplierReturnsDetail: this.formSR.get('items').value
    }
    return this.http.post(environment.apiURL + '/SupplierReturn', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/SupplierReturn');
  }

  getBySupplierIDReferenceList(suppplierID) {
    return this.http.get(environment.apiURL + '/SupplierReturn/references/' + suppplierID);
  }

  getSuplierRetrnItemList(suppplierID, ReferenceID) {
    return this.http.get(environment.apiURL + '/SupplierReturn/items/' + suppplierID + '/' + ReferenceID);
  }

  getBySupIDRefIDRRItemList(suppplierID, ReferenceID, ProductID) {
    console.log(environment.apiURL + '/SupplierReturn/items/' + suppplierID + '/' + ReferenceID);
    return this.http.get(environment.apiURL + '/SupplierReturn/items/' + suppplierID + '/' + ReferenceID + '/' + ProductID);
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/SupplierReturn/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/SupplierReturn/items/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/SupplierReturn/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formSR.patchValue({
        SupplierReturnsID: this.globalService.padLeft(res.sr.SupplierReturnsID, '0', 10),
        SupplierReturnsDate: res.sr.SupplierReturnsDate,
        SupplierReturnsNumber: res.sr.SupplierReturnsNumber,
        ReceivingReceiptReferenceNo: res.sr.ReceivingReceiptReferenceNo,
        ReceivingReceiptID: res.sr.ReceivingReceiptID,
        SupplierID: res.sr.SupplierID,
        Address: res.sr.Address,
        DebitNoteID: res.sr.DebitNoteID,
        Gross: (Number(res.sr.Gross).toLocaleString('en-GB')),
        Discount: res.sr.Discount,
        DiscountAmount: (Number(res.sr.DiscountAmount).toLocaleString('en-GB')),
        Net: (Number(res.sr.Net).toLocaleString('en-GB')),
        WarehouseID: res.sr.WarehouseID,
        Remarks: res.sr.Remarks,
        ReasonID: res.sr.ReasonID,
        PreparedByID: res.sr.PreparedByID,
        Status: res.sr.Status,
        IsPrinted: res.sr.IsPrinted,
        CheckedBy: res.sr.CheckedBy,
        STSNo: res.sr.STSNo,
        RC: res.sr.RC,
        RCU: res.sr.RCU
      });

      this.userService.getList().subscribe(u => {
        let user;
        user = u;
        this.formSR.patchValue({
          PreparedByName: user.filter(x => x.UserID == res.sr.PreparedByID)[0].CompleteName,
          CheckedByName: user.filter(x => x.UserID == res.sr.CheckedBy)[0].CompleteName
        });

      });

      this.getBySupplierIDReferenceList(res.sr.SupplierID).subscribe(res => this.referenceList = res as []);

      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formSR.controls.Supplier.patchValue(listArray.filter(x => x.PayToID == res.sr.SupplierID)[0].PayTo);
      });
      this.formSR.setControl('items', this.setExistingItems(res.srDetails));

      this.getItemLedgerDetails(res.sr.SupplierReturnsID);
    });


  }

  setExistingItems(itemSets): FormArray {
    var Debitlist = [];
    var Creditlist = [];

    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        Debitlist = res as [];
        Creditlist = res as [];

        formArray.push(this.fb.group({
          SupplierReturnsDetailID: i.SupplierReturnsDetailID,
          SupplierReturnsID: i.SupplierReturnsID,
          ProductID: i.ProductID,
          Product: i.Product,
          UOMID: i.UOMID,
          UOMDescription: i.UOMDescription,
          WarehouseID: i.WarehouseID,
          Quantity: i.Quantity,
          UnitCost: i.UnitCost,
          ComputedCost: i.ComputedCost,
          LotNo: i.LotNo,
          ExpiryDate: i.ExpiryDate,
          ManufacturingDate: i.ManufacturingDate,
          ReservedInt: i.ReservedInt,
          Disc: i.Disc,
          DiscAmount: i.DiscAmount,
          Gross: i.Gross,
          ReferenceNo: i.ReferenceNo,
          AccountTitleDebitID: i.AccountTitleDebitID,
          AccountTitleDebit: Debitlist.filter(u => u.AccountTitleID == i.AccountTitleDebitID)[0].AccountTitle,
          AccountTitleCreditID: i.AccountTitleCreditID,
          AccountTitleCredit: Creditlist.filter(u => u.AccountTitleID == i.AccountTitleCreditID)[0].AccountTitle,
          EWTRate: i.EWTRate,
          EWT: i.EWT,
          Vatable: i.Vatable,
          TotalGross: i.TotalGross,
        }))
      });
    });
    return formArray;
  }

  getItemLedgerDetails(id) {

    this.getLedgerDetails(id).subscribe(item => {
      const listArray = [...item.srLessWHT, ...item.srWHT, ...item.srVatable, ...item.srInputTax];
      this.formSR.setControl('itemsLedger', this.ledgerDetails(listArray));
    })
  }

  ledgerDetails(itemSets): FormArray {
    const formArray = new FormArray([]);
    var groupedByData = this.groupByKey(itemSets, 'AccountTitle')
    Object.keys(groupedByData);
    (Object.keys(groupedByData)).forEach(x => {
      formArray.push(this.fb.group({
        AccountCode: groupedByData[x].map(x => x.AccountCode)[0],
        AccountTitle: x,
        Debit: (groupedByData[x].map(x => x.Debit)).reduce(function (a, b) { return a + b; }, 0),
        Credit: (groupedByData[x].map(x => x.Credit)).reduce(function (a, b) { return a + b; }, 0)
      }))
      this.debit += (groupedByData[x].map(x => x.Debit)).reduce(function (a, b) { return a + b; }, 0);
      this.credit += (groupedByData[x].map(x => x.Credit)).reduce(function (a, b) { return a + b; }, 0);
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
        { text: "Generated Debit Memo #" + this.globalService.padLeft(fg.value.SupplierReturnsID, '0', 10), fontSize: 8, bold: true, margin: [0, 50, 0, 0] },
        {
          columns: [
            {
              width: 320,
              text: fg.value.Supplier, fontSize: 13, bold: true,
            },
            {
              width: 90,
              text: formatDate(fg.value.SupplierReturnsDate, "MM/dd/yyyy", ('en-US')), fontSize: 13, bold: true,
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
        { text: "Purchase Return Journal Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 2.5 }] },

        {
          columns: [
            { width: '15%', text: 'Transaction #', fontSize: 10, bold: true, margin: [0, 5, 0, 0] },
            { width: '85%', text: ': ' + this.globalService.padLeft(fg.value.SupplierReturnsID, '0', 10), fontSize: 10, bold: false, margin: [0, 5, 0, 0] }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Date Entry', fontSize: 10, bold: true, margin: [0, 5, 0, 0] },
            { width: '85%', text: ': ' + formatDate(fg.value.SupplierReturnsDate, "MM/dd/yyyy", ('en-US')), fontSize: 10, bold: false, margin: [0, 5, 0, 0] }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'STS #', fontSize: 10, bold: true, margin: [0, 5, 0, 0] },
            { width: '85%', text: ': ' + this.globalService.padLeft(fg.value.STSNo, '0', 10), fontSize: 10, bold: false, margin: [0, 5, 0, 0] }
          ]
        },
        {
          columns: [
            { width: '15%', text: 'Payable To', fontSize: 10, bold: true, margin: [0, 5, 0, 0] },
            { width: '85%', text: ': ' + fg.value.Supplier, fontSize: 10, bold: false, margin: [0, 5, 0, 0] }
          ]
        },

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 2.5 }] },

        this.getPrintFLedgerDetails(fg),

        {
          table: {
            widths: [50, 240, 98, 60, 60],
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
        widths: [50, 210, 98, 60, 60],
        body: [
          [
            { text: 'Code', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Account Title', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Cost Unit', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: 'Debit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
            { text: 'Credit', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] }],

          ...fg.value.itemsLedger.map(res => {
            return [
              res.AccountCode,
              res.AccountTitle,
              { text: '', alignment: 'left' },
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