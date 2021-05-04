import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GlobalService } from '../../global.service';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { SupplierService } from '../../inventory/supplier.service';
import { WarehouseService } from '../../references/warehouse.service';
import { AccountTitleService } from '../../accounting/account-title.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ReceivingReceiptService {
  totalCost = '0';
  totalEWT = '0';
  totalAmount = '0';

  debit: number = 0;
  credit: number = 0;

  constructor(private http: HttpClient,
    public fb: FormBuilder,
    private globalService: GlobalService,
    private supplierService: SupplierService,
    private acctTitleService: AccountTitleService,
    private warehouseService: WarehouseService) { }

  formRR = this.fb.group({
    ReceivingReceiptID: [0],
    ReceivingDate: ['', Validators.required],
    ReferenceNo: [''],
    WarehouseID: [1],
    Warehouse: [''],
    SupplierID: ['', Validators.required],
    Supplier: [''],
    Remarks: [''],
    TotalCost: [0],
    Disc: [''],
    DiscAmount: [0],
    TotalEWT: [0],
    NetTotalCost: [0],
    Status: [-1],
    IsPrinted: [0],
    ReceivingReceiptTypeID: [1],
    Vatable: [1],
    DRNo: [''],
    SINo: [''],
    CheckedBy: ['', Validators.required],
    CheckedByName: [''],
    PreparedBy: ['', Validators.required],
    PreparedByName: [''],
    ApprovedBy: ['', Validators.required],
    ApprovedByName: [''],
    dateAssay: ['01/01/1900'],
    StockType: [0],
    JournalType: [1],
    ClientCode: [''],
    ClientName: [''],
    ImportFlag: [0],
    DesignationID: [0],
    AssetLifeID: [0],
    DeleteIDs: [''],
    items: this.fb.array([]),
    itemsLedger: this.fb.array([])
  })

  getPatchDelivered(row) {
    return this.formRR.patchValue({
      SupplierID: row.PayToID,
      Supplier: row.PayTo
    });
  }

  getPatchAccountTitle(row, i, item, Acct) {
    console.log(Acct);
    console.log(row);
    console.log(item);
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

  saveOrUpdate() {
    var body = {
      ...this.formRR.value,
      ReceivingReceiptDetail: this.formRR.get('items').value
    }
    return this.http.post(environment.apiURL + '/receivingreceipt', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ReceivingReceipt');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ReceivingReceipt/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/ReceivingReceipt/items/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ReceivingReceipt/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }


  // Print Information Controller
  getSTSPrintInfoByID(id): any {
    return this.http.get(environment.apiURL + '/RRPrintInfo/' + id);
  }

  updatePrintSTS(frmRR) {
    return this.http.post(environment.apiURL + '/RRPrintInfo', frmRR);
  }

  //Edit
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formRR.patchValue({
        ReceivingReceiptID: this.globalService.padLeft(res.rr.ReceivingReceiptID, '0', 10),
        ReceivingDate: res.rr.ReceivingDate,
        dateAssay: res.rr.dateAssay,
        ReferenceNo: res.rr.ReferenceNo,
        WarehouseID: res.rr.WarehouseID,
        DesignationID: res.rr.DesignationID,
        AssetLifeID: res.rr.AssetLifeID,

        SupplierID: res.rr.SupplierID,
        DRNo: res.rr.DRNo,
        SINo: res.rr.SINo,

        ClientCode: res.rr.ClientCode,
        ClientName: res.rr.ClientName,

        Remarks: res.rr.Remarks,

        StockType: res.rr.StockType,
        ReceivingReceiptTypeID: res.rr.ReceivingReceiptTypeID,
        JournalType: res.rr.JournalType,
        Vatable: res.rr.Vatable,

        CheckedBy: res.rr.CheckedBy,
        PreparedBy: res.rr.PreparedBy,
        ApprovedBy: res.rr.ApprovedBy,

        Disc: res.rr.Disc,
        TotalCost: res.rr.TotalCost,
        DiscAmount: res.rr.DiscAmount,
        TotalEWT: res.rr.TotalEWT,
        NetTotalCost: res.rr.NetTotalCost,

        ImportFlag: res.rr.ImportFlag,
        IsPrinted: res.rr.IsPrinted,
        Status: res.rr.Status
      });

      this.totalCost = res.rr.TotalCost,
        this.totalEWT = res.rr.TotalEWT,
        this.totalAmount = res.rr.NetTotalCost,

        this.warehouseService.getWarehouseList().subscribe(wh => {
          var listArray = [];
          listArray = wh as [];
          this.formRR.patchValue({
            Warehouse: listArray.filter(x => x.WareHouseID == res.rr.WarehouseID)[0].WareHouse
          })
        })

      this.supplierService.getSupplierList().subscribe(sup => {
        var listArray = [];
        listArray = sup as [];
        this.formRR.patchValue({
          Supplier: listArray.filter(x => x.SupplierID == res.rr.SupplierID)[0].Supplier
        });
      });


      this.formRR.setControl('items', this.setExistingItems(res.rrd));

      this.getItemLedgerDetails(res.rr.ReceivingReceiptID);

    });
  }

  setExistingItems(itemSets): FormArray {
    var Debitlist = [];
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      this.acctTitleService.getAccountTitleList().subscribe(res => {
        Debitlist = res as [];
        formArray.push(this.fb.group({
          ReceivingReceiptDetailID: i.ReceivingReceiptDetailID,
          PurchaseOrderDetailID: i.PurchaseOrderDetailID,
          ReceivingReceiptID: i.ReceivingReceiptID,
          PurchaseOrderID: i.PurchaseOrderID,
          ProductCode: i.ProductCode,
          ProductID: i.ProductID,
          Product: i.Product,
          UOMID: i.UOMID,
          UOMDescription: i.UOMDescription,
          Qty: i.Qty,
          UnitCost: i.UnitCost,
          TotalCost: i.TotalCost,
          Disc: i.Disc,
          DiscAmount: i.DiscAmount,
          NetTotalCost: i.NetTotalCost,
          EWTRate: i.EWTRate,
          EWT: i.EWT,
          NetTotalEWT: i.NetTotalEWT,
          LotNo: i.LotNo,
          ExpiryDate: i.ExpiryDate,
          ManufacturingDate: i.ManufacturingDate,
          Particulars: i.Particulars,
          ControlNo: i.ControlNo,
          AccountTitleDebitID: i.AccountTitleDebitID,
          AccountTitleDebit: (i.AccountTitleDebitID == 0 ? '' : Debitlist.filter(u => u.AccountTitleID == i.AccountTitleDebitID)[0].AccountTitle),
          AccountTitleCreditID: i.AccountTitleCreditID,
          AccountTitleCredit: (i.AccountTitleCreditID == 0 ? '' : Debitlist.filter(u => u.AccountTitleID == i.AccountTitleCreditID)[0].AccountTitle),
          SampleTaken: i.SampleTaken,
          SPG: i.SPG,
          ConvertedUOMID: i.ConvertedUOMID,
          ConvertedValue: i.ConvertedValue
        }))
      });
    });
    return formArray;
  }

  getItemLedgerDetails(id) {

    this.getLedgerDetails(id).subscribe(item => {
      const listArray = [...item.vatable, ...item.lessVat, ...item.ewt, ...item.AcctsPayable];

      this.formRR.setControl('itemsLedger', this.ledgerDetails(listArray));
      // this.groupByItem(listArray);
    })
  }

  ledgerDetails(itemSets): FormArray {
    this.debit = 0;
    this.credit = 0;
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

  //get List Purchase Order Item
  getPOProductList(supplierID) {
    return this.http.get(environment.apiURL + '/purchaseorder/receiving/' + supplierID);
  }

  // get Purchase Detail Item
  getItemRow(row) {
    (<FormArray>this.formRR.get('items')).push(
      this.fb.group({
        ReceivingReceiptDetailID: [0],
        PurchaseOrderDetailID: [row.PurchaseOrderDetailID],
        PurchaseOrderID: [row.PurchaseOrderID],
        ProductCode: [''],
        ProductID: [row.ProductID],
        Product: [row.Product],
        UOMID: [row.UOMID],
        UOMDescription: [row.UOMDescription],
        Qty: [0],
        UnitCost: [row.UnitCost],
        TotalCost: [0],
        LotNo: [''],
        ExpiryDate: ['', Validators.required],
        ManufacturingDate: ['', Validators.required],
        Disc: [0],
        DiscAmount: [0],
        NetTotalCost: [0],
        Particulars: [''],
        EWT: [0],
        NetTotalEWT: [0],
        EWTRate: [0],
        ControlNo: [''],
        AccountTitleDebitID: ['', Validators.required],
        AccountTitleDebit: ['', Validators.required],
        AccountTitleCreditID: ['', Validators.required],
        AccountTitleCredit: ['', Validators.required],
        SampleTaken: [0],
        SPG: [0],
        ConvertedUOMID: [0],
        ConvertedValue: [0]
      })
    );
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
        {
          columns: [
            {
              width: '50%',
              text: this.globalService.padLeft(fg.value.ReceivingReceiptID, '0', 10), fontSize: 8, alignment: 'left',
            },
            {
              width: '50%',
              text: this.globalService.padLeft(fg.value.ReferenceNo, '0', 10), fontSize: 8, alignment: 'right'
            }
          ], margin: [0, 34, 0, 0],
        },

        {
          columns: [
            {
              width: 390,
              text: fg.value.Supplier, fontSize: 8, bold: false, margin: [60, 0, 0, 0]
            },
            {
              width: 50,
              text: fg.value.DRNo, fontSize: 8, bold: false,
            }
          ], margin: [0, 20, 0, 0], fontSize: 8
        },

        {
          columns: [
            {
              width: 430,
              text: fg.value.Warehouse, fontSize: 8, bold: false, margin: [60, 0, 0, 0],
            },
            {
              width: 45,
              text: fg.value.SINo, fontSize: 8, bold: false,
            },
            {
              width: 60,
              text: formatDate(fg.value.ReceivingDate, "MM/dd/yyyy", ('en-US')), fontSize: 8, bold: false, alignment: 'right'
            }
          ], margin: [0, 8, 5, 0], fontSize: 8
        },

        this.getDocumentDetails(fg),
      ],

      footer: [
        { text: fg.value.Remarks, fontSize: 8, bold: false, margin: [35, -200, 0, 15] },
        {
          columns: [
            {
              width: '40%',
              text: fg.value.PreparedBy, fontSize: 8, bold: false, margin: [40, -0, 0, 0]
            },
            {
              width: '20%',
              text: fg.value.CheckedBy, fontSize: 8, bold: false, margin: [40, -0, 0, 0]
            },
            {
              width: '20%',
              text: fg.value.ApprovedBy, fontSize: 8, bold: false, margin: [40, -0, 0, 0]
            },
            {
              width: '20%',
              text: fg.value.PreparedBy, fontSize: 8, bold: false, margin: [40, -0, 0, 0]
            }
          ]
        }
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
        widths: [40, 180, 50, 45, 45, 70, 40, 40],
        body: [
          [
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', alignment: 'right', margin: [0, 0, 0, 5] },
            { text: '', style: 'tableHeader', margin: [0, 0, 0, 5] },
          ],
          ...fg.value.items.map(res => {
            return [
              { text: res.ProductCode, fontSize: 8 },
              { text: res.Product, fontSize: 8 },
              { text: res.LotNo, fontSize: 8 },
              { text: formatDate(res.ExpiryDate, "MM/dd/yyyy", ('en-US')), fontSize: 8 },
              { text: formatDate(res.ManufacturingDate, "MM/dd/yyyy", ('en-US')), fontSize: 8 },
              { text: res.Particulars, fontSize: 8 },
              { text: Number(parseFloat(res.Qty).toFixed(2)).toLocaleString('en', { minimumFractionDigits: 2 }), fontSize: 8, alignment: 'right' },
              { text: res.UOMDescription, fontSize: 8 }
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
        { text: "Receiving Receipt Journal Entries", fontSize: 12, bold: true, margin: [0, 15, 0, 0] },

        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 542 - 0, y2: 5, lineWidth: 2.5 }] },

        { text: 'Transaction # : ' + this.globalService.padLeft(fg.value.ReceivingReceiptID, '0', 10), fontSize: 10, margin: [0, 10, 0, 0] },
        { text: 'Date Entry    : ' + formatDate(fg.value.ReceivingDate, "MM/dd/yyyy", ('en-US')), fontSize: 10, margin: [0, 5, 0, 0] },
        { text: 'Reference #         : ' + this.globalService.padLeft(fg.value.ReferenceNo, '0', 10), fontSize: 10, margin: [0, 5, 0, 0] },
        { text: 'Payable To    : ' + fg.value.Supplier, fontSize: 10, margin: [0, 5, 0, 5] },
        { text: 'Remarks    : ' + fg.value.Remarks, fontSize: 10, margin: [0, 5, 0, 5] },

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
            { text: 'Account Name', style: 'tableHeader', margin: [0, 0, 0, 5] },
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
