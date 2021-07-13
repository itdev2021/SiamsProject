import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { CostUnitComponent } from 'src/app/modules/lookup/cost-unit/cost-unit.component';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { ShipAddLookupComponent } from 'src/app/modules/lookup/shipadd-lookup/shipadd-lookup.component';
import { CustomerGroupComponent } from 'src/app/modules/references/customer-group/customer-group-list/customer-group-list.component';
import { GlobalService } from 'src/app/service/global.service';
import { CostUnitService } from 'src/app/service/lookup/cost-unit.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CreditTermsService } from 'src/app/service/references/credit-terms.service';
import { CustomerGroupService } from 'src/app/service/references/customer-group.service';
import { RefDataService } from 'src/app/service/references/ref-data.service';
import { UomService } from 'src/app/service/references/uom.service';
import { VatNonVatService } from 'src/app/service/references/vatnonvat.service';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { SalesInvoicingService } from 'src/app/service/sales/transaction/sales-invoicing.service';
import { SalesInvoicingItemComponent } from '../sales-invoicing-item/sales-invoicing-item.component';

@Component({
  selector: 'app-sales-invoicing-entry',
  templateUrl: './sales-invoicing-entry.component.html',
  styles: []
})
export class SalesInvoicingEntryComponent implements OnInit {

  warehouseList = [];
  termsList = [];
  uomList = [];
  vatlist = [];
  deletedIDs = "";
  rrTypeList = [];
  customerGroupList = [];

  constructor(public warehouseService: WarehouseService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public serviceNotification: NotificationService,
    public service: SalesInvoicingService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SalesInvoicingEntryComponent>,
    private termsService: CreditTermsService,
    private oumService: UomService,
    public globalService: GlobalService,
    public vatnonvatservice: VatNonVatService,
    public refDataService: RefDataService,
    public customerGroupService: CustomerGroupService,
    public costunitService: CostUnitService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.warehouseService.getWarehouseList().subscribe(res => this.warehouseList = res as []);
    this.customerGroupService.getList().subscribe(res => this.customerGroupList = res as []);
    this.termsService.getList().subscribe(res => this.termsList = res as []);
    this.oumService.getList().subscribe(res => this.uomList = res as []);
    this.vatnonvatservice.getList().subscribe(res => this.vatlist = res as []);
    this.refDataService.getList().subscribe(res => {
      var data: any = res as [];
      data.sort((a, b) => a.refText > b.refText ? 1 : -1);
      this.rrTypeList = data.filter(a => a.refData == 'RECEIVING-TYPE');
    });

  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "SI";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  updateTotal(item, i) {
    // (<HTMLInputElement>document.getElementById("TotalCost" + i)).value = parseFloat((item.value.Qty * item.value.UnitCost).toFixed(2)).toString();
    item.controls.Gross.patchValue(item.value.Quantity * item.value.SRP);

    // (<HTMLInputElement>document.getElementById("DiscAmount" + i)).value = parseFloat(((item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)).toFixed(2)).toString();
    item.controls.DiscountAmount.patchValue((item.value.DiscountPercent / 100) * (item.value.Quantity * item.value.SRP));

    // (<HTMLInputElement>document.getElementById("NetTotalCost" + i)).value = parseFloat(((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)).toFixed(2)).toString();
    item.controls.Net.patchValue((item.value.Quantity * item.value.SRP) - (item.value.DiscountPercent / 100) * (item.value.Quantity * item.value.SRP));

    
    let sumCost = 0;
    let sumEWT = 0;
    let sumAmt = 0;

    for (let x = 0; x < this.service.formSalesInvo.get('items')['length']; x++) {
      sumAmt += parseFloat((<HTMLInputElement>document.getElementById("Net" + x)).value);
    }

    this.service.formSalesInvo.patchValue({ Net: sumAmt });
    this.service.totalAmount = (Number(sumAmt).toLocaleString('en-GB'));
  }

  onSelectAddress() {
    if (this.service.formSalesInvo.value.CustomerID) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = "60%";
      dialogConfig.data = ["SI", this.service.formSalesInvo.value.CustomerID];
      this.dialog.open(ShipAddLookupComponent, dialogConfig).afterClosed().subscribe(res => {

      });
    }
  }


  onSelectCostUnit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["SI", this.service.formSalesInvo.value.CostUnitID == this.costunitService.formCostUnit.value.CostUnitID];
    this.dialog.open(CostUnitComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = this.service.formSalesInvo.value.WarehouseID_To;
    this.dialog.open(SalesInvoicingItemComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formSalesInvo.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formSalesInvo.get('items')).removeAt(i);
  }

  onSubmit(fg: FormGroup) {
    this.service.saveOrUpdate()
      .subscribe(res => {
        this.serviceNotification.success('Submitted successfully!');
        this.resetForm();
        this.onClose();
      });
  }

  onClose() {
    this.resetForm();
    this.dialogRef.close()
  }

  onChangeOthers(event){
    this.service.getPatchOthers();
  }

  onPrintDoc(fg: FormGroup) {

  }

  resetForm() {
    this.service.formSalesInvo.reset();
    this.service.formSalesInvo = this.fb.group({
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
      WarehouseID: [1],
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
    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formSalesInvo.get('items')).length !== 0) {
      (<FormArray>this.service.formSalesInvo.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

}

