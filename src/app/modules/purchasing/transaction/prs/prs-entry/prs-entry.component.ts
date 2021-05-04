import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentService } from 'src/app/service/references/department.service';
import { PrsService } from 'src/app/service/purchasing/transaction/prs.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ItemsLookupComponent } from 'src/app/modules/lookup/items-lookup/items-lookup.component';

@Component({
  selector: 'app-prs-entry',
  templateUrl: './prs-entry.component.html',
  styles: []
})
export class PrsEntryComponent implements OnInit {

  departmentList = [];
  deletedIDs = "";

  constructor(public departmentService: DepartmentService,
    private dialog: MatDialog,
    private router: Router,
    private currentRoute: ActivatedRoute,
    public serviceNotification: NotificationService,
    public service: PrsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PrsEntryComponent>,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.departmentService.getList().subscribe(res => this.departmentList = res as []);
  }
  
  onBlurAutoComplete(value) {
    if (value > 0)
      this.service.formPRS.controls.PRSNo.patchValue(this.globalService.padLeft(value, '0', 10));
    else
      this.service.formPRS.controls.PRSNo.patchValue('');
  }

  AddorEditOrderItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.data = "PRS";
    this.dialog.open(ItemsLookupComponent, dialogConfig).afterClosed().subscribe(res => {

    });
  }

  ondeleteOrderItem(ProductID: number, i: number) {
    if (ProductID != null) {
      this.deletedIDs += ProductID + ",";
      this.service.formPRS.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formPRS.get('items')).removeAt(i);
  }

  onSubmit(fg: FormGroup) {
    this.service.saveOrUpdate()
      .subscribe(res => {
        this.serviceNotification.success('Submitted successfully!');
        this.resetForm();
        this.onClose();
      });
  }
  
  onClose(){
    this.resetForm();
    this.dialogRef.close()
  }

  onPrintDoc(fg: FormGroup){

  }

  resetForm() {
    this.service.formPRS.reset();
    this.service.formPRS = this.fb.group({
      PRSID: [0],
      DatePrepared: ['', Validators.required],
      DateRequired: ['', Validators.required],
      PRSNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      DeptID: ['', Validators.required],
      Remarks: [''],
      IsApproved: [-1],
      IsPrinted: [0],
      PrintFormatID: [0],
      ApproveBy: [0],
      RC: [new Date()],
      RCU: [0],
      DeleteIDs: [''],
      items: this.fb.array([])
    });
    while ((<FormArray>this.service.formPRS.get('items')).length !== 0) {
      (<FormArray>this.service.formPRS.get('items')).removeAt(0)
    }
  }

  changeClient(value) {
    console.log(value);
  }

}

