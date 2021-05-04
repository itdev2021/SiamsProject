import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formDivision = this.fb.group({
    DivisionID : [0],
    Division : [''],
    RC : [new Date()],
    RCU : [0]
  });

  initializeFormGroup() {
    this.formDivision.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/Division', formBody);
  }
  
  update(formBody) {
    return this.http.put(environment.apiURL + '/Division/' + formBody.DivisionID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/Division');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/Division/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/Division/' + id);
  }

}
