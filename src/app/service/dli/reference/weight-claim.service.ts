import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WeightClaimService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formWeightClaim = this.fb.group({
    WeightClaimID : [0],
    WeightClaim : ['']
  });

  initializeFormGroup() {
    this.formWeightClaim.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/WeightClaim', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/WeightClaim/' + formBody.WeightClaimID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/WeightClaim');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/WeightClaim/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/WeightClaim/' + id);
  }
}
