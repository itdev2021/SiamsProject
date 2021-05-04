import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreditReasonService {

  constructor(private http: HttpClient,
    private fb : FormBuilder) { }

  formCreditReason = this.fb.group({
  CreditReasonID : [0],
  Reason : ['']
});
  // getList() {
  //   return this.http.get(environment.apiURL + '/CreditReason');
  // }
  insert(formBody) {
    return this.http.post(environment.apiURL + '/CreditReason', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/CreditReason/' + formBody.CreditReasonID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CreditReason');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CreditReason/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CreditReason/' + id);
  }
}
