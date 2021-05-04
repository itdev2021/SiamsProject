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
import { DisbursementService } from 'src/app/service/disbursement/transaction/disbursement.service';
import { BankService } from 'src/app/service/accounting/bank.service';
import { DVReferenceLookupComponent } from '../reference-lookup/dv-reference-lookup.component';
import { CDVoucherPaymentComponent } from '../cd-voucher-payment/cd-voucher-payment.component';
import { GlobalService } from 'src/app/service/global.service';
import { ReceivingReceiptEntryComponent } from 'src/app/modules/purchasing/transaction/receiving-receipt/receiving-receipt-entry/receiving-receipt-entry.component';


@Component({
  selector: 'app-cash-disbursement-entry',
  templateUrl: './cash-disbursement-entry.component.html',
  styles: []
})

export class CashDisbursementEntryComponent implements OnInit {
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
    public service: DisbursementService,
    public serviceGenerator: GeneratorService,
    public serviceNotification: NotificationService,
    public serviceBank: BankService,
    public serviceRefData: RefDataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReceivingReceiptEntryComponent>,
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

    this.serviceBank.getBankList().subscribe(res => {
      this.bankList = res as [];
      this.bankList.sort((a, b) => a.Reason > b.Reason ? 1 : -1);
    });

    this.serviceRefData.getList().subscribe(res => {
      var list = [];
      list = res as [];
      this.payTypeList = list.filter(x => x.refData == 'DISBURSEMENT - PAYMENT TYPE');
    });
  }

  onGenerateID() {
    // if (this.service.formDV.value.JournalEntryID == '') {
    //   this.serviceGenerator.getTableID("SupplierReturns").subscribe(res => this.service.formDV.patchValue({ JournalEntryID: res['nextNo'] }));
    // }
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "DV";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onChangeBank(event) {
    this.service.getPatchBank();
  }

  onSelectCreditAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DV", i, item, "Credit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "80%";
    dialogConfig.data = [this.service.formDV.value.SupplierID];
    this.dialog.open(DVReferenceLookupComponent, dialogConfig).afterClosed().subscribe(res => {
    });
  }

  onSelectDebitAcctNo(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["DV", i, item];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(item, i: number) {
    if (item.value.DisbursementDetailID != null) {
      this.deletedIDs += item.value.DisbursementDetailID + ",";
      this.service.formDV.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formDV.get('items')).removeAt(i);

    this.service.updateTotal();
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
    this.service.formDV.reset();
    this.service.formDV = this.fb.group({
      DisbursementID: [0],
      DisbursementDate: [0],
      SupplierID: ['', Validators.required],
      Supplier: ['', Validators.required],
      PayType: ['', Validators.required],
      CheckNo: [''],
      BankID: [''],
      BankName:[''],
      AccountTitleCreditID: ['', Validators.required],
      AccountTitleCredit: ['', Validators.required],
      Remarks: [''],
      TotalCash: [0],
      TotalCheck: [0],
      TotalOffset: [0],
      TotalDeposit: [0],
      TotalPayment: [0, Validators.required],
      Status: [-1],
      IsPrinted: [0],
      RC: [new Date()],
      RCU: [0],

      DeleteIDs: [''],
      items: this.fb.array([]),
      itemsLedger: this.fb.array([])
    });

    // this.service.totalAmount = '0';
    while ((<FormArray>this.service.formDV.get('items')).length !== 0) {
      (<FormArray>this.service.formDV.get('items')).removeAt(0)
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
    this.dialog.open(CDVoucherPaymentComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

}
