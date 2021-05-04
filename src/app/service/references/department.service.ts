import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient,
    private fb : FormBuilder) { }

  formDepartment = this.fb.group({
  DeptID : [0],
  Department : [''],
  DeptAbbr : ['']
});
  // getDepartmentList() {
  //   return this.http.get(environment.apiURL + '/Department');
  // }
  insert(formBody) {
    return this.http.post(environment.apiURL + '/Department', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/Department/' + formBody.DeptID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/Department');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/Department/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/Department/' + id);
  }
}

