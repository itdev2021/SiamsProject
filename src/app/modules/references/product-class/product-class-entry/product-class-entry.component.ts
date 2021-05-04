import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProdClassService } from 'src/app/service/references/prod-class.service';

@Component({
  selector: 'app-product-class-entry',
  templateUrl: './product-class-entry.component.html',
  styles: []
})
export class ProductClassEntryComponent implements OnInit {


  constructor(public service: ProdClassService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ProductClassEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formProductClass.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formProductClass = this.fb.group({
      ClassID: [0],
      Code: [''],
      Classification: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.ClassID == 0)
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
