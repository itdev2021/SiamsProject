import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CROService } from 'src/app/service/references/cro.service';

@Component({
  selector: 'app-cro-entry',
  templateUrl: './cro-entry.component.html',
  styles: []
})
export class CROEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: CROService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CROEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    }

  onClose() {
    this.service.formCRO.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formCRO = this.fb.group({
        CROID : [0],
        CRO : ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CROID == 0)
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
