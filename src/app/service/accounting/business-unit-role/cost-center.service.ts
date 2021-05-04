import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostCenterService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formCostCenter = this.fb.group({
    CostCenterID: [0],
    CostCenter: [''],
    RC: [new Date()],
    RCU: [0]
  });

  initializeFormGroup() {
    this.formCostCenter.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/CostCenter', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/CostCenter/' + formBody.CostCenterID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CostCenter');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CostCenter/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CostCenter/' + id);
  }

}
