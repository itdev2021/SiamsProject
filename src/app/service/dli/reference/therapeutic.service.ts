import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TherapeuticService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formTherapeutic = this.fb.group({
    TherapeuticID: [0],
    Description: ['']
  });

  initializeFormGroup() {
    this.formTherapeutic.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/Therapeutic', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/Therapeutic/' + formBody.TherapeuticID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/Therapeutic');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/Therapeutic/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/Therapeutic/' + id);
  }
}
