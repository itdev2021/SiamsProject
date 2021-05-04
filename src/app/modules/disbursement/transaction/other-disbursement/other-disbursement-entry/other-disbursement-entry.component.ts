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
import { CostUnitComponent } from 'src/app/modules/lookup/cost-unit/cost-unit.component';
import { OtherDisbursementReferenceLookupComponent } from '../other-disbursement-reference-lookup/other-disbursement-reference-lookup.component';
import { OtherDisbursementService } from 'src/app/service/disbursement/transaction/other-disbursement.service';
import { ODVoucherPaymentComponent } from '../od-voucher-payment/od-voucher-payment.component';
import { GlobalService } from 'src/app/service/global.service';


@Component({
  selector: 'app-other-disbursement-entry',
  templateUrl: './other-disbursement-entry.component.html',
  styles: []
})

export class OtherDisbursementEntryComponent implements OnInit {
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
    public service: OtherDisbursementService,
    public serviceGenerator: GeneratorService,
    public serviceNotification: NotificationService,
    public serviceBank: BankService,
    public serviceRefData: RefDataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OtherDisbursementEntryComponent>,
    public globalService: GlobalService) { }


  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    // let id = this.currentRoute.snapshot.paramMap.get('id');
    // if (id == null) {
    //   this.resetForm();
    // }
    // else {
    //   this.service.getInfo(id);
    // }
  }

  onGenerateID() {
    // if (this.service.formOD.value.JournalEntryID == '') {
    //   this.serviceGenerator.getTableID("SupplierReturns").subscribe(res => this.service.formOD.patchValue({ JournalEntryID: res['nextNo'] }));
    // }
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "OD";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectReferenceNo(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = item;
    this.dialog.open(OtherDisbursementReferenceLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCostCenter(item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["OD", item];
    this.dialog.open(CostUnitComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectAccountTitle(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["OD", item];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  updateTotal(item) {
    let debit = 0;
    let credit = 0;
    for (let x = 0; x < this.service.formOD.get('items')['length']; x++) {
      debit += parseFloat((<HTMLInputElement>document.getElementById("Debit" + x)).value);
      credit += parseFloat((<HTMLInputElement>document.getElementById("Credit" + x)).value);
    }

    this.service.formOD.patchValue({ Debit: debit, Credit: credit });
  }

  AddorEditOrderItem() {
    this.service.getItemRow();
  }

  ondeleteOrderItem(item, i: number) {
    if (item.value.DisbursementDetailID != null) {
      this.deletedIDs += item.value.DisbursementDetailID + ",";
      this.service.formOD.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formOD.get('items')).removeAt(i);

    this.updateTotal(item);
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
    this.service.formOD.reset();
    this.service.formOD = this.fb.group({
      OtherDisbursementID: [0],
      OtherDisbursementDate: [0],
      Remarks: [''],
      Debit: [0, Validators.required],
      Credit: [0, Validators.required],
      PayToID: [0],
      PayTo: [''],
      PayToTypeID: [0],
      CheckNo: [''],
      Reference: [''],
      Status: [-1],
      IsPrinted: [0],
      RC: [new Date()],
      RCU: [0],

      DeleteIDs: [''],
      items: this.fb.array([]),
      voucherDetails: this.fb.array([]),
      itemsLedger: this.fb.array([])
    });

    // this.service.totalAmount = '0';
    while ((<FormArray>this.service.formOD.get('items')).length !== 0) {
      (<FormArray>this.service.formOD.get('items')).removeAt(0)
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
    this.dialog.open(ODVoucherPaymentComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

}
