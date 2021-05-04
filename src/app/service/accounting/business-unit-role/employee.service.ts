import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formEmployee = this.fb.group({
    EmployeeID: [0],
    EmployeeCode: [''],
    LastName: [''],
    FirstName: [''],
    MiddleName: [''],
    Address: [''],
    PositionID: [''],
    DateHired: [''],
    Status: [1],
    RC: [new Date()],
    RCU: [0]
  });

  initializeFormGroup() {
    this.formEmployee.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/Employee', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/Employee/' + formBody.EmployeeID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/Employee');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/Employee/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/Employee/' + id);
  }

}
