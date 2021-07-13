import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { VatNonVatService } from 'src/app/service/references/vatnonvat.service';

@Component({
  selector: 'app-vat-nonvat-entry',
  templateUrl: './vat-nonvat-entry.component.html',
  styles: []
})
export class VatNonVatEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: VatNonVatService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<VatNonVatEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    }

  onClose() {
    this.service.formVatNonVat.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formVatNonVat = this.fb.group({
        VatNonVatID : [0],
        VatNonVat : ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.VatNonVatID == 0)
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
