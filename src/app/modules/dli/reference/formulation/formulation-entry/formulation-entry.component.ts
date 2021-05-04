import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormulationService } from 'src/app/service/dli/reference/formulation.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-formulation-entry',
  templateUrl: './formulation-entry.component.html',
  styles: []
})
export class FormulationEntryComponent implements OnInit {


  constructor(public service: FormulationService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<FormulationEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formFormulation.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formFormulation = this.fb.group({
      FormulationID: [0],
      Formulation: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.FormulationID == 0)
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
