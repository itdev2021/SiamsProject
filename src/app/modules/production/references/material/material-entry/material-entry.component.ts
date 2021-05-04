import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { NotificationService } from 'src/app/service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-material-entry',
  templateUrl: './material-entry.component.html',
  styles: []
})
export class MaterialEntryComponent implements OnInit {

  constructor(public serviceSupplier: SupplierService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<MaterialEntryComponent>) { }

  ngOnInit(): void {
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
