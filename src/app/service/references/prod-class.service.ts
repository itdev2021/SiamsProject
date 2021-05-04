import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProdClassService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  // getClassList() {
  //   return this.http.get(environment.apiURL + '/ProdClass');
  // }

  formProductClass = this.fb.group({
    ClassID: [0],
    Code: [''],
    Classification: ['']
  });

  initializeFormGroup() {
    this.formProductClass.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/ProdClass', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/ProdClass/' + formBody.ClassID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ProdClass');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ProdClass/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ProdClass/' + id);
  }

}
