import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formPriceList = this.fb.group({
    PriceListID : [0],
    Descriptions : [''],
    DateEntry : [new Date()],
    ReservedBoolean : [true],
    RC : [new Date()],
    RCU : [0],
   
  });

  

  insert(formBody) {
    return this.http.post(environment.apiURL + '/PriceList', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/PriceList/' + formBody.PriceListID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/PriceList');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/PriceList/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/PriceList/' + id);
  }
}
