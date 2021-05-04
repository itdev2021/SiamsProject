import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { CheckTypeService } from 'src/app/service/accounting/check-type.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { DiscountSchemeService } from 'src/app/service/references/discount-scheme.service';

@Component({
  selector: 'app-discount-scheme-entry',
  templateUrl: './discount-scheme-entry.component.html',
  styles: []
})
export class DiscountSchemeEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: DiscountSchemeService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DiscountSchemeEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formDiscountScheme.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formDiscountScheme = this.fb.group({
      DiscountSchemeID : [0],
      DiscountScheme : [''],
      DateFrom : [''],
      DateTo : [''],
      Status : [1],
      RC : [new Date()],
      RCU : [0]
     
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.DiscountSchemeID == 0)
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
