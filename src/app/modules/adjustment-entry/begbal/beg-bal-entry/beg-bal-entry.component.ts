import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { CustomerService } from 'src/app/service/sales/customer.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { BeginningBalanceService } from 'src/app/service/accounting/adjustment-entry/beg-bal.service';

@Component({
  selector: 'app-beg-bal-entry',
  templateUrl: './beg-bal-entry.component.html',
  styles: []
})
export class BeginningBalanceEntryComponent implements OnInit {
  toWarehouseList = [];
  deletedIDs = "";

  constructor(public warehouseService: WarehouseService,
    public serviceNotification: NotificationService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BeginningBalanceEntryComponent>,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public service: BeginningBalanceService,
    private fb: FormBuilder,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    // let id = this.currentRoute.snapshot.paramMap.get('id');
    // if (id == null)
    //   this.resetForm();
    // else {
    //   this.service.getInfo(id);
    // }

    this.warehouseService.getWarehouseList().subscribe(res => this.toWarehouseList = res as []);

  }



  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "BB";
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formBB.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formBB.get('items')).removeAt(i);
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
    this.service.formBB.reset();
    this.service.formBB = this.fb.group({
      BBID: [0],
      WarehouseID_To: [0],
      DateEntry: ['', Validators.required],
      Remarks: [''],
      Amount: [0, Validators.required],
      Status: [-1],
      IsPrinted: [0],
      RC: [new Date()],
      RCU: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    })
    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formBB.get('items')).length !== 0) {
      (<FormArray>this.service.formBB.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    (<HTMLInputElement>document.getElementById("Amount" + i)).value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2)).toString();
    item.controls.Amount.patchValue((item.value.Quantity * item.value.UnitCost));
    let sum = 0
    for (let x = 0; x < this.service.formBB.get('items')['length']; x++) {
      sum += parseFloat((<HTMLInputElement>document.getElementById("Amount" + x)).value);
    }
    this.service.formBB.patchValue({ Amount: sum });
    this.service.totalAmount = (Number(sum).toLocaleString('en-GB'));
  }

}
