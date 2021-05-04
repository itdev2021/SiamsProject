import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  getCarList(){
    return this.http.get(environment.apiURL + '/CarList');
  }

  formCar = this.fb.group({
    CarListID: [0],
    CRNo: ['', Validators.required],
    CarMaker: ['', Validators.required],
    Model: ['', Validators.required],
    PlateNo: ['', Validators.required],
    ChassisNo: [''],
    EngineNo: [''],
    Value: [0],
    PropertyTagNo: [''],
    RC: [new Date()],
    RCU: [0]
  });

  initializeFormGroup() {
    this.formCar.setValue({
      CarListID: 0,
      CRNo: '',
      CarMaker: '',
      Model: [],
      PlateNo: '',
      ChassisNo: '',
      EngineNo: '',
      Value: 0,
      PropertyTagNo: '',
      RC: new Date(),
      RCU: 0
    });
  }

  insertCar(formBody){
    return this.http.post(environment.apiURL + '/CarList', formBody);
  }

  updateCar(formBody){
    return this.http.put(environment.apiURL + '/CarList/' + formBody.CarListID, formBody);
  }

  getCarByID(id: number): any {
    return this.http.get(environment.apiURL + '/CarList/' + id);
  }

  deleteCar(id: number) {
    return this.http.delete(environment.apiURL + '/CarList/' + id);
  }
}
