import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { DeliveredToService } from '../../lookup/delivered-to.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  totalAmount='0';
  constructor(private http: HttpClient,
    public fb: FormBuilder,
    private deliveredService:DeliveredToService) { }

  formPO = this.fb.group({
    PurchaseOrderID: [0],
    SupplierID: ['', Validators.required],
    Supplier:[''],
    PurchaseDate: ['', Validators.required],
    PONumber: ['', Validators.required],
    Amount: [0],
    Status: [-1],
    IsPrinted: [0],
    PRSNumber: [''],
    CreditTermsID: ['', Validators.required],
    Days: [0],
    Currency_ID: ['', Validators.required],
    POTypeID: [0],
    Remarks: [''],

    RC: [new Date()],
    RCU: [0],
    DeleteIDs: [''],
    items: this.fb.array([])
  })

  getPatchDelivered(row) {
    console.log(row);
    return this.formPO.patchValue({
      SupplierID: row.PayToID,
      Supplier: row.PayTo
    });
  }

  saveOrUpdate() {
    var body = {
      ...this.formPO.value,
      PurchaseOrderDetail: this.formPO.get('items').value
    }
    return this.http.post(environment.apiURL + '/PurchaseOrder', body);
  }

  // updateStatus(id){
  //   return this.http.get(environment.apiURL + '/PurchaseOrder/update/' + id);
  // }

  getList() {
    return this.http.get(environment.apiURL + '/PurchaseOrder');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/PurchaseOrder/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/PurchaseOrder/' + id);
  }

  updateStatus(id: number, url, data) {
    return this.http.put(environment.apiURL + url + id, data);
  }

  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formPO.patchValue({
        PurchaseOrderID: res.po.PurchaseOrderID,
        SupplierID: res.po.SupplierID,
        PurchaseDate: res.po.PurchaseDate,
        PONumber: res.po.PONumber,
        Amount: res.po.Amount,
        Status: res.po.Status,
        IsPrinted: res.po.IsPrinted,
        PRSNumber: res.po.PRSNumber,
        CreditTermsID: res.po.CreditTermsID,
        Days: res.po.Days,
        Currency_ID: res.po.Currency_ID,
        POTypeID: res.po.POTypeID,
        Remarks: res.po.Remarks
      });
      this.deliveredService.getList().subscribe(item => {
        const listArray = [...item.supplier, ...item.customer, ...item.employee];
        this.formPO.patchValue({
          Supplier: listArray.filter(x => x.PayToID == res.po.SupplierID)[0].PayTo
        });
      });
      this.totalAmount=res.po.Amount;
      this.formPO.setControl('items', this.setExistingItems(res.poDetails));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        PurchaseOrderDetailID: i.PurchaseOrderDetailID,
        PurchaseOrderID: i.PurchaseOrderID,
        Code: i.Code,
        ProductID: i.ProductID,
        Product: i.Product,
        UOMID: i.UOMID,
        UOMDescription: i.UOMDescription,
        Quantity: i.Quantity,
        UnitCost: i.UnitCost,
        Amount: i.Amount,
        Particulars: i.Particulars
      }))
    });
    return formArray;
  }

  // PurchasePrintInfor Controller
  getPrintInfoByID(id): any {
    return this.http.get(environment.apiURL + '/PurchasePrintInfo/' + id);
  }
  updatePrint(frmPO) {
    return this.http.post(environment.apiURL + '/PurchasePrintInfo', frmPO);
  }
 
  
}
