import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GroupNameService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formGroupName = this.fb.group({
    GroupID: [0],
    GroupName: ['']
  });

  initializeFormGroup() {
    this.formGroupName.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/GroupName', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/GroupName/' + formBody.GroupID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/GroupName');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/GroupName/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/GroupName/' + id);
  }
}
