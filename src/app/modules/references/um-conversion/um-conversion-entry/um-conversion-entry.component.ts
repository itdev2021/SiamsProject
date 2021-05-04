import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ItemsLookupexComponent } from 'src/app/modules/lookup/item-lookupex/items-lookupex.component';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UmcService } from 'src/app/service/references/umc.service';
import { UomService } from 'src/app/service/references/uom.service';

@Component({
  selector: 'app-um-conversion-entry',
  templateUrl: './um-conversion-entry.component.html',
  styles: []
})
export class UMConversionEntryComponent implements OnInit {
  uomlist = [];
  deletedIDs = "";

  constructor(public service: UmcService,
    private dialog: MatDialog,
    public UomService: UomService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<UMConversionEntryComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    this.UomService.getList().subscribe(res => this.uomlist = res as []);
  }

  onClose() {
    this.service.formUMConversion.reset();
    this.resetForm();
    this.dialogRef.close();;
  }

  resetForm() {
    this.service.formUMConversion = this.fb.group({
      ProductCode: [''],
      ProductDesc: [''],
      DeleteIDs: [''],
      items: this.fb.array([])
    });
    while ((<FormArray>this.service.formUMConversion.get('items')).length !== 0) {
      (<FormArray>this.service.formUMConversion.get('items')).removeAt(0)
    }
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "UMC";
    this.dialog.open(ItemsLookupexComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(item, i: number) {
    if (this.service.formUMConversion.value.ProductCode != null) {
      this.deletedIDs += item.value.UMID + ",";
      this.service.formUMConversion.patchValue({
        DeleteIDs: this.deletedIDs
      });
      
    }
    (<FormArray>this.service.formUMConversion.get('items')).removeAt(i);


  }

  onAdd() {
    this.service.getItemRow();
  }

  changeClient(value) {
    console.log(value);
  }

  onSubmit(fg: FormGroup) {
    if (fg.valid) {
      this.service.saveOrUpdate()
        .subscribe(res => {
          this.notificationService.success('Submitted successfully!');
          this.resetForm();
          this.onClose();
        });
    }
    else
      this.notificationService.warn('Make it sure all mandatory fields are filled up!');
  }
  // onSubmit(fg: FormGroup) {
  //   if (fg.value.UMID == 0)
  //     this.service.insert()
  //       .subscribe(
  //         (res: any) => {
  //           this.notificationService.success('Submitted successfully!');
  //         });
  //   else
  //     this.service.update(fg.value).subscribe(
  //       (res: any) => {
  //         this.notificationService.success('Updated successfully!');
  //       });
  //   this.onClose();
  //   // console.log(fg.value);
  // }

}
