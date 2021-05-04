import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formWarehouse = this.fb.group({
    WareHouseID: [0],
    Code: [''],
    WareHouse: ['', Validators.required],
    Address: ['', Validators.required],
    Active: [1]
  });

  initializeFormGroup() {
    this.formWarehouse.setValue({
      WareHouseID: 0,
      Code: '',
      WareHouse: '',
      Address: '',
      Active: 1

    });
  }

  insertWarehouse(formWarehouse) {
    return this.http.post(environment.apiURL + '/Warehouse', formWarehouse);
  }

  updateWarehouse(formWarehouse) {
    return this.http.put(environment.apiURL + '/Warehouse/' + formWarehouse.WareHouseID, formWarehouse);
  }

  getWarehouseList() {
    return this.http.get(environment.apiURL + '/Warehouse');
  }

  getWarehouseByID(id: number): any {
    return this.http.get(environment.apiURL + '/Warehouse/' + id);
  }

  deleteWarehouse(id: number) {
    return this.http.delete(environment.apiURL + '/Warehouse/' + id);
  }
}
