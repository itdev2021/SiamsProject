import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EGCService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formEGC = this.fb.group({
    EGCID: [0],
    EGC: ['']
  });

  initializeFormGroup() {
    this.formEGC.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/EGC', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/EGC/' + formBody.EGCID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/EGC');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/EGC/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/EGC/' + id);
  }
}
