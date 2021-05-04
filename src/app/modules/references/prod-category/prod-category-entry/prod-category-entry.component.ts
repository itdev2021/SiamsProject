import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProdCategoryService } from 'src/app/service/references/prod-category.service';

@Component({
  selector: 'app-prod-category-entry',
  templateUrl: './prod-category-entry.component.html',
  styles: []
})
export class ProdCategoryEntryComponent implements OnInit {


  constructor(public service: ProdCategoryService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ProdCategoryEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formProdCategory.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formProdCategory = this.fb.group({
      CategoryID: [0],
      Code: [''],
      Category: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CategoryID == 0)
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
