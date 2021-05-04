import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AssetLifeService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  // getList(){
  //   return this.http.get(environment.apiURL + '/AssetLife');
  // }
  formAssetLife = this.fb.group({
  AssetLifeID: [0],
  AssetLife: [''],
  AccountDescription: [''],
  DebitAccount: [''],
  CreditAccount: [''],
  RC: [new Date()],
  RCU: [0]
});

  initializeFormGroup() {
    this.formAssetLife.setValue({
       });
  }

  insert(formBody) {
    return this.http.post(environment.apiURL + '/AssetLife', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/AssetLife/' + formBody.AssetLifeID, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/AssetLife');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/AssetLife/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/AssetLife/' + id);
  }
}

