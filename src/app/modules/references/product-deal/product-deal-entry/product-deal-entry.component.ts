import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProductDealService } from 'src/app/service/references/product-deal.service';

@Component({
  selector: 'app-product-deal-entry',
  templateUrl: './product-deal-entry.component.html',
  styles: []
})
export class ProductDealEntryComponent implements OnInit {


  constructor(public service: ProductDealService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ProductDealEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formProductDeal.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formProductDeal = this.fb.group({
        ProductDealID : [0],
        ProductDeal : ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.ProductDealID == 0)
      this.service.insert(fg.value)
        .subscribe(
          (res: any) => {
            this.notificationService.success('Submitted successfully!');
          });
    else
      this.service.update(fg.value).subscribe(
        (res: any) => {
          this.notificationService.success('Updated successfully!');
        });
    this.onClose();

  }

}
