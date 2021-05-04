import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { CheckTypeService } from 'src/app/service/accounting/check-type.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PriceListService } from 'src/app/service/references/price-list.service';

@Component({
  selector: 'app-price-list-entry',
  templateUrl: './price-list-entry.component.html',
  styles: []
})
export class PriceListEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: PriceListService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<PriceListEntryComponent>,
    private fb : FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formPriceList.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm(){
    this.service.formPriceList = this.fb.group({
      PriceListID : [0],
      Descriptions : [''],
      DateEntry : [new Date()],
      ReservedBoolean : [true],
      RC : [new Date()],
      RCU : [0],
     
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.PriceListID == 0)
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
