import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { CreditTermsService } from 'src/app/service/references/credit-terms.service';
import { CurrencyService } from 'src/app/service/references/currency.service';
import { PurchaseService } from 'src/app/service/purchasing/transaction/purchase.service';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';

@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.component.html',
  styles: []
})
export class PurchaseEntryComponent implements OnInit {
  currencyList = [];
  termsList = [];
  portList = [];
  deletedIDs = "";

  constructor(public creditTermsService: CreditTermsService,
    public currencyService: CurrencyService,
    private dialog: MatDialog,
    private router: Router,
    public serviceNotification: NotificationService,
    private currentRoute: ActivatedRoute,
    public service: PurchaseService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PurchaseEntryComponent>,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);

    this.creditTermsService.getList().subscribe(res => this.termsList = res as []);
    this.currencyService.getList().subscribe(res => this.currencyList = res as []);

  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "PO";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "PO";
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formPO.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formPO.get('items')).removeAt(i);
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
    this.service.formPO.reset();
    this.service.formPO = this.fb.group({
      PurchaseOrderID: [0],
      SupplierID: ['', Validators.required],
      PurchaseDate: ['', Validators.required],
      PONumber: ['', Validators.required],
      Amount: [0],
      Status: [-1],
      IsPrinted: [0],
      PRSNumber: [''],
      CreditTermsID: ['', Validators.required],
      Days: [0],
      Currency_ID: ['', Validators.required],
      POTypeID: [0],
      Remarks: [''],
  
      RC: [new Date()],
      RCU: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    });
    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formPO.get('items')).length !== 0) {
      (<FormArray>this.service.formPO.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    (<HTMLInputElement>document.getElementById("Amount" + i)).value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2)).toString();
    item.controls.Amount.value = parseFloat((item.value.Quantity * item.value.UnitCost).toFixed(2));
    let sum = 0
    for (let x = 0; x < this.service.formPO.get('items')['length']; x++) {
      sum += parseFloat((<HTMLInputElement>document.getElementById("Amount" + x)).value);
    }
    this.service.formPO.patchValue({ Amount: sum });
    this.service.totalAmount = (Number(sum).toLocaleString('en-GB'));

  }






}
