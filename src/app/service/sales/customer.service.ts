import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formCustomer = this.fb.group({
    CustomerID: [0],
    Customer: ['', Validators.required],
    Drugstore: ['', Validators.required],
    CreditTermsID: [0, Validators.required],
    PriceListID: [0],
    IsMember: [0],
    DiscountSchemeID: [0],
    Region: [''],
    Designation: [''],
    Provinces: [0],
    Capital: [''],
    City: [''],
    Municipalities: [''],
    District: [''],
    Zone: [''],
    Barangay: [''],
    Area: [''],
    Zipcode: [''],
    Street: [''],
    Contact: [''],
    InvoicePrint: [0],
    CreditLimit: [''],
    TIN: ['', Validators.required],
    NonVat: [0],
    CustomerGroupID: [0],
    SPMSPrincipalsID: [0],
    UserRefenceCode: [''],
    EntryTypeID: [0],
    ProductDealID: [0],
    CROID: [0],
    RC: [new Date()],
    RCU: [0],
    deletedIDs: [''],
    CustomerShipTo: this.fb.array([])

  });

  // initializeFormGroup() {
  //   this.formCustomer.setValue({
  //     CustomerID: 0,
  //     Customer: '',
  //     Drugstore: '',
  //     CreditTermsID: 0,
  //     PriceListID: 0,
  //     IsMember: 0,
  //     DiscountSchemeID: 0,

  //     Region: '',
  //     Designation: '',
  //     Provinces: '',
  //     Capital: '',
  //     City: '',
  //     Municipalities: '',
  //     District: '',
  //     Zone: '',
  //     Barangay: '',
  //     Area: '',
  //     Zipcode: '',
  //     Street: '',

  //     Contact: '',
  //     InvoicePrint: 0,
  //     CreditLimit: 0,
  //     TIN: '',
  //     NonVat: 0,
  //     CustomerGroupID: 0,
  //     SPMSPrincipalsID: 0,
  //     UserRefenceCode: '',
  //     EntryTypeID: 0,
  //     ProductDealID: 0,
  //     CROID: 0,
  //     RC: new Date(),
  //     RCU: 0,
  //     deletedIDs: '',
  //     CustomerShipTo: ([])

  //   });
  // }

  insertCustomer() {
    var body = {
      ...this.formCustomer.value,
      CustomerShipToAdd: this.formCustomer.get('CustomerShipTo').value
    }
    return this.http.post(environment.apiURL + '/Customer', body);
  }

  getCustomerList() {
    return this.http.get(environment.apiURL + '/Customer');
  }

  getCustomerByID(id: number): any {
    return this.http.get(environment.apiURL + '/Customer/' + id);
  }

  getCustomerShipAdd(id: number): any {
    return this.http.get(environment.apiURL + '/Customer/ShipAdd/' + id);
  }

  deleteCustomer(id: number) {
    return this.http.delete(environment.apiURL + '/Customer/' + id);
  }
}
