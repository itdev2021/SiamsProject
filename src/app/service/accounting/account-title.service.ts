import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AccountTitleService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  getAccountTitleList() {
    return this.http.get(environment.apiURL + '/AccountTitle');
  }

  // getAccountTitleID(id){
  //   return this.http.get(environment.apiURL+'/AccountTitle/'+id);
  // }

  formAccountTitle = this.fb.group({
    AccountTitleID: [0],
    Code: ['', Validators.required],
    AccountTitle: ['', Validators.required],
    NormalBalance: [0],
    ParentID: [0],
    TypeID: [0],
    BookofAccountID: [0],
    RowLevel: [0],
    Monitored: [0],
    IsRequired: [0],
    BegBal: [0],
    CheckedPrinted: [0],
    YearCode: [0],
    ClassificationID: [0]
  });

  initializeFormGroup() {
    this.formAccountTitle.setValue({
      AccountTitleID: 0,
      Code: '',
      AccountTitle: '',
      NormalBalance: 0,
      ParentID: 0,
      TypeID: 0,
      BookofAccountID: 0,
      RowLevel: 0,
      Monitored: 0,
      IsRequired: 0,
      BegBal: 0,
      CheckedPrinted: 0,
      YearCode: 0,
      ClassificationID: 0
    });
  }

  insertAccount(formBody) {
    return this.http.post(environment.apiURL + '/AccountTitle', formBody);
  }

  updateAccount(formBody) {
    return this.http.put(environment.apiURL + '/AccountTitle/' + formBody.AccountTitleID, formBody);
  }

  getAccountTitleByID(id: number): any {
    return this.http.get(environment.apiURL + '/AccountTitle/' + id);
  }

  deleteAccountTitle(id: number) {
    return this.http.delete(environment.apiURL + '/AccountTitle/' + id);
  }

}

