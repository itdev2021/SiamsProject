import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CostMethodService {

  constructor(private http: HttpClient,
    private fb : FormBuilder) { }

  formCostMethod = this.fb.group({
  CostMethodID : [0],
  CostMethod : ['']
});

  // getCostMethod(){
  //   return this.http.get(environment.apiURL+'/CostMethod')
  // }
  insert(formBody) {
    return this.http.post(environment.apiURL + '/CostMethod', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/CostMethod/' + formBody.CostMethodID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CostMethod');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CostMethod/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CostMethod/' + id);
  }

}
