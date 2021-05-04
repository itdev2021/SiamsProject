import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router} from '@angular/router';

import { StockTransferService } from 'src/app/service/inventory/transaction/stock-transfer.service';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';



@Component({
  selector: 'app-stock-transfer-entry',
  templateUrl: './stock-transfer-entry.component.html',
  styles: []
})
export class StockTransferEntryComponent implements OnInit {
  fromWarehouseList = [];
  toWarehouseList = [];
  supplierList = [];
  clientList = [];
  acctTitleDebitList = [];
  acctTitleCreditList = [];
  deletedIDs = "";

  constructor(public supplierService: SupplierService,
    public warehouseService: WarehouseService,
    public acctTitleService: AccountTitleService,
    private dialog: MatDialog,
    private router: Router,
    public service: StockTransferService,
    private fb: FormBuilder,
    public serviceNotification: NotificationService,
    public dialogRef: MatDialogRef<StockTransferEntryComponent>,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.supplierService.getSupplierList().subscribe(res => this.supplierList = res as []);
    this.warehouseService.getWarehouseList().subscribe(res => this.fromWarehouseList = res as []);
    this.warehouseService.getWarehouseList().subscribe(res => this.toWarehouseList = res as []);
    this.acctTitleService.getAccountTitleList().subscribe(res => this.acctTitleDebitList = res as []);
    this.acctTitleService.getAccountTitleList().subscribe(res => this.acctTitleCreditList = res as []);

  }



  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "STS";
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {

    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formSTS.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formSTS.get('items')).removeAt(i);
  }

  onSubmit(fg: FormGroup) {
    this.service.saveOrUpdate()
      .subscribe(res => {
        this.serviceNotification.success('Submitted successfully!');
        this.resetForm();
        this.onClose();
      });
  }
  
  onClose(){
    this.resetForm();
    this.dialogRef.close()
  }

  resetForm() {
    this.service.formSTS.reset();
    this.service.formSTS = this.fb.group({
      STSID: [0],
      WarehouseID_From: [0],
      WarehouseID_To: [0],
      STSDate: ['', Validators.required],
      Remarks: [''],
      DeliveryAddress: [''],
      ReferenceNo: ['', Validators.required],
      Amount: [0, Validators.required],
      Status: [-1],
      IsPrinted: [0],
      AssayDate: ['0001-01-01'],
      SupplierID: [1],
      RC: [new Date()],
      RCU: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    });
    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formSTS.get('items')).length !== 0) {
      (<FormArray>this.service.formSTS.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    (<HTMLInputElement>document.getElementById("Amount" + i)).value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2)).toString();
    item.controls.Amount.value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2));
    let sum = 0
    for (let x = 0; x < this.service.formSTS.get('items')['length']; x++) {
      sum += parseFloat((<HTMLInputElement>document.getElementById("Amount" + x)).value);
    }
    this.service.formSTS.patchValue({ Amount: sum });
    this.service.totalAmount = (Number(sum).toLocaleString('en-GB'));
  }

  onPrintDoc(fg: FormGroup) {
    this.service.PrintDocument(fg);
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

}
