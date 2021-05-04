import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  getBankList() {
    return this.http.get(environment.apiURL + '/Bank');
  }

  formBank = this.fb.group({
    BankID: [0],
    AccountNumber: ['', Validators.required],
    AccountCode: ['', Validators.required],
    BankName: ['', Validators.required],
    Address: [''],
    AccountTitleID: [0, Validators.required],
    CheckType: [0, Validators.required],
    RC: [new Date()],
    RCU: [0]
  });

  initializeFormGroup() {
    this.formBank.setValue({
      BankID: 0,
      AccountNumber: '',
      AccountCode: '',
      BankName: '',
      Address: '',
      AccountTitleID: 0,
      CheckType: 0,
      RC: new Date(),
      RCU: 0
    });
  }

  insertBank(formBody){
    return this.http.post(environment.apiURL + '/Bank', formBody);
  }

  updateBank(formBody){
    return this.http.put(environment.apiURL + '/Bank/' + formBody.BankID, formBody);
  }

  getBankByID(id: number): any {
    return this.http.get(environment.apiURL + '/Bank/' + id);
  }

  deleteBank(id: number) {
    return this.http.delete(environment.apiURL + '/Bank/' + id);
  }
}
