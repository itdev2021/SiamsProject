import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VatNonVatService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formVatNonVat = this.fb.group({
    VatNonVatID : [0],
    VatNonVat : ['']
  });

  initializeFormGroup() {
    this.formVatNonVat.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/VatNonVat', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/VatNonVat/' + formBody.VatNonVatID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/VatNonVat');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/VatNonVat/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/VatNonVat/' + id);
  }
}
