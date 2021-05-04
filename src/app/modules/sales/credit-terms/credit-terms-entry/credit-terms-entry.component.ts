import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { CheckTypeService } from 'src/app/service/accounting/check-type.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CreditTermsService } from 'src/app/service/references/credit-terms.service';

@Component({
  selector: 'app-credit-terms-entry',
  templateUrl: './credit-terms-entry.component.html',
  styles: []
})
export class CreditTermsEntryComponent implements OnInit {


  constructor(public service: CreditTermsService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CreditTermsEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onClose() {
    this.service.formCreditTerms.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();;
  }
  resetForm() {
    this.service.formCreditTerms = this.fb.group({
      CreditTermsID: [0],
      CreditTerms: ['', Validators.required],
      Days: [0],
      RC: [new Date()],
      RCU: [0],
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CreditTermsID == 0)
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
