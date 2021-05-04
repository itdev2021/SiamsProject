import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoryDLIService } from 'src/app/service/dli/reference/category-dli.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-category-dli-entry',
  templateUrl: './category-dli-entry.component.html',
  styles: []
})
export class CategoryDLIEntryComponent implements OnInit {


  constructor(public service: CategoryDLIService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CategoryDLIEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formCategoryDLI.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formCategoryDLI = this.fb.group({
      CategID: [0],
      Category: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CategID == 0)
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
