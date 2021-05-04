import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router';

import { WithdrawalService } from 'src/app/service/inventory/transaction/withdrawal.service';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { CostUnitComponent } from 'src/app/modules/lookup/cost-unit/cost-unit.component';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { NotificationService } from 'src/app/service/notification.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-withdrawal-entry',
  templateUrl: './withdrawal-entry.component.html',
  styles: []
})
export class WithdrawalEntryComponent implements OnInit {
  warehouseList = [];
  acctTitleDebitList = [];
  acctTitleCreditList = [];
  deletedIDs = "";

  constructor(public supplierService: SupplierService,
    public warehouseService: WarehouseService,
    public acctTitleService: AccountTitleService,
    private dialog: MatDialog,
    private router: Router,
    public serviceNotification: NotificationService,
    public dialogRef: MatDialogRef<WithdrawalEntryComponent>,
    public service: WithdrawalService,
    private fb: FormBuilder,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.warehouseService.getWarehouseList().subscribe(res => this.warehouseList = res as []);
    this.acctTitleService.getAccountTitleList().subscribe(res => this.acctTitleDebitList = res as []);
    this.acctTitleService.getAccountTitleList().subscribe(res => this.acctTitleCreditList = res as []);
  }

  onSelectCostUnit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "WS";
    this.dialog.open(CostUnitComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "WS";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "WS";
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formWS.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formWS.get('items')).removeAt(i);
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

  resetForm() {
    this.service.formWS.reset();
    this.service.formWS = this.fb.group({
      WithdrawalSlipID: [0],
      DateEntry: ['', Validators.required],
      ReferenceNo: [''],
      Amount: [0],
      CostUnitID: ['', Validators.required],
      CostUnit: [''],
      EmployeeID: [0],
      Employee: [''],
      CostCenterID: [0],
      AssignCCEID: [1],
      PayToID: [''],
      PayTo: ['', Validators.required],
      PayToTypeID: [''],
      Remarks: [''],
      Status: [-1],
      ISprinted: [0],
      RC: [new Date],
      RCU: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    });
    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formWS.get('items')).length !== 0) {
      (<FormArray>this.service.formWS.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    (<HTMLInputElement>document.getElementById("Amount" + i)).value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2)).toString();
    item.controls.Amount.value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2));
    let sum = 0
    for (let x = 0; x < this.service.formWS.get('items')['length']; x++) {
      sum += parseFloat((<HTMLInputElement>document.getElementById("Amount" + x)).value);
    }
    this.service.formWS.patchValue({ Amount: sum });
    this.service.totalAmount = (Number(sum).toLocaleString('en-GB'));
  }

}
