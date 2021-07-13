import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { DeliveredToService } from '../../lookup/delivered-to.service';
import { GlobalService } from '../../global.service';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { TherapeuticService } from '../../dli/reference/therapeutic.service';
import { CustomerService } from '../customer.service';
import { CostUnitService } from '../../lookup/cost-unit.service';
import { CreditTermsService } from '../../references/credit-terms.service';
import { CustomerGroupService } from '../../references/customer-group.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class SalesInvoicingService {

  totalAmount = '0';
  totalCost = '0';

  constructor(public http: HttpClient,
    public fb: FormBuilder,

    private globalService: GlobalService,
    public deliveredService: DeliveredToService,
    public shipaddService: CustomerService,
    public costUnitService: CostUnitService,
    public customerService: CustomerService,
    public creditTermsService: CreditTermsService,
    public customergroupService: CustomerGroupService) { }

  // assigning fields to control
  formSalesInvo = this.fb.group({
    SalesInvoicingID: [0],
    SalesInvoicingDate: [''],
    CustomerID: [''],
    Customer: ['', Validators.required],
    ShippToAddressID: [0],
    ShipAddress: [''],
    CostUnitID: [0],
    CostUnit: [''],
    EmployeeID: [0],
    Employee: [''],
    CostCenterID: [0],
    AssignCCEID: [0],
    WarehouseID: [0],
    CreditTermsID: ['', Validators.required],
    CreditTerms: [''],
    ReferencePO: [''],
    CustomerGroupID: [0],
    CustomerGroupName: [''],
    Tin: [''],
    VatNonVatID: [''],
    ReceivingReceiptTypeID: [''],
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



  getPatchOthers() {
    let tin = [];
    this.customerService.getCustomerList().subscribe(res => {
      tin = res as [];
      this.formSalesInvo.controls.Tin.patchValue(tin.filter(x => x.CustomerID == this.formSalesInvo.value.CustomerID)[0].TIN);
    });

  }

  getBBProductList(WarehouseID_To){
    return this.http.get(environment.apiURL + '/BB/receiving/' + WarehouseID_To);
  }

  getItemRow(row) {
    (<FormArray>this.formSalesInvo.get('items')).push(
      this.fb.group({
        SalesInvoicingDetailID: [0],
        SalesInvoicingID: [0],
        Code: [row.ProductCode],
        ProductID: [row.ProductID],
        Product: [row.Product],
        UOMID: [0],
        UOM: [row.UOMDescription],
        Quantity: [0, Validators.required],
        LotNo: ['', Validators.required],
        ExpiryDate: ['', Validators.required],
        IsFree: [false],
        SRP: ['', Validators.required],
        Gross: ['', Validators.required],
        DiscountPercent: [''],
        DiscountAmount: [''],
        Net: ['', Validators.required],
        Remarks: ['']
      })
    );
  }

  getPatchCustomer(row) {
    this.formSalesInvo.patchValue({
      CustomerID: row.PayToID,
      Customer: row.PayTo
    });
    let tin = [];
    this.customerService.getCustomerList().subscribe(res => {
      tin = res as [];
      this.formSalesInvo.controls.Tin.patchValue(tin.filter(x => x.CustomerID == this.formSalesInvo.value.CustomerID)[0].TIN);
    });
    let terms = [];
    let cred = [];
    this.customerService.getCustomerList().subscribe(res => {
      this.creditTermsService.getList().subscribe(resacct => {
        terms = res as [];
        cred = resacct as [];
        this.formSalesInvo.controls.CreditTermsID.patchValue(terms.filter(x => x.CustomerID == this.formSalesInvo.value.CustomerID)[0].CreditTermsID);
        this.formSalesInvo.controls.CreditTerms.patchValue(cred.filter(x => x.CreditTermsID == this.formSalesInvo.value.CreditTermsID)[0].CreditTerms);
      });
    });
    let a = [];
    let b = [];
    this.customerService.getCustomerList().subscribe(res => {
      this.customergroupService.getList().subscribe(resacct =>{
        a = res as [];
        b = resacct as [];
        this.formSalesInvo.controls.CustomerGroupID.patchValue(a.filter(x => x.CustomerID == this.formSalesInvo.value.CustomerID)[0].CustomerGroupID);
        this.formSalesInvo.controls.CustomerGroupName.patchValue(b.filter(x => x.CustomerGroupID == this.formSalesInvo.value.CustomerGroupID)[0].CustomerGroupName)
      });
    });
  }

  getPatchCustomerShipAdd(row) {
    return this.formSalesInvo.patchValue({
      ShippToAddressID: row.ShipToID,
      ShipAddress: row.ShipAddress
    });
  }

  getPatchCustomerGroup(row) {
    return this.formSalesInvo.patchValue({
      Classification: row.CustomerGroupName
    });
  }

  getPatchCostUnit(row) {
    return this.formSalesInvo.patchValue({
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
      ...this.formSalesInvo.value,
      SalesInvoicingDetail: this.formSalesInvo.get('items').value
    }
    return this.http.post(environment.apiURL + '/SalesInvoicing', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/SalesInvoicing');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/SalesInvoicing/' + id);
  }

  getLedgerDetails(id): any {
    return this.http.get(environment.apiURL + '/SalesInvoicing/ledgerDetails/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/SalesInvoicing/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  // Populate Data Information by ID
  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {

      this.formSalesInvo.patchValue({
        SalesInvoicingID: res.SI.SalesInvoicingID,
        SalesInvoicingDate: res.SI.SalesInvoicingDate,
        CustomerID: res.SI.CustomerID,
        CostUnitID: res.SI.CostUnitID,
        ShippToAddressID: res.SI.ShippToAddressID,
        ShipAddress: res.SI.ShipAddress,
        EmployeeID: res.SI.EmployeeID,
        Employee: res.SI.Employee,
        WarehouseID: res.SI.WarehouseID,
        CreditTermsID: res.SI.CreditTermsID,
        CreditTerms: res.SI.CreditTerms,
        ReferencePO: res.SI.ReferencePO,
        CustomerGroupName: res.SI.CustomerGroupName,
        Tin: res.SI.Tin,
        VatNonVatID: res.SI.VatNonVatID,
        ReceivingReceiptTypeID: res.SI.ReceivingReceiptTypeID,
        PriceListID: res.SI.PriceListID,
        DiscountSchemeID: res.SI.DiscountSchemeID,
        DRTypeID: res.SI.DRTypeID,
        PreparedByID: res.SI.PreparedByID,
        IsPrinted: res.SI.IsPrinted,
        Status: res.SI.Status,
      });
      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.customer, ...item.supplier, ...item.employee];
        this.formSalesInvo.patchValue({
          Customer: listArray.filter(x => x.PayToID == res.SI.CustomerID)[0].PayTo
        });
      });
      this.costUnitService.getList().subscribe(item => {
        let x; x = item;
        x.filter(y => y.CostUnitID == res.SI.CostUnitID)[0].CostUnit
        this.formSalesInvo.patchValue({
          CostUnit: x.filter(y => y.CostUnitID == res.SI.CostUnitID)[0].CostUnit
        });
      });
      this.formSalesInvo.setControl('items', this.setExistingItems(res.tblSalesInvoicing));
    });
  }

  // this.deliveredService.getList().subscribe(item => {
  //   const listArray = [...item.supplier, ...item.customer, ...item.employee];
  //   this.formSalesInvo.patchValue({
  //     Supplier: listArray.filter(x => x.PayToID == res.dv.SupplierID)[0].PayTo
  //   });
  // });


  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        SalesInvoicingDetailID: i.SalesInvoicingDetailID,
        SalesInvoicingID: i.SalesInvoicingID,
        Code: i.ProductCode,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOM: i.UOMDescription,
        Quantity: i.Quantity,
        LotNo: i.LotNo,
        ExpiryDate: i.ExpiryDate,
        IsFree: i.IsFree,
        SRP: i.SRP,
        Gross: i.Gross,
        DiscountPercent: i.DiscountPercent,
        DiscountAmount: i.DiscountAmount,
        Net: i.Net,
        Remarks: i.Remarks

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