import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { RefDataService } from 'src/app/service/references/ref-data.service';

@Component({
  selector: 'app-ref-data-entry',
  templateUrl: './ref-data-entry.component.html',
  styles: []
})
export class RefDataEntryComponent implements OnInit {


  constructor(public service: RefDataService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<RefDataEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formRefData.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formRefData = this.fb.group({
        id: [0],
        refData: [''],
        refCode: [''],
        refText: [''],
        Status: [1],
        RC: [new Date()],
        RCU: [0]
     
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.id == 0)
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
