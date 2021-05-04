import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AssetLifeService } from 'src/app/service/accounting/asset-life.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-asset-life-entry',
  templateUrl: './asset-life-entry.component.html',
  styles: []
})
export class AssetLifeEntryComponent implements OnInit {


  constructor(public service: AssetLifeService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<AssetLifeEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onClose() {
    this.service.formAssetLife.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formAssetLife = this.fb.group({
      AssetLifeID: [0],
      AssetLife: [''],
      AccountDescription: [''],
      DebitAccount: [''],
      CreditAccount: [''],
      RC: [new Date()],
      RCU: [0]

    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.AssetLifeID == 0)
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
