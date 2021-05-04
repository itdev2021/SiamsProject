import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { CostUnitComponent } from 'src/app/modules/lookup/cost-unit/cost-unit.component';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { ShipAddLookupComponent } from 'src/app/modules/lookup/shipadd-lookup/shipadd-lookup.component';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CreditTermsService } from 'src/app/service/references/credit-terms.service';
import { UomService } from 'src/app/service/references/uom.service';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { DeliveryReceiptService } from 'src/app/service/sales/transaction/delivery-receipt.service';

@Component({
  selector: 'app-delivery-receipt-entry',
  templateUrl: './delivery-receipt-entry.component.html',
  styles: []
})
export class DeliveryReceiptEntryComponent implements OnInit {

  warehouseList = [];
  termsList = [];
  uomList = [];
  deletedIDs = "";

  constructor(public warehouseService: WarehouseService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public serviceNotification: NotificationService,
    public service: DeliveryReceiptService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeliveryReceiptEntryComponent>,
    private termsService: CreditTermsService,
    private oumService: UomService,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.warehouseService.getWarehouseList().subscribe(res => this.warehouseList = res as []);
    this.termsService.getList().subscribe(res => this.termsList = res as []);
    this.oumService.getList().subscribe(res => this.uomList = res as []);
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "DR";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectAddress() {
    if (this.service.formDR.value.CustomerID) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = "60%";
      dialogConfig.data = ["DR", this.service.formDR.value.CustomerID];
      this.dialog.open(ShipAddLookupComponent, dialogConfig).afterClosed().subscribe(res => {

      });
    }
  }

  onSelectCostUnit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DR"];
    this.dialog.open(CostUnitComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "DR";
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formDR.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formDR.get('items')).removeAt(i);
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

  onPrintDoc(fg: FormGroup) {

  }

  resetForm() {
    this.service.formDR.reset();
    this.service.formDR = this.fb.group({
      DeliveryReceiptID: [0],
      DeliveryDate: [''],
      CustomerID: [''],
      Customer: ['', Validators.required],
      ShippToAddressID: [0],
      ShippToAddress: [''],
      CostUnitID: [0],
      EmployeeID: [0],
      Employee: [''],
      CostCenterID: [0],
      AssignCCEID: [0],
      IsMember: [false],
      WarehouseID: ['', Validators.required],
      CreditTermsID: ['', Validators.required],
      ReferencePO: [''],
      Notes: [''],
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
    while ((<FormArray>this.service.formDR.get('items')).length !== 0) {
      (<FormArray>this.service.formDR.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

}

