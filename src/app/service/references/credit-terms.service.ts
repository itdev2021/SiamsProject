import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreditTermsService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formCreditTerms = this.fb.group({
    CreditTermsID: [0],
    CreditTerms: ['', Validators.required],
    Days: [0],
    RC: [new Date()],
    RCU: [0],
  });

  initializeFormGroup() {
    this.formCreditTerms.setValue({
      CreditTermsID: 0,
      CreditTerms: '',
      Days: 0,
      RC: new Date(),
      RCU: 0,
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/CreditTerms', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/CreditTerms/' + formBody.CreditTermsID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CreditTerms');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CreditTerms/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CreditTerms/' + id);
  }
}
