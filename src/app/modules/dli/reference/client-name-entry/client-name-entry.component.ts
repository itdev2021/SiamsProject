import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientNameService } from 'src/app/service/dli/reference/client-name.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-client-name-entry',
  templateUrl: './client-name-entry.component.html',
  styles: []
})
export class ClientNameEntryComponent implements OnInit {


  constructor(public service: ClientNameService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ClientNameEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    }

  onClose() {
    this.service.formClientName.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formClientName = this.fb.group({
        ClientID: [0],
        ClientName: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.ClientID == 0)
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
