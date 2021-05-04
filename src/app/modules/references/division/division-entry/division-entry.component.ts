import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DivisionService } from 'src/app/service/references/division.service';

@Component({
  selector: 'app-division-entry',
  templateUrl: './division-entry.component.html',
  styles: []
})
export class DivisionEntryComponent implements OnInit {


  constructor(public service: DivisionService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DivisionEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formDivision.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formDivision = this.fb.group({
      DivisionID: [0],
      Division: [''],
      RC: [new Date()],
      RCU: [0]
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.DivisionID == 0)
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
