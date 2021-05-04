import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ClientNameService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formClientName = this.fb.group({
    ClientID: [0],
    ClientName: ['']
  });

  initializeFormGroup() {
    this.formClientName.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/ClientName', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/ClientName/' + formBody.ClientID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ClientName');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ClientName/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ClientName/' + id);
  }
}
