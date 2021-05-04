import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { EntryTypeService } from 'src/app/service/references/entry-type.service';

@Component({
  selector: 'app-entry-type-entry',
  templateUrl: './entry-type-entry.component.html',
  styles: []
})
export class EntryTypeEntryComponent implements OnInit {


  constructor(public service: EntryTypeService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<EntryTypeEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formEntryType.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formEntryType = this.fb.group({
        EntryTypeID : [0],
        Description : ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.EntryTypeID == 0)
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
