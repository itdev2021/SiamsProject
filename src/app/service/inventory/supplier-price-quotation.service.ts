import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SupplierPriceQuotationService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formPriceQuatation = this.fb.group({
    PriceQuotationID: [0],
    SupplierID: ['', Validators.required],
    DeleteIDs: [''],
    item: this.fb.array([

    ])
  });

  // addItemGroup(): FormGroup{
  //   return this.fb.group({
  //     PriceQuotationDetailID: [0],
  //     PriceQuotationID: [0],
  //     ProductID: [0],
  //     Product: [''],
  //     UOMID: [0],
  //     UOMDescription: [''],
  //     UnitCost: [0],
  //   });
  // }

  // initializeFormGroup() {
  //   this.formPriceQuatation.setValue({
  //     PriceQuotationID: 0,
  //     SupplierID: '',
  //     DeleteIDs: '',
  //     item: this.fb.array([])
  //   });
  // }


  saveOrUpdateOrder() {
    
    var body = {
      ...this.formPriceQuatation.value,
      PriceQuotationDetail: this.formPriceQuatation.get('item').value
    };
    return this.http.post(environment.apiURL + '/PriceQuotation', body);
  }

  getPriceQuotationList() {
    return this.http.get(environment.apiURL + '/PriceQuotation');
  }

  getPriceQuotationByID(id: number): any {
    return this.http.get(environment.apiURL + '/PriceQuotation/' + id);
  }

  deletePriceQuotation(id: number) {
    return this.http.delete(environment.apiURL + '/PriceQuotation/' + id);
  }

}

