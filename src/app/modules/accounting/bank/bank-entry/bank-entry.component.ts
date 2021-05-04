import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { BankService } from 'src/app/service/accounting/bank.service';
import { CheckTypeService } from 'src/app/service/accounting/check-type.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-bank-entry',
  templateUrl: './bank-entry.component.html',
  styles: []
})
export class BankEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: BankService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<BankEntryComponent>,
    public checkTypeService: CheckTypeService,
    public accountTitleService: AccountTitleService) { }

  ngOnInit(): void {
    this.checkTypeService.getCheckTypeList().subscribe(res => this.checkList = res as []);
    this.accountTitleService.getAccountTitleList().subscribe(res => this.accountTitleList = res as []);
  }

  onClose() {
    this.service.formBank.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();;
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.BankID == 0)
      this.service.insertBank(fg.value)
        .subscribe(
          (res: any) => {
            this.notificationService.success('Submitted successfully!');
          });
    else
      this.service.updateBank(fg.value).subscribe(
        (res: any) => {
          this.notificationService.success('Updated successfully!');
        });
    this.onClose();

  }

}
