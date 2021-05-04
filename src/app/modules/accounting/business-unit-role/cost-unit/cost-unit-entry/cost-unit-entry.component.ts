import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { CostUnitService } from 'src/app/service/lookup/cost-unit.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-cost-unit-entry',
  templateUrl: './cost-unit-entry.component.html',
  styles: []
})
export class CostUnitEntryComponent implements OnInit {


  constructor(public service: CostUnitService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CostUnitEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onClose() {
    this.service.formCostUnit.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formCostUnit = this.fb.group({
      CostUnitID: [0],
      CostUnit: [''],
      EmployeeID: [''],
      EmployeeName: [''],
      CostCenterID: [''],
      CostCenter: [''],
      DivisionID: [''],
      Division: [''],
      RC: [new Date()],
      RCU: [0]

    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CostUnitID == 0)
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
