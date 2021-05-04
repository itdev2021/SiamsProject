import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formProduct = this.fb.group({
    ProductID: [0],
    ProductCode: [''],
    Product: ['', Validators.required],
    ClassID: [0],
    CategoryID: [0],
    PreparationID: [0],
    UOMID: [0],
    AccountTitleID: [0],
    ShelfLife: [0],
    MinimumStock: [0],
    MinimumOrder: [0],
    SupplierID: [0],
    WarehouseID: [0],
    UMCID: [0],
    CostMethodID: [0],
    PImage: [''],
    PBarcode: [''],
    Active: [1],
    BuyPrice: [0],
    SellPrice: [0],
    iSTrade: [1],
    CaseSize: [''],
    DLIProductCode: ['']
  });

  initializeFormGroup() {
    this.formProduct.setValue({
      ProductID: 0,
      ProductCode: '',
      Product: '',
      ClassID: 0,
      CategoryID: 0,
      PreparationID: 0,
      WarehouseID: 0,
      UOMID: 0,
      AccountTitleID: 0,
      ShelfLife: 0,
      MinimumStock: 0,
      MinimumOrder: 0,
      SupplierID: 0,
      UMCID: 0,
      CostMethodID: 0,
      PImage: '',
      PBarcode: '',
      Active: 1,
      BuyPrice: 0,
      SellPrice: 0,
      iSTrade: 1,
      CaseSize: '',
      DLIProductCode: ''
    });
  }

  insertProduct(formProduct) {
    return this.http.post(environment.apiURL + '/Product', formProduct);
  }

  // insertProduct(mFormData,mImage){
  //   const HttpUploadOptions = {
  //     headers: new HttpHeaders({ "Content-Type": "multipart/form-data"})
  //   }
  //   const formData = new FormData();
  //   formData.append('data', mFormData);
  //   formData.append('image', mImage);
  //   console.log(formData);
  //   return this.http.post(environment.apiURL + '/Product', [mFormData,formData], HttpUploadOptions)
  // }

  // insertProduct(formProduct, fileUpload: File) {
  //   const formData: FormData = new FormData();
  //   // formData.append('Image', fileUpload, fileUpload.name);
  //   // formData.append('ImageCaption', caption);
  //   const HttpUploadOptions = {
  //     headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  //   }

  //   formData.append('ProductID', formProduct['ProductID']);
  //   formData.append('ProductCode', formProduct['ProductCode']);
  //   formData.append('Product', formProduct['Product']);
  //   formData.append('ClassID', formProduct['ClassID']);
  //   formData.append('CategoryID', formProduct['CategoryID']);
  //   formData.append('PreparationID', formProduct['PreparationID']);
  //   formData.append('WarehouseID', formProduct['WarehouseID']);
  //   formData.append('UOMID', formProduct['UOMID']);
  //   formData.append('AccountTitleID', formProduct['AccountTitleID']);
  //   formData.append('ShelfLife', formProduct['ShelfLife']);
  //   formData.append('MinimumStock', formProduct['MinimumStock']);
  //   formData.append('MinimumOrder', formProduct['MinimumOrder']);
  //   formData.append('SupplierID', formProduct['SupplierID']);
  //   formData.append('UMCID', formProduct['UMCID']);
  //   formData.append('CostMethodID', formProduct['CostMethodID']);
  //   formData.append('PImage', formProduct['Pmage']);
  //   formData.append('Image', fileUpload, fileUpload.name);
  //   formData.append('PBarcode', formProduct['PBarcode']);
  //   formData.append('Active', formProduct['Active']);
  //   formData.append('BuyPrice', formProduct['BuyPrice']);
  //   formData.append('SellPrice', formProduct['SellPrice']);
  //   formData.append('iSTrade', formProduct['iSTrade']);
  //   formData.append('CaseSize', formProduct['CaseSize']);
  //   formData.append('DLIProductCode', formProduct['DLIProductCode']);
  //   console.log(formData);
  //   return this.http.post(environment.apiURL + '/Product', formData, HttpUploadOptions);
  // }

  updateProduct(formProduct) {
    return this.http.put(environment.apiURL + '/Product/' + formProduct.ProductID, formProduct);
  }

  getProductList() {
    return this.http.get(environment.apiURL + '/Product');
  }

  getProductByID(id: number): any {
    return this.http.get(environment.apiURL + '/Product/' + id);
  }

  deleteProduct(id: number) {
    return this.http.delete(environment.apiURL + '/Product/' + id);
  }

}

