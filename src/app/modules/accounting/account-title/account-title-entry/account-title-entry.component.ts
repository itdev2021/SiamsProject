import { Component, OnInit } from '@angular/core';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-account-title-entry',
  templateUrl: './account-title-entry.component.html',
  styles: []
})
export class AccountTitleEntryComponent implements OnInit {

  constructor(public service: AccountTitleService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<AccountTitleEntryComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.service.formAccountTitle.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();;
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.AccountTitleID == 0)
      this.service.insertAccount(fg.value)
        .subscribe(
          (res: any) => {
            this.notificationService.success('Submitted successfully!');
          });
    else
      this.service.updateAccount(fg.value).subscribe(
        (res: any) => {
          this.notificationService.success('Updated successfully!');
        });
    this.onClose();

  }

}
