import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ShelfLifeService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formShelfLife = this.fb.group({
    ShelfLifeID :[0],
    ShelfLife :['']
  });

  initializeFormGroup() {
    this.formShelfLife.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/ShelfLife', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/ShelfLife/' + formBody.ShelfLifeID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/ShelfLife');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/ShelfLife/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/ShelfLife/' + id);
  }
}
