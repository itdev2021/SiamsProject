import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DiscountSchemeService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formDiscountScheme = this.fb.group({
    DiscountSchemeID : [0],
    DiscountScheme : [''],
    DateFrom : [''],
    DateTo : [''],
    Status : [1],
    RC : [new Date()],
    RCU : [0]
   
  });

  initializeFormGroup() {
    this.formDiscountScheme.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/DiscountScheme', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/DiscountScheme/' + formBody.DiscountSchemeID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/DiscountScheme');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/DiscountScheme/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/DiscountScheme/' + id);
  }
}
