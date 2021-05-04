import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BatchSizeService } from 'src/app/service/dli/reference/batch-size.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-batch-size-entry',
  templateUrl: './batch-size-entry.component.html',
  styles: []
})
export class BatchSizeEntryComponent implements OnInit {


  constructor(public service: BatchSizeService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<BatchSizeEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formBatchSize.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formBatchSize = this.fb.group({
      BatchSizeID: [0],
      BatchSize: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.BatchSizeID == 0)
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
