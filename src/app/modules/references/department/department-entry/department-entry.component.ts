import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DepartmentService } from 'src/app/service/references/department.service';

@Component({
  selector: 'app-department-entry',
  templateUrl: './department-entry.component.html',
  styles: []
})
export class DepartmentEntryComponent implements OnInit {


  constructor(public service: DepartmentService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DepartmentEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formDepartment.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formDepartment = this.fb.group({
        DeptID : [0],
        Department : [''],
        DeptAbbr : ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.DeptID == 0)
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
