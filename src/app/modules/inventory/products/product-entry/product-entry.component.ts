import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ProductService } from 'src/app/service/inventory/product.service';
import { ProdClassService } from 'src/app/service/references/prod-class.service';
import { ProdCategoryService } from 'src/app/service/references/prod-category.service';
import { ProdPrepationService } from 'src/app/service/references/prod-prepation.service';
import { UmcService } from 'src/app/service/references/umc.service';
import { UomService } from 'src/app/service/references/uom.service';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { CostMethodService } from 'src/app/service/references/cost-method.service';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { GlobalService } from 'src/app/service/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-entry',
  templateUrl: './product-entry.component.html',
  styles: []
})
export class ProductEntryComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable: ElementRef;
  prodClassList;
  prodCategoryList;
  prodPreparationList;
  uMCList;
  uOMList;
  warehouseList;
  costMethodList;
  supplierList;
  accountTitleList;

  imageUrl: string = "../assets/img/default-image.png";
  fileToUpload: File = null;

  constructor(
    public service: ProductService,
    public serviceProdClass: ProdClassService,
    public serviceProdCat: ProdCategoryService,
    public serviceProdPrep: ProdPrepationService,
    public serviceUMC: UmcService,
    public serviceUOM: UomService,
    public serviceWarehouse: WarehouseService,
    public serviceCostMethod: CostMethodService,
    public serviceSupplierList: SupplierService,
    public serviceAccountTitleList: AccountTitleService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ProductEntryComponent>,
    public globalService: GlobalService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.serviceProdClass.getList().subscribe(data => { this.prodClassList = data });
    this.serviceProdCat.getList().subscribe(data => { this.prodCategoryList = data });
    this.serviceProdPrep.getList().subscribe(data => { this.prodPreparationList = data });
    this.serviceUMC.getList().subscribe(data => { this.uMCList = data });
    this.serviceUOM.getList().subscribe(data => { this.uOMList = data });
    this.serviceWarehouse.getWarehouseList().subscribe(data => { this.warehouseList = data });
    this.serviceCostMethod.getList().subscribe(data => { this.costMethodList = data });
    this.serviceSupplierList.getSupplierList().subscribe(data => { this.supplierList = data });
    this.serviceAccountTitleList.getAccountTitleList().subscribe(data => { this.accountTitleList = data });
  }

  // handleFIleInput(file: FileList) {
  //   this.fileToUpload = file.item(0);

  //   //show image preview
  //   var reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this.imageUrl = event.target.result;
  //   }
  //   reader.readAsDataURL(this.fileToUpload);
  // }

  onSubmit(fg: FormGroup) {
    if (fg.value.Product != '') {
      if (fg.value.ProductID == 0)
        this.service.insertProduct(fg.value)
          .subscribe(
            (res: any) => {
              this.notificationService.success(':: Submitted successfully');
            });
      else
        this.service.updateProduct(fg.value).subscribe(
          (res: any) => {
            this.notificationService.success(':: Updated successfully');
          });
      this.service.formProduct.reset();
      this.service.initializeFormGroup();
      this.onClose();
    }
  }

  onClear() {
    this.service.formProduct.reset();
    this.service.initializeFormGroup();
  }

  onClose() {
    this.service.formProduct.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();
  }

  changeClient(value) {
    console.log(value);
  }

  resetImage() {
    if (event) {
      this.myInputVariable.nativeElement.value = "";
      console.log(this.myInputVariable.nativeElement.value = "");
      this.imageUrl = "../assets/img/default-image.png";
    }
  }
}
