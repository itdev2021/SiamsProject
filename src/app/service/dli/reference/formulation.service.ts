import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormulationService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formFormulation = this.fb.group({
    FormulationID : [0],
    Formulation : ['']
  });

  initializeFormGroup() {
    this.formFormulation.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/Formulation', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/Formulation/' + formBody.FormulationID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/Formulation');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/Formulation/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/Formulation/' + id);
  }
}
