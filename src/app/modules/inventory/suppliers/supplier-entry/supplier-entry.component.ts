import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { NotificationService } from 'src/app/service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/service/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-entry',
  templateUrl: './supplier-entry.component.html',
  styles: []
})
export class SupplierEntryComponent implements OnInit {

  constructor(public serviceSupplier: SupplierService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<SupplierEntryComponent>,
    public globalService: GlobalService,
    private router: Router) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
  }

  onSubmit(fg: FormGroup) {
    
    if (fg.value.WareHouse != '') {
      if (fg.value.SupplierID == 0)
        this.serviceSupplier.insertSupplier(fg.value)
          .subscribe(
            (res: any) => {
              this.notificationService.success('Submitted successfully!');
            });
      else
        this.serviceSupplier.updateSupplier(fg.value).subscribe(
          (res: any) => {
            this.notificationService.success('Updated successfully!');
          });
      this.onClose();
    }
  }

  onClear() {
    this.serviceSupplier.formSupplier.reset();
    this.serviceSupplier.initializeFormGroup();
  }

  onClose() {
    this.serviceSupplier.formSupplier.reset();
    this.serviceSupplier.initializeFormGroup();
    this.dialogRef.close();;
  }

  changeClient(value) {
    console.log(value);
  }

}
