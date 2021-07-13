import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BeginningBalanceService {
  totalAmount = '0';
  constructor(private http: HttpClient,
    public fb: FormBuilder) { }

  formBB = this.fb.group({
    BBID: [0],
    WarehouseID_To: [0],
    DateEntry: ['', Validators.required],
    Remarks: [''],
    Amount: [0, Validators.required],
    Status: [-1],
    IsPrinted: [0],
    RC: [new Date()],
    RCU: [0],
    DeleteIDs: [''],
    items: this.fb.array([])
  })

  saveOrUpdate() {
    var body = {
      ...this.formBB.value,
      BBD: this.formBB.get('items').value
    }
    return this.http.post(environment.apiURL + '/BB', body);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  getList() {
    return this.http.get(environment.apiURL + '/BB');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/BB/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/BB/' + id);
  }

  getItemRow(row) {
    (<FormArray>this.formBB.get('items')).push(
      this.fb.group({
        BBDID: [0],
        BBID: [0],
        ProductCode: [row.ProductCode],
        ProductID: [row.ProductID],
        Product: [row.Product],
        UOMID: [row.UOMID],
        UOMDescription: [row.UOMDescription],
        Quantity: [1, Validators.required],
        UnitCost: [row.BuyPrice, Validators.required],
        Amount: [0],
        LotNo: ['', Validators.required],
        ExpiryDate: ['', Validators.required],
        ManufacturingDate: ['', Validators.required],
        Particulars: [''],
        ControlNo: ['']
      })
    );
  }

  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formBB.patchValue({
        BBID: res.bb.BBID,
        WarehouseID_To: res.bb.WarehouseID_To,
        DateEntry: res.bb.DateEntry,
        Remarks: res.bb.Remarks,
        Amount: res.bb.Amount
      });
      this.totalAmount = res.bb.TotalAmt,
        this.formBB.setControl('items', this.setExistingItems(res.bbd));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        BBDID: i.BBDID,
        BBID: i.BBID,
        ProductCode: i.ProductCode,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOMDescription: i.UOMDescription,
        Quantity: i.Quantity,
        UnitCost: i.UnitCost,
        Amount: i.Amount,
        LotNo: i.LotNo,
        ExpiryDate: i.ExpiryDate,
        ManufacturingDate: i.ManufacturingDate,
        Particulars: i.Particulars,
        ControlNo: i.ControlNo

      }))
    });
    return formArray;
  }

  // PurchasePrintInfo Controller
  getPrintInfoByID(id): any {
    return this.http.get(environment.apiURL + '/WRPrintInfo/' + id);
  }

  updatePrint(frmWR) {
    return this.http.post(environment.apiURL + '/WRPrintInfo', frmWR);
  }


}
