import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DesignationService } from 'src/app/service/inventory/designation.service';

@Component({
  selector: 'app-designation-entry',
  templateUrl: './designation-entry.component.html',
  styles: []
})
export class DesignationEntryComponent implements OnInit {

  constructor(public serviceDesignation: DesignationService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DesignationEntryComponent>) { }

  ngOnInit(): void {
  }

  onSubmit(fg: FormGroup) {
    console.log(fg.value);
    if (fg.value.Designtion != '') {
      if (fg.value.DesignationID == 0)
        this.serviceDesignation.insertDesignation(fg.value)
          .subscribe(
            (res: any) => {
              this.notificationService.success('Submitted successfully!');
            });
      else
        this.serviceDesignation.updateDesignation(fg.value).subscribe(
          (res: any) => {
            this.notificationService.success('Updated successfully!');
          });
      this.onClose();
    }
  }

  onClear() {
    this.serviceDesignation.formDesignation.reset();
    this.serviceDesignation.initializeFormGroup();
  }

  onClose() {
    this.serviceDesignation.formDesignation.reset();
    this.serviceDesignation.initializeFormGroup();
    this.dialogRef.close();;
  }

}
