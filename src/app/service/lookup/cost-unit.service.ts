import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostUnitService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formCostUnit = this.fb.group({
    CostUnitID: [0],
    CostUnit: [''],
    EmployeeID: [''],
    EmployeeName: [''],
    CostCenterID: [''],
    CostCenter: [''],
    DivisionID: [''],
    Division: [''],
    RC: [new Date()],
    RCU: [0]
  });

  initializeFormGroup() {
    this.formCostUnit.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/CostUnit', formBody);
  }
  
  update(formBody) {
    return this.http.put(environment.apiURL + '/CostUnit/' + formBody.CostUnitID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CostUnit');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CostUnit/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CostUnit/' + id);
  }

}
