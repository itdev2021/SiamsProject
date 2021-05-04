import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WarehouseReceivingService {
  totalAmount='0';
  constructor(private http: HttpClient,
    public fb: FormBuilder) { }

  formWR = this.fb.group({
    WRID: [0],
    WarehouseID_From: [0],
    WarehouseID_To: [0],
    ReceivingDate: ['', Validators.required],
    Remarks: [''],
    ReferenceNo: ['', Validators.required],
    Amount: [0, Validators.required],
    Status: [-1],
    IsPrinted: [0],
    WithdrawalSlipID: [0],
    ClientCode: [''],
    AssayDate: ['0001-01-01'],
    SupplierID: [1],
    SINo: [''],
    DRNo: [''],
    ImportFlag: [0],
    JournalType: [0],
    RC: [new Date()],
    RCU: [0],
    DeleteIDs: [''],
    items: this.fb.array([])
  })

  saveOrUpdate() {
    var body = {
      ...this.formWR.value,
      WRD: this.formWR.get('items').value
    }
    return this.http.post(environment.apiURL + '/wr', body);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  getList() {
    return this.http.get(environment.apiURL + '/wr');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/wr/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/wr/' + id);
  }


  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formWR.patchValue({
        WRID: res.wr.WRID,
        WarehouseID_From: res.wr.WarehouseID_From,
        WarehouseID_To: res.wr.WarehouseID_To,
        ReceivingDate: res.wr.ReceivingDate,
        Remarks: res.wr.Remarks,
        ReferenceNo: res.wr.ReferenceNo,
        Amount: res.wr.Amount,
        ClientCode: res.wr.ClientCode,
        AssayDate: res.wr.AssayDate,
        SupplierID: res.wr.SupplierID,
        SINo: res.wr.SINo,
        DRNo: res.wr.DRNo
      });
      this.totalAmount=res.wr.TotalAmt,
      this.formWR.setControl('items', this.setExistingItems(res.wrd));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        WRDID: i.WRDID,
        WRID: i.WRID,
        Code:i.ProductCode,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOMDescription:i.UOMDescription,
        Quantity: i.Quantity,
        UnitCost: i.UnitCost,
        Amount: i.Amount,
        LotNo: i.LotNo,
        ExpiryDate: i.ExpiryDate,
        ManufacturingDate: i.ManufacturingDate,
        Particulars: i.Particulars,
        SampleTaken: i.SampleTaken,
        SPG: i.SPG,
        ControlNo: i.ControlNo,
        AccountTitleIDDebit: i.AccountTitleIDDebit,
        AccountTitleIDCredit: i.AccountTitleIDCredit

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
