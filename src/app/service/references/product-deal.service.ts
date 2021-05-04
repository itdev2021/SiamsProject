import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProductDealService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formProductDeal = this.fb.group({
    ProductDealID : [0],
    ProductDeal : ['']
  });

  initializeFormGroup() {
    this.formProductDeal.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/ProductDeal', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/ProductDeal/' + formBody.ProductDealID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ProductDeal');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ProductDeal/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ProductDeal/' + id);
  }
}
