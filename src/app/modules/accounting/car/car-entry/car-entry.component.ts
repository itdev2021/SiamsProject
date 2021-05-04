import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CarService } from 'src/app/service/accounting/car.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-car-entry',
  templateUrl: './car-entry.component.html',
  styles: []
})
export class CarEntryComponent implements OnInit {

  constructor(public service: CarService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CarEntryComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.service.formCar.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();;
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.CarListID == 0)
      this.service.insertCar(fg.value)
        .subscribe(
          (res: any) => {
            this.notificationService.success('Submitted successfully!');
          });
    else
      this.service.updateCar(fg.value).subscribe(
        (res: any) => {
          this.notificationService.success('Updated successfully!');
        });
    this.onClose();

  }

}
