import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UomService } from 'src/app/service/references/uom.service';

@Component({
  selector: 'app-uom-entry',
  templateUrl: './uom-entry.component.html',
  styles: []
})
export class UOMEntryComponent implements OnInit {


  constructor(public service: UomService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<UOMEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formUOM.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formUOM = this.fb.group({
      UOMID: [0],
      Code: [''],
      UOMDescription: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.UOMID == 0)
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
