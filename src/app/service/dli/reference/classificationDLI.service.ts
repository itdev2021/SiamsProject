import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ClassificationDLIService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formClassDLI = this.fb.group({
    ClassID: [0],
    Classification: ['']
  });

  initializeFormGroup() {
    this.formClassDLI.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/ClassificationDLI', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/ClassificationDLI/' + formBody.ClassID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ClassificationDLI');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ClassificationDLI/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ClassificationDLI/' + id);
  }
}
