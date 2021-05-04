import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CurrencyService } from 'src/app/service/references/currency.service';

@Component({
  selector: 'app-currency-entry',
  templateUrl: './currency-entry.component.html',
  styles: []
})
export class CurrencyEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: CurrencyService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CurrencyEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formCurrency.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formCurrency = this.fb.group({
      currency_id : [0],
      currency_name : [''],
      currency_code : [''],
      Actve : [true],
      Sysmbols : [''],
      RC : [new Date()],
      RCU : [0]
     
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.currency_id == 0)
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
