import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CategoryDLIService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formCategoryDLI = this.fb.group({
    CategID: [0],
    Category: ['']
  });

  initializeFormGroup() {
    this.formCategoryDLI.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/CategoryDLI', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/CategoryDLI/' + formBody.CategID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/CategoryDLI');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/CategoryDLI/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/CategoryDLI/' + id);
  }
}
