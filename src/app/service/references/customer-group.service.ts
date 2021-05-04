import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formCustomerGroup = this.fb.group({
    CustomerGroupID : [0],
    CustomerGroupCode : [''],
    CustomerGroupName : [''],
  });

  initializeFormGroup() {
    this.formCustomerGroup.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/CustomerGroup', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/CustomerGroup/' + formBody.CustomerGroupID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CustomerGroup');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CustomerGroup/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CustomerGroup/' + id);
  }
}
