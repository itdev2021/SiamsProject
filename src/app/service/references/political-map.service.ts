import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PoliticalMapService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formPoliticalMap = this.fb.group({
    PoliticalMapID: [0],
    Region: [''],
    Designation: [''],
    CenterCapital: [''],
    Provinces: [''],
    Capital: [''],
    Municipalities: [''],
    City: [''],
    District: [''],
    Zone: [''],
    Barangay: [''],
    Area: [''],
    ZipCode: ['']
  });

  initializeFormGroup() {
    this.formPoliticalMap.setValue({
       });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/PoliticalMap', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/PoliticalMap/' + formBody.PoliticalMapID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/PoliticalMap');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/PoliticalMap/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/PoliticalMap/' + id);
  }
}
