import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PoliticalMapService } from 'src/app/service/references/political-map.service';

@Component({
  selector: 'app-political-map-entry',
  templateUrl: './political-map-entry.component.html',
  styles: []
})
export class PoliticalMapEntryComponent implements OnInit {


  constructor(public service: PoliticalMapService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<PoliticalMapEntryComponent>,
    private fb: FormBuilder ) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
  }

  onClose() {
    this.service.formPoliticalMap.reset();
    this.resetForm();
    this.dialogRef.close();;
  }
  
  resetForm(){
      this.service.formPoliticalMap = this.fb.group({
        PoliticalMapID : [0],
        Region: [''],
        Designation: [''],
        CenterCapital: [''],
        Provinces: [''],
        Capital: [''],
        Municipalities: [''],
        City: [''],
        Barangay: [''],
        ZipCode: ['']
    });
  }

  onSubmit(fg: FormGroup) {
    if (fg.value.PoliticalMapID == 0)
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
