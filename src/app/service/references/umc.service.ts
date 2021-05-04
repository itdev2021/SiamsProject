import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder } from '@angular/forms';
import { ProductService } from '../inventory/product.service';

@Injectable({
  providedIn: 'root'
})
export class UmcService {


  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private productService: ProductService) { }


  formUMConversion = this.fb.group({
    UMID: [0],
    ProductCode: [''],
    ProductDesc: [''],
    DeleteIDs: [''],
    items: this.fb.array([])
  });


  getItemRow() {
    (<FormArray>this.formUMConversion.get('items')).push(
      this.fb.group({
        UMID: [0],
        DefUOM: [''],
        UOMQty: ['1'],
        UMC: [''],
        UMCQty: ['']
      })
    );
  }

  getInfo(id){
    this.getByID(id).subscribe(res => {
      this.productService.getProductList().subscribe(item => {
        let x; x = item;
        x.filter(y => y.ProductCode == res.UMC.ProductCode)[0].Product
      
      this.formUMConversion.patchValue({
        ProductCode: res.UMC.ProductCode,
        ProductDesc: x.filter(y => y.ProductCode == res.UMC.ProductCode)[0].Product
      });
    });
      this.formUMConversion.setControl('items', this.setExistingItems(res.UMConversion));
    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        UMID: i.UMID,
        DefUOM: i.DefUOM,
        UOMQty: i.UOMQty,
        UMC: i.UMC,
        UMCQty: i.UMCQty
      }))
    });
    return formArray;
  }

  saveOrUpdate() {
    var body = {
      ...this.formUMConversion.value,
      UMConversion: this.formUMConversion.get('items').value
    }
    console.log(body);
    return this.http.post(environment.apiURL + '/UMConversion/' + this.formUMConversion.value.ProductCode, body);
  }

  getList() {
    return this.http.get(environment.apiURL + '/UMConversion');
  }

  getByID(id: string): any {
    return this.http.get(environment.apiURL + '/UMConversion/' + id);
  }

  delete(id: string) {
    return this.http.delete(environment.apiURL + '/UMConversion/' + id);
  }

}
