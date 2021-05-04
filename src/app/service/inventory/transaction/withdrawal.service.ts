import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { DeliveredToService } from '../../lookup/delivered-to.service';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {
  totalAmount = '0';
  constructor(private http: HttpClient,
    public fb: FormBuilder,
    public deliveredService: DeliveredToService,) { }

  formWS = this.fb.group({
    WithdrawalSlipID: [0],
    DateEntry: ['', Validators.required],
    ReferenceNo: [''],
    Amount: [0],
    CostUnitID: ['', Validators.required],
    CostUnit: [''],
    EmployeeID: [0],
    Employee: [''],
    CostCenterID: [0],
    AssignCCEID: [1],
    PayToID: [''],
    PayTo: ['', Validators.required],
    PayToTypeID: [''],
    Remarks: [''],
    Status: [-1],
    ISprinted: [0],
    RC: [new Date],
    RCU: [0],
    DeleteIDs: [''],
    items: this.fb.array([])
  })

  saveOrUpdate() {
    var body = {
      ...this.formWS.value,
      WSD: this.formWS.get('items').value
    }
    return this.http.post(environment.apiURL + '/WS', body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/WS');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/WS/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/WS/' + id);
  }

  updateStatus(id: number, url) {
    return this.http.put(environment.apiURL + url + id, '');
  }


  getInfo(id) {
    this.getByID(parseInt(id)).subscribe(res => {
      this.formWS.patchValue({
        WithdrawalSlipID: res.ws.WithdrawalSlipID,
        DateEntry: res.ws.DateEntry,
        ReferenceNo: res.ws.ReferenceNo,
        Amount: res.ws.Amount,
        CostUnitID: res.ws.CostUnitID,
        CostUnit: res.ws.CostUnit,
        EmployeeID: res.ws.EmployeeID,
        Employee: res.ws.Employee,
        CostCenterID: res.ws.CostCenterID,
        AssignCCEID: res.ws.AssignCCEID,
        PayToID: res.ws.PayToID,
        PayToTypeID: res.ws.PayToTypeID,
        Remarks: res.ws.Remarks,
        Status: res.ws.Status,
        Isprinted: res.ws.Isprinted
      });

      this.deliveredService.getList().subscribe(item => {
        const deliveredList = [];
        for (let i = 0; i < item.customer.length; i++) {
          deliveredList.push(Object.assign(item.customer[i], item.supplier[i], item.employee[i]));
        }
        this.formWS.patchValue({
          PayTo: deliveredList.filter(x => x.PayToID == res.ws.PayToID)[0].PayTo
        });
      });

      this.totalAmount = res.ws.TotalAmt,
        this.formWS.setControl('items', this.setExistingItems(res.wsd));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        WithdrawalSlipDetailID: i.WithdrawalSlipDetailID,
        WithdrawalSlipID: i.WithdrawalSlipID,
        WarehouseID: i.WarehouseID,
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
        ControlNo: i.ControlNo,
        AccountTitleIDDebit: i.AccountTitleIDDebit,
        AccountTitleIDCredit: i.AccountTitleIDCredit,
        IssuanceLotNo: i.IssuanceLotNo
      }))
    });
    return formArray;
  }

  getPatchCostUnit(row) {
    return this.formWS.patchValue({
      CostUnitID: row.CostUnitID,
      CostUnit: row.CostUnit,
      EmployeeID: row.EmployeeID,
      Employee: row.EmployeeName,
      CostCenterID: row.CostCenterID,
      AssignCCEID: 1,
    });
  }

  getPatchDelivered(row) {
    return this.formWS.patchValue({
      PayToID: row.PayToID,
      PayTo: row.PayTo,
      PayToTypeID: row.PayToTypeID
    });
  }

  // PurchasePrintInfo Controller
  getPrintInfoByID(id): any {
    return this.http.get(environment.apiURL + '/WSPrintInfo/' + id);
  }

  updatePrint(frmWS) {
    return this.http.post(environment.apiURL + '/WSPrintInfo', frmWS);
  }


}
