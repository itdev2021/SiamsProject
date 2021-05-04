import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { WarehouseReceivingService } from 'src/app/service/inventory/transaction/warehouse-receiving.service';
import { CustomerService } from 'src/app/service/sales/customer.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-warehouse-receving-entry',
  templateUrl: './warehouse-receving-entry.component.html',
  styles: []
})
export class WarehouseRecevingEntryComponent implements OnInit {
  fromWarehouseList = [];
  toWarehouseList = [];
  supplierList = [];
  clientList = [];
  acctTitleDebitList = [];
  acctTitleCreditList = [];
  deletedIDs = "";

  constructor(public supplierService: SupplierService,
    public warehouseService: WarehouseService,
    public clientService: CustomerService,
    public acctTitleService: AccountTitleService,
    public serviceNotification: NotificationService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<WarehouseRecevingEntryComponent>,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public service: WarehouseReceivingService,
    private fb: FormBuilder,
    public globalService:GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    // let id = this.currentRoute.snapshot.paramMap.get('id');
    // if (id == null)
    //   this.resetForm();
    // else {
    //   this.service.getInfo(id);
    // }

    this.supplierService.getSupplierList().subscribe(res => this.supplierList = res as []);
    this.warehouseService.getWarehouseList().subscribe(res => this.fromWarehouseList = res as []);
    this.warehouseService.getWarehouseList().subscribe(res => this.toWarehouseList = res as []);
    this.clientService.getCustomerList().subscribe(res => this.clientList = res as []);
    this.acctTitleService.getAccountTitleList().subscribe(res => this.acctTitleDebitList = res as []);
    this.acctTitleService.getAccountTitleList().subscribe(res => this.acctTitleCreditList = res as []);

  }



  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "WR";
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formWR.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formWR.get('items')).removeAt(i);
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
    this.service.formWR.reset();
    this.service.formWR = this.fb.group({
      WRID: [0],
      WarehouseID_From: [0],
      WarehouseID_To: [0],
      ReceivingDate: ['', Validators.required],
      Remarks: [''],
      ReferenceNo: ['', Validators.required],
      Amount: [0, Validators.required],
      Status: [0],
      IsPrinted: [0],
      WithdrawalSlipID: [0],
      ClientCode: [''],
      AssayDate: ['0001-01-01'],
      SupplierID: [1],
      SINo: [''],
      DRNo: [''],
      ImportFlag: [0],
      JournalType: [0],
      RC: [new Date()],
      RCU: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    })
    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formWR.get('items')).length !== 0) {
      (<FormArray>this.service.formWR.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    (<HTMLInputElement>document.getElementById("Amount" + i)).value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2)).toString();
    item.controls.Amount.value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2));
    let sum = 0
    for (let x = 0; x < this.service.formWR.get('items')['length']; x++) {
      sum += parseFloat((<HTMLInputElement>document.getElementById("Amount" + x)).value);
    }
    this.service.formWR.patchValue({ Amount: sum });
    this.service.totalAmount = (Number(sum).toLocaleString('en-GB'));
  }

}
