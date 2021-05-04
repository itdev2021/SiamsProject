import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formGenerator = this.fb.group({
    id: [0, Validators.required],
    tableName: ['', Validators.required],
    nextNo: [0, Validators.required],
  });

  insert(formBody) {
    return this.http.post(environment.apiURL + '/generator', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/generator/' + formBody.pk, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/generator');
  }

  getTableID(tableName: string): any {
    return this.http.put(environment.apiURL + '/generator/tableID/' + tableName, '');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/generator/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/generator/' + id);
  }
}
