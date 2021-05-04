import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/service/accounting/business-unit-role/employee.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-employee-entry',
  templateUrl: './employee-entry.component.html',
  styles: []
})
export class EmployeeEntryComponent implements OnInit {


  constructor(public service: EmployeeService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<EmployeeEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onClose() {
    this.service.formEmployee.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formEmployee = this.fb.group({
      EmployeeID: [0],
      EmployeeCode: [''],
      LastName: [''],
      FirstName: [''],
      MiddleName: [''],
      Address: [''],
      PositionID: [''],
      DateHired: [''],
      Status: [1],
      RC: [new Date()],
      RCU: [0]

    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.EmployeeID == 0)
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
