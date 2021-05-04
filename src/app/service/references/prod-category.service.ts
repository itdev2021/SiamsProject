import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProdCategoryService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  // getProdCategoryList() {
  //   return this.http.get(environment.apiURL + '/ProdCat');
  // }

  formProdCategory = this.fb.group({
    CategoryID: [0],
    Code: [''],
    Category: ['']
  });

  initializeFormGroup() {
    this.formProdCategory.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/ProdCat', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/ProdCat/' + formBody.CategoryID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ProdCat');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ProdCat/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ProdCat/' + id);
  }

}
