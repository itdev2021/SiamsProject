import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UomService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  // getUOMList(){
  //   return this.http.get(environment.apiURL + '/UOM');
  // }

  formUOM = this.fb.group({
    UOMID: [0],
    Code: [''],
    UOMDescription: ['']
  });

  initializeFormGroup() {
    this.formUOM.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/UOM', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/UOM/' + formBody.UOMID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/UOM');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/UOM/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/UOM/' + id);
  }

}
