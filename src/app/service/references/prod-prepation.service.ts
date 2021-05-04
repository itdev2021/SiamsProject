import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProdPrepationService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  // getProdPrepartionList() {
  //   return this.http.get(environment.apiURL + '/ProdPrep');
  // }

  formProdPreparation = this.fb.group({
    PreparationID: [0],
    Code: [''],
    Preparation: ['']
  });

  initializeFormGroup() {
    this.formProdPreparation.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/ProdPrep', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/ProdPrep/' + formBody.PreparationID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ProdPrep');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ProdPrep/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ProdPrep/' + id);
  }

}
