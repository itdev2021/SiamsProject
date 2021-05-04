import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';

import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { CostUnitComponent } from 'src/app/modules/lookup/cost-unit/cost-unit.component';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { AccountTitleLookupComponent } from 'src/app/modules/lookup/account-title-lookup/account-title-lookup.component';
import { OtherPayableVourcherService } from 'src/app/service/purchasing/transaction/other-payable-vourcher.service';
import { GeneratorService } from 'src/app/service/tools/generator.service';
import { NotificationService } from 'src/app/service/notification.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-other-payable-voucher-entry',
  templateUrl: './other-payable-voucher-entry.component.html',
  styles: []
})
export class OtherPayableVoucherEntryComponent implements OnInit {
  acctTitleList = [];
  costUnitList = [];
  deletedIDs = "";

  constructor(public acctTitleService: AccountTitleService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public service: OtherPayableVourcherService,
    public serviceGenerator: GeneratorService,
    private serviceNotification: NotificationService,
    public globalService: GlobalService,
    public dialogRef: MatDialogRef<OtherPayableVoucherEntryComponent>,
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

  onGenerateID() {
    if (this.service.formOPV.value.JournalEntryID == '') {
      this.serviceGenerator.getTableID("JournalEntry").subscribe(res => this.service.formOPV.patchValue({ JournalEntryID: res['nextNo'] }));
    }
  }

  generateOPVID() {
    // if (this.service.formOPV.value.HeaderReference == '') {
    //   this.serviceGenerator.getTableID("OPV").subscribe(res => this.service.formOPV.patchValue({ HeaderReference: res['nextNo'] }));
    // }
  }

  onBlurAutoComplete(value) {
    // if (value > 1)
    //   this.service.formOPV.controls.Reference.patchValue("OPV" + this.globalService.padLeft(value, '0', 10));
    // else
    //   this.service.formOPV.controls.Reference.patchValue('');
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "OPV";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }
  onSelectAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["OPV", i, item];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCostUnit(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["OPV", i, item];
    this.dialog.open(CostUnitComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  AddorEditOrderItem() {
    this.service.getItemRow();
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formOPV.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formOPV.get('items')).removeAt(i);
  }

  onSubmit(fg: FormGroup) {
    this.generateOPVID();
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
    this.service.formOPV.reset();
    this.service.formOPV = this.fb.group({
      OtherPayableVoucherID: [0],
      OtherPayableVoucherDate: ['', Validators.required],
      PayTo: ['', Validators.required],
      PayToID: [0],
      PayToTypeID: [0],
      POReferenceID: [''],
      Reference: ['', Validators.required],
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
    while ((<FormArray>this.service.formOPV.get('items')).length !== 0) {
      (<FormArray>this.service.formOPV.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    let debit = 0;
    let credit = 0;
    for (let x = 0; x < this.service.formOPV.get('items')['length']; x++) {
      debit += parseFloat((<HTMLInputElement>document.getElementById("Debit" + x)).value);
      credit += parseFloat((<HTMLInputElement>document.getElementById("Credit" + x)).value);
    }
    this.service.formOPV.patchValue({ Debit: debit, Credit: credit });
    // this.service.debit = (Number(debit).toLocaleString('en-GB'));
    // this.service.credit = (Number(credit).toLocaleString('en-GB'));
  }

  onPrintDoc(fg: FormGroup) {
    this.service.PrintDocument(fg);
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

}
