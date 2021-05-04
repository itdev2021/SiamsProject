import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GroupNameService } from 'src/app/service/dli/reference/group-name.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-group-name-entry',
  templateUrl: './group-name-entry.component.html',
  styles: []
})
export class GroupNameEntryComponent implements OnInit {


  constructor(public service: GroupNameService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<GroupNameEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    }

  onClose() {
    this.service.formGroupName.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formGroupName = this.fb.group({
        GroupID: [0],
        GroupName: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.GroupID == 0)
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
