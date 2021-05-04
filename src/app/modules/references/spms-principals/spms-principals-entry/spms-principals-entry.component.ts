import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SPMSPrincipalsService } from 'src/app/service/references/principals.service';

@Component({
  selector: 'app-spms-principals-entry',
  templateUrl: './spms-principals-entry.component.html',
  styles: []
})
export class SPMSPrincipalsEntryComponent implements OnInit {


  constructor(public service: SPMSPrincipalsService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<SPMSPrincipalsEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formSPMSPrincipals.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formSPMSPrincipals = this.fb.group({
      SPMSPrincipalsID: [0],
      CompanyCode: [''],
      CompanyName: [''],
      RC: [new Date()],
      RCU: [0]

    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.SPMSPrincipalsID == 0)
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
