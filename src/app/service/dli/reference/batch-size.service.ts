import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BatchSizeService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formBatchSize = this.fb.group({
    BatchSizeID: [0],
    BatchSize: ['']
  });

  initializeFormGroup() {
    this.formBatchSize.setValue({

    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/BatchSize', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/BatchSize/' + formBody.BatchSizeID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/BatchSize');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/BatchSize/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/BatchSize/' + id);
  }
}
