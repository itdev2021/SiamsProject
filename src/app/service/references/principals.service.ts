import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SPMSPrincipalsService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formSPMSPrincipals = this.fb.group({
    SPMSPrincipalsID : [0],
    CompanyCode : [''],
    CompanyName : [''],
    RC : [new Date()],
    RCU : [0]
  });

  initializeFormGroup() {
    this.formSPMSPrincipals.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/SPMSPrincipals', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/SPMSPrincipals/' + formBody.SPMSPrincipalsID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/SPMSPrincipals');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/SPMSPrincipals/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/SPMSPrincipals/' + id);
  }
}
