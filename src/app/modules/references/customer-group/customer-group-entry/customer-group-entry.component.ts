import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CustomerGroupService } from 'src/app/service/references/customer-group.service';

@Component({
  selector: 'app-customer-group-entry',
  templateUrl: './customer-group-entry.component.html',
  styles: []
})
export class CustomerGroupEntryComponent implements OnInit {


  constructor(public service: CustomerGroupService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CustomerGroupEntryComponent>,
    private fb: FormBuilder  ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formCustomerGroup.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formCustomerGroup = this.fb.group({
        CustomerGroupID : [0],
        CustomerGroupCode : [''],
        CustomerGroupName : [''],
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CustomerGroupID == 0)
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
