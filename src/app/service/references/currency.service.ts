import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient,
    private fb : FormBuilder) { }

  formCurrency = this.fb.group({
  currency_id : [0],
  currency_name : [''],
  currency_code : [''],
  Actve : [true],
  Sysmbols : [''],
  RC : [new Date()],
  RCU : [0]
  
  });
  // getCurrencyList() {
  //   return this.http.get(environment.apiURL + '/Currencies');
  // }
  insert(formBody) {
    return this.http.post(environment.apiURL + '/Currencies', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/Currencies/' + formBody.currency_id, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/Currencies');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/Currencies/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/Currencies/' + id);
  }
}
