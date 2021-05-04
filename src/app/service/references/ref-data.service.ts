import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formRefData = this.fb.group({
    id: [0],
    refData: [''],
    refCode: [''],
    refText: [''],
    Status: [1],
    RC: [new Date()],
    RCU: [0]

  });

  // getList() {
  //   return this.http.get(environment.apiURL + '/refdata');
  // }

  initializeFormGroup() {
    this.formRefData.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/refdata', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/refdata/' + formBody.id, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/refdata');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/refdata/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/refdata/' + id);
  }

}
