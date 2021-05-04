import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShelfLifeService } from 'src/app/service/dli/reference/shelf-life.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-shelf-life-entry',
  templateUrl: './shelf-life-entry.component.html',
  styles: []
})
export class ShelfLifeEntryComponent implements OnInit {


  constructor(public service: ShelfLifeService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ShelfLifeEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formShelfLife.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formShelfLife = this.fb.group({
      ShelfLifeID: [0],
      ShelfLife: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.ShelfLifeID == 0)
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
