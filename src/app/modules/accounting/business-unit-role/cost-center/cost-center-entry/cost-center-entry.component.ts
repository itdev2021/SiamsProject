import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CostCenterService } from 'src/app/service/accounting/business-unit-role/cost-center.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-cost-center-entry',
  templateUrl: './cost-center-entry.component.html',
  styles: []
})
export class CostCenterEntryComponent implements OnInit {


  constructor(public service: CostCenterService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CostCenterEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onClose() {
    this.service.formCostCenter.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formCostCenter = this.fb.group({
      CostCenterID: [0],
      CostCenter: [''],
      RC: [new Date()],
      RCU: [0]

    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CostCenterID == 0)
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
