import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WeightClaimService } from 'src/app/service/dli/reference/weight-claim.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-weight-claim-entry',
  templateUrl: './weight-claim-entry.component.html',
  styles: []
})
export class WeightClaimEntryComponent implements OnInit {


  constructor(public service: WeightClaimService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<WeightClaimEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formWeightClaim.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formWeightClaim = this.fb.group({
      WeightClaimID: [0],
      WeightClaim: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.WeightClaimID == 0)
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
