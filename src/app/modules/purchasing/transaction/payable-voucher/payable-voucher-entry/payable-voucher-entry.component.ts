import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';

import { PayableVourcherService } from 'src/app/service/purchasing/transaction/payable-vourcher.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { CostUnitComponent } from 'src/app/modules/lookup/cost-unit/cost-unit.component';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { AccountTitleLookupComponent } from 'src/app/modules/lookup/account-title-lookup/account-title-lookup.component';
import { GeneratorService } from 'src/app/service/tools/generator.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PrintReportService } from 'src/app/service/print-report/print-report.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-payable-voucher-entry',
  templateUrl: './payable-voucher-entry.component.html',
  styles: []
})
export class PayableVoucherEntryComponent implements OnInit {
  acctTitleList = [];
  costUnitList = [];
  deletedIDs = "";

  constructor(public acctTitleService: AccountTitleService,
    private dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<PayableVoucherEntryComponent>,
    private currentRoute: ActivatedRoute,
    public service: PayableVourcherService,
    public serviceGenerator: GeneratorService,
    private serviceNotification: NotificationService,
    public printReportService: PrintReportService,
    public globalService: GlobalService,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    let id = this.currentRoute.snapshot.paramMap.get('id');
    if (id == null) {
      this.resetForm();
    }
    else {
      this.service.getInfo(id);
    }
    this.acctTitleService.getAccountTitleList().subscribe(res => this.acctTitleList = res as []);
  }

  // onGenerateID() {
  //   if (this.service.formPV.value.JournalEntryID == '') {
  //     this.serviceGenerator.getTableID("JournalEntry").subscribe(res => this.service.formPV.patchValue({ JournalEntryID: res['nextNo'] }));
  //   }
  // }

  // generatePVID() {
  //   if (this.service.formPV.value.HeaderReference == '') {
  //     this.serviceGenerator.getTableID("PV").subscribe(res => this.service.formPV.patchValue({HeaderReference: 'PV' + res['nextNo']}));
  //   }
  // }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "PV";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }
  onSelectAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["PV", i, item];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCostUnit(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["PV", i, item];
    this.dialog.open(CostUnitComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    this.service.getItemRow();
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formPV.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formPV.get('items')).removeAt(i);
  }

  onSubmit(fg: FormGroup) {
    if (fg.valid) {
      // this.generatePVID();
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
    this.service.formPV.reset();
    this.service.formPV = this.fb.group({
      PayableVoucherID: [0],
      PayableVoucherDate: ['', Validators.required],
      PayTo: ['', Validators.required],
      PayToID: [0],
      PayToTypeID: [0],
      POReference: [0],
      Reference: [''],
      Remarks: ['', Validators.required],
      Debit: [0],
      Credit: [0],
      Status: [-1],
      IsPrinted: [0],
      RC: [new Date()],
      RCU: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    });

    // this.service.totalAmount = '0';
    while ((<FormArray>this.service.formPV.get('items')).length !== 0) {
      (<FormArray>this.service.formPV.get('items')).removeAt(0)
    }
  }

  onBlurAutoComplete(value) {
    if (value > 0)
      this.service.formPV.controls.Reference.patchValue("PV" + this.globalService.padLeft(value, '0', 10));
    else
      this.service.formPV.controls.Reference.patchValue('');
  }

  changeClient(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    let debit = 0;
    let credit = 0;
    for (let x = 0; x < this.service.formPV.get('items')['length']; x++) {
      debit += parseFloat((<HTMLInputElement>document.getElementById("Debit" + x)).value);
      credit += parseFloat((<HTMLInputElement>document.getElementById("Credit" + x)).value);
    }
    this.service.formPV.patchValue({ Debit: debit, Credit: credit });
  }

  onPrintDoc(fg: FormGroup) {
    this.service.PrintDocument(fg);
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

}
