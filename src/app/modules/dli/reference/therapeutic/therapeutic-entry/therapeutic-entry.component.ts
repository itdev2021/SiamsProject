import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TherapeuticService } from 'src/app/service/dli/reference/therapeutic.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-therapeutic-entry',
  templateUrl: './therapeutic-entry.component.html',
  styles: []
})
export class TherapeuticEntryComponent implements OnInit {


  constructor(public service: TherapeuticService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<TherapeuticEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formTherapeutic.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formTherapeutic = this.fb.group({
      TherapeuticID: [0],
      Description: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.TherapeuticID == 0)
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
