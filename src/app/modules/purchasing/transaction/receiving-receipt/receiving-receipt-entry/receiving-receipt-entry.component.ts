import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { CustomerService } from 'src/app/service/sales/customer.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { ReceivingReceiptService } from 'src/app/service/purchasing/transaction/receiving-receipt.service';
import { DesignationService } from 'src/app/service/inventory/designation.service';
import { AssetLifeService } from 'src/app/service/accounting/asset-life.service';
import { ReceivingItemComponent } from '../receiving-item/receiving-item.component';
import { UserService } from 'src/app/service/User/user.service';
import { RefDataService } from 'src/app/service/references/ref-data.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { AccountTitleLookupComponent } from 'src/app/modules/lookup/account-title-lookup/account-title-lookup.component';

@Component({
  selector: 'app-receiving-receipt-entry',
  templateUrl: './receiving-receipt-entry.component.html',
  styles: []
})
export class ReceivingReceiptEntryComponent implements OnInit {

  warehouseList = [];
  designationList = [];
  assetLifeList = [];
  acctTitleDebitList = [];
  acctTitleCreditList = [];
  receiverList = [];
  approverList = [];
  checkerList = [];
  stockTypeList = [];
  rrTypeList = [];
  vatableList = [];
  journalTypeList = [];
  printingFormatList;
  deletedIDs = "";


  constructor(
    public warehouseService: WarehouseService,
    public clientService: CustomerService,
    public acctTitleService: AccountTitleService,
    public designationService: DesignationService,
    public assetLifeService: AssetLifeService,
    public userService: UserService,
    public refDataService: RefDataService,
    public service: ReceivingReceiptService,
    public serviceNotification: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public serviceRefData: RefDataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReceivingReceiptEntryComponent>,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);

    this.warehouseService.getWarehouseList().subscribe(res => this.warehouseList = res as []);
    this.designationService.getDesignationList().subscribe(res => this.designationList = res as []);
    this.assetLifeService.getList().subscribe(res => this.assetLifeList = res as []);

    this.acctTitleService.getAccountTitleList().subscribe(res => {
      this.acctTitleDebitList = res as [];
      this.acctTitleDebitList.sort((a, b) => a.AccountTitle > b.AccountTitle ? 1 : -1);
    });
    this.acctTitleService.getAccountTitleList().subscribe(res => {
      this.acctTitleCreditList = res as [];
      this.acctTitleCreditList.sort((a, b) => a.AccountTitle > b.AccountTitle ? 1 : -1);
    });
    this.userService.getList().subscribe(res => {
      this.receiverList = res as [];
      this.receiverList.sort((a, b) => a.CompleteName > b.CompleteName ? 1 : -1);
    });
    this.userService.getList().subscribe(res => {
      this.approverList = res as [];
      this.approverList.sort((a, b) => a.CompleteName > b.CompleteName ? 1 : -1);
    });
    this.userService.getList().subscribe(res => {
      this.checkerList = res as [];
      this.checkerList.sort((a, b) => a.CompleteName > b.CompleteName ? 1 : -1);
    });

    this.refDataService.getList().subscribe(res => {
      var data: any = res as [];
      data.sort((a, b) => a.refText > b.refText ? 1 : -1);
      this.stockTypeList = data.filter(a => a.refData == 'STOCK-TYPE');
    });

    this.refDataService.getList().subscribe(res => {
      var data: any = res as [];
      data.sort((a, b) => a.refText > b.refText ? 1 : -1);
      this.rrTypeList = data.filter(a => a.refData == 'RECEIVING-TYPE');
    });

    this.refDataService.getList().subscribe(res => {
      var data: any = res as [];
      data.sort((a, b) => a.refText > b.refText ? 1 : -1);
      this.vatableList = data.filter(a => a.refData == 'VATABLE');
    });

    this.refDataService.getList().subscribe(res => {
      var data: any = res as [];
      data.sort((a, b) => a.refText > b.refText ? 1 : -1);
      this.journalTypeList = data.filter(a => a.refData == 'JOURNAL-TYPE');
    });

    this.serviceRefData.getList().subscribe(res => {
      var list = [];
      list = res as [];
      return this.printingFormatList = list.filter(x => x.refData == 'PRINTING FORMAT - RECEIVING RECEIPT');
    });

  }

  AddorEditOrderItem() {
    if (this.service.formRR.value.SupplierID != '') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = "60%";
      dialogConfig.data = this.service.formRR.value.SupplierID;
      this.dialog.open(ReceivingItemComponent, dialogConfig).afterClosed().subscribe(res => {

      });
    }
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formRR.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formRR.get('items')).removeAt(i);
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "RR";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectDebitAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["RR", i, item, "Debit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCreditAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["RR", i, item, "Credit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
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
    this.service.formRR.reset();
    this.service.formRR = this.fb.group({
      ReceivingReceiptID: [0],
      ReceivingDate: ['', Validators.required],
      ReferenceNo: [''],
      WarehouseID: [1],
      SupplierID: ['', Validators.required],
      Supplier: [''],
      Remarks: [''],
      TotalCost: [0],
      Disc: [''],
      DiscAmount: [0],
      TotalEWT: [0],
      NetTotalCost: [0],
      Status: [-1],
      IsPrinted: [0],
      ReceivingReceiptTypeID: [1],
      Vatable: [1],
      DRNo: [''],
      SINo: [''],
      CheckedBy: ['', Validators.required],
      PreparedBy: ['', Validators.required],
      ApprovedBy: ['', Validators.required],
      dateAssay: ['01/01/1900'],
      StockType: [0],
      JournalType: [1],
      ClientCode: [''],
      ClientName: [''],
      ImportFlag: [0],
      DesignationID: [0],
      AssetLifeID: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    });
    this.service.totalAmount = '0';
    while ((<FormArray>this.service.formRR.get('items')).length !== 0) {
      (<FormArray>this.service.formRR.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

  changeSelect(value) {
    console.log(value);
  }

  updateTotal(item, i) {
    // (<HTMLInputElement>document.getElementById("TotalCost" + i)).value = parseFloat((item.value.Qty * item.value.UnitCost).toFixed(2)).toString();
    item.controls.TotalCost.patchValue(item.value.Qty * item.value.UnitCost);

    // (<HTMLInputElement>document.getElementById("DiscAmount" + i)).value = parseFloat(((item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)).toFixed(2)).toString();
    item.controls.DiscAmount.patchValue((item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost));

    // (<HTMLInputElement>document.getElementById("NetTotalCost" + i)).value = parseFloat(((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)).toFixed(2)).toString();
    item.controls.NetTotalCost.patchValue((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost));

    // (<HTMLInputElement>document.getElementById("EWT" + i)).value = parseFloat((((item.value.EWTRate / 100) / 1.12) * ((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost))).toFixed(2)).toString();
    item.controls.EWT.patchValue(((item.value.EWTRate / 100) / 1.12) * ((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)));

    // (<HTMLInputElement>document.getElementById("NetTotalEWT" + i)).value = parseFloat((((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)) - ((item.value.EWTRate / 100) / 1.12) * ((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost))).toFixed(2)).toString();
    item.controls.NetTotalEWT.patchValue(((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)) - ((item.value.EWTRate / 100) / 1.12) * ((item.value.Qty * item.value.UnitCost) - (item.value.Disc / 100) * (item.value.Qty * item.value.UnitCost)));

    let sumCost = 0;
    let sumEWT = 0;
    let sumAmt = 0;

    for (let x = 0; x < this.service.formRR.get('items')['length']; x++) {
      sumCost += parseFloat((<HTMLInputElement>document.getElementById("TotalCost" + x)).value);
      sumEWT += parseFloat((<HTMLInputElement>document.getElementById("EWT" + x)).value);
      sumAmt += parseFloat((<HTMLInputElement>document.getElementById("NetTotalEWT" + x)).value);
    }

    this.service.formRR.controls.TotalCost.patchValue(sumCost);
    this.service.formRR.controls.TotalEWT.patchValue(sumEWT);
    this.service.formRR.controls.NetTotalCost.patchValue(sumAmt);

    this.service.totalCost = (Number(sumCost).toLocaleString('en-GB'));
    this.service.totalEWT = (Number(sumEWT).toLocaleString('en-GB'));
    this.service.totalAmount = (Number(sumAmt).toLocaleString('en-GB'));
  }


  onPrintDoc(fg: FormGroup) {
    this.service.PrintDocument(fg);
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }


}
