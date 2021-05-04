import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierPriceQuotationService } from 'src/app/service/inventory/supplier-price-quotation.service';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-supplier-price-quotation-entry',
  templateUrl: './supplier-price-quotation-entry.component.html',
  styles: []
})
export class SupplierPriceQuotationEntryComponent implements OnInit {

  supplierList = [];
  isValid: boolean = true;
  deletedIDs = "";

  constructor(public supplierService: SupplierService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public priceQuotationService: SupplierPriceQuotationService,
    private fb: FormBuilder,
    public globalService: GlobalService,) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    let priceQuotationID = this.currentRoute.snapshot.paramMap.get('id');
    if (priceQuotationID == null)
      this.resetForm();
    else {
      this.priceQuotationService.getPriceQuotationByID(parseInt(priceQuotationID)).subscribe(res => {
        this.priceQuotationService.formPriceQuatation.patchValue({
          PriceQuotationID: res.priceQuotation.PriceQuotationID,
          SupplierID: res.priceQuotation.SupplierID
        });
        this.priceQuotationService.formPriceQuatation.setControl('item', this.setExistingItems(res.priceQuotationDetails));
      });
    }

    this.supplierService.getSupplierList().subscribe(res => this.supplierList = res as []);

  }

  setExistingItems(itemSets): FormArray{
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        PriceQuotationDetailID: i.PriceQuotationDetailID,
        PriceQuotationID: i.PriceQuotationID,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOMDescription: i.UOMDescription,
        UnitCost: i.UnitCost
      }))
    });
    return formArray;
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data =  "SPQ" ;
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.priceQuotationService.formPriceQuatation.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.priceQuotationService.formPriceQuatation.get('item')).removeAt(i);
  }



  onSubmit(fg: FormGroup) {
    this.priceQuotationService.saveOrUpdateOrder()
      .subscribe(res => {
        this.resetForm();
        this.router.navigate(['/supplier-quotation-list']);
      });
  }

  resetForm() {
    // this.priceQuotationService.initializeFormGroup();
    while ((<FormArray>this.priceQuotationService.formPriceQuatation.get('item')).length !== 0) {
      (<FormArray>this.priceQuotationService.formPriceQuatation.get('item')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

}
