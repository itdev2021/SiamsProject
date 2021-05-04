import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, CheckboxControlValueAccessor } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';

import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { AccountTitleLookupComponent } from 'src/app/modules/lookup/account-title-lookup/account-title-lookup.component';
import { GeneratorService } from 'src/app/service/tools/generator.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { RefDataService } from 'src/app/service/references/ref-data.service';
import { BankService } from 'src/app/service/accounting/bank.service';
import { DFATReferenceLookupComponent } from '../reference-lookup/dfat-reference-lookup.component';
import { DisbursementFATService } from 'src/app/service/disbursement/transaction/disbursementfat.service';
import { AdvsLookupComponent } from '../advs-lookup/advs-lookup.component';
import { DFATVoucherPaymentComponent } from '../dfat-voucher-payment/dfat-voucher-payment.component';
import { GlobalService } from 'src/app/service/global.service';
import { ReceivingReceiptEntryComponent } from 'src/app/modules/purchasing/transaction/receiving-receipt/receiving-receipt-entry/receiving-receipt-entry.component';
// import { CDVoucherPaymentComponent } from '../cd-voucher-payment/cd-voucher-payment.component';


@Component({
  selector: 'app-disbursement-from-advs-to-entry',
  templateUrl: './disbursement-from-advs-to-entry.component.html',
  styles: []
})

export class DisbursementFromAdvsToEntryComponent implements OnInit {
  acctTitleList = [];
  bankList = [];
  payTypeList = [];
  userList = [];

  deletedIDs = "";

  /** control for the selected bank */
  public warehouseSearchCtrl: FormControl = new FormControl();
  meta: any;

  @ViewChild('selectList', { static: false }) selectList: ElementRef;
  constructor(public acctTitleService: AccountTitleService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public service: DisbursementFATService,
    public serviceGenerator: GeneratorService,
    public serviceNotification: NotificationService,
    public serviceBank: BankService,
    public serviceRefData: RefDataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReceivingReceiptEntryComponent>,
    public globalService: GlobalService) { }


  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    // alert ("Your Advance Amount is bigger than your Billing Amount")
  }

  onGenerateID() {
    // if (this.service.formDFAT.value.JournalEntryID == '') {
    //   this.serviceGenerator.getTableID("SupplierReturns").subscribe(res => this.service.formDFAT.patchValue({ JournalEntryID: res['nextNo'] }));
    // }
  }
  

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "DFAT";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  // alertAction(){
  //   if (this.service.formDFAT.value.AdvsAmt > this.service.formDFAT.value.BillingAmt ){
  //     alert ("Your Advance Amount is bigger than your Billing Amount")
  //   }
  // }

  onChangeBank(event) {
    this.service.getPatchBank();
  }

  onSelectAdvsReference(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = [this.service.formDFAT.value.SupplierID,item];
    this.dialog.open(AdvsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectDebitAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DFAT", i, item, "Debit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCreditAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DFAT", i, item, "Credit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "80%";
    dialogConfig.data = [this.service.formDFAT.value.SupplierID];
    this.dialog.open(DFATReferenceLookupComponent, dialogConfig).afterClosed().subscribe(res => {
    });
  }

  ondeleteOrderItem(item, i: number) {
    if (item.value.DisbursementFATDetailID != 0) {
      this.deletedIDs += item.value.DisbursementFATDetailID + ",";
      this.service.formDFAT.patchValue({
        DeleteIDs: this.deletedIDs
      });

    }
    (<FormArray>this.service.formDFAT.get('items')).removeAt(i);

    this.service.updateTotal(item);
  }

  onSubmit(fg: FormGroup) {
    if (fg.valid) {
      this.service.saveOrUpdate()
        .subscribe(res => {
          this.serviceNotification.success('Submitted successfully!');
          this.resetForm();
          this.onClose();
        });
    }
    else
      this.serviceNotification.warn('Make it sure all mandatory fields are filled up!');
  }
  
  onClose(){
    this.resetForm();
    this.dialogRef.close()
  }

  resetForm() {
    this.service.formDFAT.reset();
    this.service.formDFAT = this.fb.group({
      DisbursementFATID: [0],
      DisbursementFATDate: [0],
      SupplierID: ['', Validators.required],
      Supplier: ['', Validators.required],
      Remarks: [''],
      TotalPayment: [0, Validators.required],
      Status: [-1],
      IsPrinted: [0],
      RC: [new Date()],
      RCU: [0],

      DeleteIDs: [''],
      items: this.fb.array([]),
      voucherDetails: this.fb.array([]),
      itemsLedger: this.fb.array([])
    });

    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formDFAT.get('items')).length !== 0) {
      (<FormArray>this.service.formDFAT.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  onPrintDoc(fg: FormGroup) {
    this.service.PrintDocument(fg);
  }

  onPrintVoucher(fg: FormGroup) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    this.dialog.open(DFATVoucherPaymentComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

  updateTotal(item, i){
    (<HTMLInputElement>document.getElementById("OutstandingAmt" + i)).value = parseFloat((item.value.BillingAmt - item.value.AdvsAmt).toFixed(2)).toString();
    item.controls.OutstandingAmt.value = parseFloat ((item.value.BillingAmt - item.value.AdvsAmt).toFixed(2));
    let sum = 0
    for (let x = 0; x < this.service.formDFAT.get('items')['length']; x++){
      sum += parseFloat((<HTMLInputElement>document.getElementById("AdvsAmt" + x)).value);
    }
    this.service.formDFAT.patchValue({ AdvsAmt: sum });
    this.service.totalAmount = (Number(sum).toLocaleString('en-GB'));
    if (item.controls.OutstandingAmt.value < 0){
      alert ("Your Advance Amount is bigger than your Billing Amount");
    }
  }

}
