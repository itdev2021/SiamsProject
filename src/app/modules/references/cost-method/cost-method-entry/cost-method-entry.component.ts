import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CostMethodService } from 'src/app/service/references/cost-method.service';

@Component({
  selector: 'app-cost-method-entry',
  templateUrl: './cost-method-entry.component.html',
  styles: []
})
export class CostMethodEntryComponent implements OnInit {

  checkList = [];
  accountTitleList = [];

  constructor(public service: CostMethodService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CostMethodEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formCostMethod.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formCostMethod = this.fb.group({
        CostMethodID : [0],
        CostMethod : ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CostMethodID == 0)
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
