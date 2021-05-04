import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ProdPrepationService } from 'src/app/service/references/prod-prepation.service';

@Component({
  selector: 'app-prod-preparation-entry',
  templateUrl: './prod-preparation-entry.component.html',
  styles: []
})
export class ProdPreparationEntryComponent implements OnInit {


  constructor(public service: ProdPrepationService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ProdPreparationEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formProdPreparation.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formProdPreparation = this.fb.group({
      PreparationID: [0],
      Code: [''],
      Preparation: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.PreparationID == 0)
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
