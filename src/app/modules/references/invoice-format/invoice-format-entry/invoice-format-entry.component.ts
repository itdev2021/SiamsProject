import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { InvoiceFormatService } from 'src/app/service/references/invoice-format.service';

@Component({
  selector: 'app-invoice-format-entry',
  templateUrl: './invoice-format-entry.component.html',
  styles: []
})
export class InvoiceFormatEntryComponent implements OnInit {

  constructor(public service: InvoiceFormatService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<InvoiceFormatEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formInvoiceFormat.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formInvoiceFormat = this.fb.group({
      InvoiceFormatID : [0],
      descriptions : [''],
      Status : [true],
      TransactionType : [''],
      Lines : ['']
     
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.InvoiceFormatID == 0)
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
