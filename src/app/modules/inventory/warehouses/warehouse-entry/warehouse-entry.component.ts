import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WarehouseService } from 'src/app/service/references/warehouse.service';
import { NotificationService } from 'src/app/service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from 'src/app/service/global.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-warehouse-entry',
  templateUrl: './warehouse-entry.component.html',
  styles: []
})
export class WarehouseEntryComponent implements OnInit {

  constructor(public serviceWarehouse: WarehouseService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<WarehouseEntryComponent>,
    public globalService: GlobalService,
    private router: Router) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.WareHouse != '') {
      if (fg.value.WareHouseID == 0)
        this.serviceWarehouse.insertWarehouse(fg.value)
          .subscribe(
            (res: any) => {
              this.notificationService.success('Submitted successfully!');
            });
      else
        this.serviceWarehouse.updateWarehouse(fg.value).subscribe(
          (res: any) => {
            this.notificationService.success('Updated successfully!');
          });
      this.onClose();
    }
  }

  onClear() {
    this.serviceWarehouse.formWarehouse.reset();
    this.serviceWarehouse.initializeFormGroup();
  }

  onClose() {
    this.serviceWarehouse.formWarehouse.reset();
    this.serviceWarehouse.initializeFormGroup();
    this.dialogRef.close();;
  }

}
