import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClassificationDLIService } from 'src/app/service/dli/reference/classificationDLI.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-classification-dli-entry',
  templateUrl: './classification-dli-entry.component.html',
  styles: []
})
export class ClassificationDLIEntryComponent implements OnInit {


  constructor(public service: ClassificationDLIService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ClassificationDLIEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formClassDLI.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formClassDLI = this.fb.group({
      ClassID: [0],
      Classification: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.ClassID == 0)
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
