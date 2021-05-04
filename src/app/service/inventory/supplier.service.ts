import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formSupplier = this.fb.group({
    SupplierID: [0],
    Code: [''],
    Supplier: ['', Validators.required],
    StAddress: ['', Validators.required],
    CityTown: ['', Validators.required],
    Province: ['', Validators.required],
    ContactNo: [''],
    ContactPerson: [''],
    EmailAdd: ['',Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    Active: [1],
    EWT: [''],
    InputVat: [''],
    TIN: ['', Validators.required],
  });

  initializeFormGroup() {
    this.formSupplier.setValue({
      SupplierID: 0,
      Code: '',
      Supplier: '',
      StAddress: '',
      CityTown: '',
      Province: '',
      ContactNo: '',
      ContactPerson: '',
      EmailAdd: '',
      Active: 1,
      EWT: '',
      InputVat: 'RVAT',
      TIN: '',

    });
  }

  insertSupplier(formBody) {
    return this.http.post(environment.apiURL + '/Supplier', formBody);
  }

  updateSupplier(formBody) {
    return this.http.put(environment.apiURL + '/Supplier/' + formBody.SupplierID, formBody);
  }

  getSupplierList() {
    return this.http.get(environment.apiURL + '/Supplier');
  }

  getSupplierByID(id: number): any {
    return this.http.get(environment.apiURL + '/Supplier/' + id);
  }

  deleteSupplier(id: number) {
    return this.http.delete(environment.apiURL + '/Supplier/' + id);
  }

}
