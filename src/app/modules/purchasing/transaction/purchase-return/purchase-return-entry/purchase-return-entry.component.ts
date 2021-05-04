import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, CheckboxControlValueAccessor } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';

import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { DeliveredToComponent } from 'src/app/modules/lookup/delivered-to/delivered-to.component';
import { AccountTitleLookupComponent } from 'src/app/modules/lookup/account-title-lookup/account-title-lookup.component';
import { GeneratorService } from 'src/app/service/tools/generator.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PurchaseReturnService } from 'src/app/service/purchasing/transaction/purchase-return.service';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { CreditReasonService } from 'src/app/service/references/credit-reason.service';
import { UomService } from 'src/app/service/references/uom.service';
import { PurchaseItemsLookupComponent } from '../purchase-item-lookup/purchase-items-lookup.component';
import { UserService } from 'src/app/service/User/user.service';
import { RefDataService } from 'src/app/service/references/ref-data.service';
import { GlobalService } from 'src/app/service/global.service';


@Component({
  selector: 'app-purchase-return-entry',
  templateUrl: './purchase-return-entry.component.html',
  styles: []
})

export class PurchaseReturnEntryComponent implements OnInit {
  acctTitleList = [];
  warehouseList = [];
  referenceList = [];
  productList = [];
  uomList = [];
  reasonList = [];
  printingFormatList;
  userList = [];


  list;

  deletedIDs = "";

  /** control for the selected bank */
  public warehouseSearchCtrl: FormControl = new FormControl();
  meta: any;

  @ViewChild('selectList', { static: false }) selectList: ElementRef;
  constructor(public acctTitleService: AccountTitleService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public service: PurchaseReturnService,
    public serviceGenerator: GeneratorService,
    public serviceNotification: NotificationService,
    public serviceWarehouse: WarehouseService,
    public serviceCreditReason: CreditReasonService,
    public serviceUOM: UomService,
    public serviceUser: UserService,
    public serviceRefData: RefDataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PurchaseReturnEntryComponent>,
    public globalService: GlobalService) { }


  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);

    let id = this.currentRoute.snapshot.paramMap.get('id');
    if (id == null) {
      this.resetForm();
    }
    else {
      this.service.getInfo(id);
    }


    // this.selectSearch('');
    this.serviceWarehouse.getWarehouseList().subscribe(res => {
      this.warehouseList = res as [];
      this.warehouseList.sort((a, b) => a.WareHouse > b.WareHouse ? 1 : -1);
    });
    this.acctTitleService.getAccountTitleList().subscribe(res => {
      this.acctTitleList = res as [];
      this.acctTitleList.sort((a, b) => a.AccountTitle > b.AccountTitle ? 1 : -1);
    });
    this.serviceCreditReason.getList().subscribe(res => {
      this.reasonList = res as [];
      this.reasonList.sort((a, b) => a.Reason > b.Reason ? 1 : -1);
    });
    this.serviceUser.getList().subscribe(res => {
      this.userList = res as [];
      this.userList.sort((a, b) => a.CompleteName > b.CompleteName ? 1 : -1);
    });

    this.serviceRefData.getList().subscribe(res => {
      var list = [];
      list = res as [];
      return this.printingFormatList = list.filter(x => x.refData == 'PRINTING FORMAT - PURCHASE RETURN');
    });

  }


  onKey(value) {
    console.log(value);
    // this.warehouseList = [];
    this.selectSearch(value);
  }

  selectSearch(value: string) {
    this.serviceWarehouse.getWarehouseList().subscribe(res => {
      this.list = res as [];
      if (!value) {
        this.warehouseList = this.list;
      } // when nothing has typed*/  

      if (typeof value === 'string') {
        console.log(value);
        // this.warehouseList = this.list.filter(a => a.toLowerCase().startsWith(value.toLowerCase()));
        this.warehouseList = this.list.filter(a => a.toLowerCase().startsWith(value.toLowerCase()));
      }
      console.log(this.warehouseList.length);
      // this.selectList.nativeElement.size = this.list.length + 1;
    });
  }

  onGenerateID() {
    if (this.service.formSR.value.JournalEntryID == '') {
      this.serviceGenerator.getTableID("SupplierReturns").subscribe(res => this.service.formSR.patchValue({ JournalEntryID: res['nextNo'] }));
    }
  }

  onSelectDeliveredTo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "SR";
    this.dialog.open(DeliveredToComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectDebitAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["SR", i, item, "Debit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  onSelectCreditAccountID(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["SR", i, item, "Credit"];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }


  AddorEditOrderItem() {
    if (this.service.formSR.value.Supplier) {
      this.service.getItemRow();
      this.service.getBySupplierIDReferenceList(this.service.formSR.value.SupplierID).subscribe(res => {this.referenceList = res as [];
      console.log(res)});
    }
  }


  onChangeReference(event, item, i) {
    // this.service.getBySupplierIDRRItemList(this.service.formSR.value.SupplierID, event.value).subscribe(res => this.productList = res as []);
  }
  onClickProduct(item, i) {
    if (item.controls.ReferenceNo.value) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = "60%";
      dialogConfig.data = [this.service.formSR.value.SupplierID, item.controls.ReferenceNo.value, item, i];
      this.dialog.open(PurchaseItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {
      });
    }
  }

  onSelectDebitAcctNo(item, i) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = ["SR", i, item];
    this.dialog.open(AccountTitleLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  // onChangeProduct(event, item, i) {
  //   for (let x = 0; x < this.service.formSR.get('items')['length']; x++) {
  //     if (x == i) {
  //       this.service.getBySupIDRefIDRRItemList(this.service.formSR.value.SupplierID, this.service.formSR.get('items').value[i].ReferenceNo, event.value).subscribe(res => {
  //         console.log(res[0]);
  //         item.controls.UOMID.value = res[0].UOMID
  //         this.serviceUOM.getUOMList().subscribe(x => {
  //           this.uomList = x as [];
  //           item.controls.UOMDescription.patchValue(this.uomList.filter(u => u.UOMID == res[0].UOMID)[0].UOMDescription);
  //         })
  //         item.controls.Quantity.patchValue(res[0].Qty);
  //         item.controls.UnitCost.patchValue(res[0].UnitCost);
  //         item.controls.ComputedCost.patchValue(res[0].TotalCost);
  //         item.controls.LotNo.patchValue(res[0].LotNo);
  //         item.controls.ExpiryDate.patchValue(formatDate(res[0].ExpiryDate, "MM/dd/yyyy", ('en-US')));
  //         item.controls.ManufacturingDate.patchValue(formatDate(res[0].ManufacturingDate, "MM/dd/yyyy", ('en-US')));
  //         item.controls.Disc.patchValue(res[0].Disc);
  //         item.controls.DiscAmount.patchValue(res[0].DiscAmount);
  //         item.controls.Gross.patchValue(res[0].NetTotalCost);
  //         item.controls.EWTRate.patchValue(res[0].EWTRate);
  //         item.controls.EWT.patchValue(res[0].EWT);
  //         item.controls.TotalGross.patchValue(res[0].NetTotalEWT);
  //       });

  //     }
  //   }
  // }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formSR.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formSR.get('items')).removeAt(i);
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
    this.resetForm();
    this.dialogRef.close()
  }

  resetForm() {
    this.service.formSR.reset();
    this.service.formSR = this.fb.group({
      SupplierReturnsID: [0],
      SupplierReturnsDate: ['', Validators.required],
      SupplierReturnsNumber: [''],
      ReceivingReceiptReferenceNo: [''],
      ReceivingReceiptID: [0],
      SupplierID: [0],
      Supplier: ['', Validators.required],
      Address: [''],
      DebitNoteID: [0],
      Gross: [0],
      Discount: [0],
      DiscountAmount: [0],
      Net: [0, Validators.required],
      WarehouseID: ['', Validators.required],
      Remarks: ['', Validators.required],
      ReasonID: ['', Validators.required],
      PreparedByID: ['', Validators.required],
      CheckedBy: ['', Validators.required],
      PreparedByName: [''],
      CheckedByName: [''],
      Status: [-1],
      RC: [new Date()],
      RCU: [0],
      IsPrinted: [0],
      STSNo: [''],

      DeleteIDs: [''],
      items: this.fb.array([])
    });

    // this.service.totalAmount = '0';
    while ((<FormArray>this.service.formSR.get('items')).length !== 0) {
      (<FormArray>this.service.formSR.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }


  updateTotal(item) {
    item.controls.ComputedCost.patchValue(item.controls.Quantity.value * item.controls.UnitCost.value);
    item.controls.DiscAmount.patchValue((item.controls.Disc.value / 100) * item.controls.ComputedCost.value);
    item.controls.Gross.patchValue(item.controls.ComputedCost.value - item.controls.DiscAmount.value);
    item.controls.EWT.patchValue((item.controls.EWTRate.value / 100 / 1.12) * item.controls.Gross.value);
    item.controls.TotalGross.patchValue(item.controls.Gross.value);

    let sumCost = 0;
    let sumDisc = 0;
    let sumDiscAmt = 0;
    let sumEWT = 0;
    let sumTotalGross = 0;

    for (let x = 0; x < this.service.formSR.get('items')['length']; x++) {
      sumCost += parseFloat((<HTMLInputElement>document.getElementById("ComputedCost" + x)).value);
      sumDisc += parseFloat((<HTMLInputElement>document.getElementById("Disc" + x)).value);
      sumDiscAmt += parseFloat((<HTMLInputElement>document.getElementById("DiscAmount" + x)).value);
      sumEWT += parseFloat((<HTMLInputElement>document.getElementById("EWT" + x)).value);
      sumTotalGross += parseFloat((<HTMLInputElement>document.getElementById("TotalGross" + x)).value);
    }
    this.service.formSR.patchValue({
      Gross: (Number(sumCost).toLocaleString('en-GB')),
      Discount: (Number(sumDisc).toLocaleString('en-GB')),
      DiscountAmount: (Number(sumDiscAmt).toLocaleString('en-GB')),
      Net: (Number(sumTotalGross).toLocaleString('en-GB'))
    });

  }

  onPrintDoc(fg: FormGroup) {
    this.service.PrintDocument(fg);
  }

  onPrintLedger(fg: FormGroup) {
    this.service.PrintLedger(fg);
  }

}
