import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFormatService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formInvoiceFormat = this.fb.group({
    InvoiceFormatID : [0],
    descriptions : [''],
    TransactionType : [''],
    Lines : [''],
    Status : [true]
  });

  initializeFormGroup() {
    this.formInvoiceFormat.setValue({
      
    });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/InvoiceFormat', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/InvoiceFormat/' + formBody.InvoiceFormatID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/InvoiceFormat');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/InvoiceFormat/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/InvoiceFormat/' + id);
  }
}
