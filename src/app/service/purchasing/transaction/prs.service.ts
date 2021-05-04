import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Validators, FormBuilder, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PrsService {

  constructor(private http: HttpClient,
    public fb: FormBuilder) { }

  formPRS = this.fb.group({
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
    items: this.fb.array([

    ])
  });

  saveOrUpdate() {
    var body = {
      ...this.formPRS.value,
      PRSDetails: this.formPRS.get('items').value
    };
    return this.http.post(environment.apiURL + '/PRS', body);
  }

  updateStatus(id: number, url) {
    return this.http.put(environment.apiURL + url + id, '');
  }

  getList() {
    return this.http.get(environment.apiURL + '/PRS');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/PRS/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/PRS/' + id);
  }

  getInfo(id){
    this.getByID(parseInt(id)).subscribe(res => {
      console.log(res.prs.PRSNo);
      this.formPRS.patchValue({
        PRSID: res.prs.PRSID,
        DatePrepared: res.prs.DatePrepared,
        DateRequired: res.prs.DateRequired,
        PRSNo: res.prs.PRSNo,
        DeptID: res.prs.DeptID,
        Remarks: res.prs.Remarks,
        IsApproved: res.prs.IsApproved,
        IsPrinted: res.prs.IsPrinted,
        PrintFormatID: res.prs.PrintFormatID,
        ApproveBy: res.prs.ApproveBy
      });
      this.formPRS.setControl('items', this.setExistingItems(res.prsDetails));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        pkid: i.pkid,
        PRSID: i.PRSID,
        Rownum: i.Rownum,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOMDescription: i.UOMDescription,
        Quantity: i.Quantity
      }))
    });
    return formArray;
  }


}
