import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, CheckboxControlValueAccessor } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';

import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { AccountTitleLookupComponent } from 'src/app/modules/lookup/account-title-lookup/account-title-lookup.component';
import { GeneratorService } from 'src/app/service/tools/generator.service';
import { NotificationService } from 'src/app/service/notification.service';
import { RefDataService } from 'src/app/service/references/ref-data.service';
import { BankService } from 'src/app/service/accounting/bank.service';
import { DisbursementDPService } from 'src/app/service/disbursement/transaction/disbursementdp.service';
import { CostUnitComponent } from 'src/app/modules/lookup/cost-unit/cost-unit.component';
import { DDPVoucherPaymentComponent } from '../ddp-voucher-payment/ddp-voucher-payment.component';
import { GlobalService } from 'src/app/service/global.service';


@Component({
  selector: 'app-disbursement-dp-entry',
  templateUrl: './disbursement-dp-entry.component.html',
  styles: []
})

export class DisbursementDPEntryComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<DisbursementDPEntryComponent>,
    public acctTitleService: AccountTitleService,
    private dialog: MatDialog,
    public service: DisbursementDPService,
    public serviceGenerator: GeneratorService,
    public serviceNotification: NotificationService,
    public serviceBank: BankService,
    public serviceRefData: RefDataService,
    private fb: FormBuilder,
    public globalService: GlobalService,
    private router: Router,) { }


  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);

    let id = this.data;
    if (id == null) {
      this.resetForm();
    }
    else {
      this.service.getInfo(id);
    }
  }

  resetForm() {
    this.service.formDDP.reset();
    this.service.formDDP = this.fb.group({
      CashDisbursementDPID: [0],
      CashDisbursementDPDate: ['', Validators.required],
      SupplierID: ['', Validators.required],
      Supplier: ['', Validators.required],
      CheckNo: ['', Validators.required],
      AccountTitleDebitID: ['', Validators.required],
      AccountTitleDebit: ['', Validators.required],
      AccountTitleCreditID: ['', Validators.required],
      AccountTitleCredit: ['', Validators.required],
      Amount: ['', Validators.required],
      RecordDate: ['1/1/1900'],
      PostedDate: ['1/1/1900'],
      CostUnitID: [0],
      CostUnit: [''],
      Remarks: [''],
      Paytotypeid: [0],
      IDS: [0],
      PostedBy: [0],
      Status: [-1],
      IsPrinted: [0],
      RC: [new Date()],
      RCU: [0]
    });
  }

  onGenerateID() {
    // if (this.service.formDDP.value.JournalEntryID == '') {
    //   this.serviceGenerator.getTableID("SupplierReturns").subscribe(res => this.service.formDDP.patchValue({ JournalEntryID: res['nextNo'] }));
    // }
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "DDP";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectDebitAccountID() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DDP", "Debit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCreditAccountID() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DDP", "Credit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCostUnitID() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DDP", "Credit"];
    this.dialog.open(CostUnitComponent, dialogConfig).afterClosed().subscribe(res => {

    });
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

  onClose() {
    this.service.formDDP.reset();
    this.dialogRef.close();;
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
    this.dialog.open(DDPVoucherPaymentComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }


  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

}
