import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CROService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formCRO = this.fb.group({
    CROID : [0],
    CRO : ['']
  });

  initializeFormGroup() {
    this.formCRO.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/CRO', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/CRO/' + formBody.CROID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CRO');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CRO/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CRO/' + id);
  }
}
