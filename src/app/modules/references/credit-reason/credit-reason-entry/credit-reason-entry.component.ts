import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CreditReasonService } from 'src/app/service/references/credit-reason.service';

@Component({
  selector: 'app-credit-reason-entry',
  templateUrl: './credit-reason-entry.component.html',
  styles: []
})
export class CreditReasonEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: CreditReasonService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreditReasonEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    }

  onClose() {
    this.service.formCreditReason.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formCreditReason = this.fb.group({
        CreditReasonID : [0],
        Reason : ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CreditReasonID == 0)
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
