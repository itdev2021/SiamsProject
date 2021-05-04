import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { CustomerService } from 'src/app/service/sales/customer.service';
import { CreditTermsService } from 'src/app/service/references/credit-terms.service';
import { PriceListService } from 'src/app/service/references/price-list.service';
import { InvoiceFormatService } from 'src/app/service/references/invoice-format.service';
import { CustomerGroupService } from 'src/app/service/references/customer-group.service';
import { DiscountSchemeService } from 'src/app/service/references/discount-scheme.service';
import { SPMSPrincipalsService } from 'src/app/service/references/principals.service';
import { ProductDealService } from 'src/app/service/references/product-deal.service';
import { EntryTypeService } from 'src/app/service/references/entry-type.service';
import { CROService } from 'src/app/service/references/cro.service';
import { PoliticalMapService } from 'src/app/service/references/political-map.service';

@Component({
  selector: 'app-customer-entry',
  templateUrl: './customer-entry.component.html',
  styles: []
})
export class CustomerEntryComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable: ElementRef;

  provinceList;
  municipalityList;
  barangayList;
  areaList;
  zoneList;
  districtList;

  croList;
  termList;
  defaultPriceList;
  defaultSchemeList;
  invoiceTypeList;
  entryTypeList;
  productDealList;
  customerGroupList;
  principalList;

  deletedIDs = "";

  constructor(
    public service: CustomerService,
    private politicalMapService: PoliticalMapService,
    private croService: CROService,
    private termService: CreditTermsService,
    private defaultSchemeService: DiscountSchemeService,
    private priceListService: PriceListService,
    private invoiceFormatService: InvoiceFormatService,
    private entryTypeService: EntryTypeService,
    private productDealService: ProductDealService,
    private customerGroupService: CustomerGroupService,
    private principalsService: SPMSPrincipalsService,

    private fb: FormBuilder,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<CustomerEntryComponent>
  ) { }


  ngOnInit(): void {

    this.getProvince();

    //Customer Relationship Office (CRO)
    this.croService.getList().subscribe(res => {
      this.croList = res;
      this.croList.sort((a, b) => a.CRO > b.CRO ? 1 : -1)
    });

    //Credit Terms
    this.termService.getList().subscribe(res => {
      this.termList = res;
      this.termList.sort((a, b) => a.CreditTerms > b.CreditTerms ? 1 : -1)
    });

    //DiscountScheme
    this.defaultSchemeService.getList().subscribe(res => {
      this.defaultSchemeList = res;
      this.defaultSchemeList.sort((a, b) => a.DiscountScheme > b.DiscountScheme ? 1 : -1)
    });

    //PriceList
    this.priceListService.getList().subscribe(res => {
      this.defaultPriceList = res;
      this.defaultPriceList.sort((a, b) => a.Descriptions > b.Descriptions ? 1 : -1)
    });

    //InvoiceFormat
    this.invoiceFormatService.getList().subscribe(res => {
      this.invoiceTypeList = res;
      this.invoiceTypeList.sort((a, b) => a.descriptions > b.descriptions ? 1 : -1)
    });

    //Entry Type
    this.entryTypeService.getList().subscribe(res => {
      this.entryTypeList = res;
      this.entryTypeList.sort((a, b) => a.Description > b.Description ? 1 : -1)
    });

    //Product Deal
    this.productDealService.getList().subscribe(res => {
      this.productDealList = res;
      this.productDealList.sort((a, b) => a.ProductDeal > b.ProductDeal ? 1 : -1)
    });

    //CustomerGroup (Classification)
    this.customerGroupService.getList().subscribe(res => {
      this.customerGroupList = res;
      this.customerGroupList.sort((a, b) => a.CustomerGroupName > b.CustomerGroupName ? 1 : -1)
    });

    //Principals
    this.principalsService.getList().subscribe(res => {
      this.principalList = res;
      this.principalList.sort((a, b) => a.CompanyName > b.CompanyName ? 1 : -1)
    });

  }

  getProvince() {

    this.politicalMapService.getList().subscribe(res => {
      let province;
      province = res;
      this.provinceList = province.map(item => item.Provinces)
        .filter((value, index, self) => self.indexOf(value) === index)
    });

    this.getMunicipality(this.service.formCustomer.value.Provinces);

    this.getBarangay(this.service.formCustomer.value.Municipalities);

    // this.getRDC(this.service.formCustomer.value.Provinces);
  }

  getMunicipality(value) {
    if (this.service.formCustomer.value.Provinces != '' || this.service.formCustomer.value.Provinces != null) {
      this.politicalMapService.getList().subscribe(res => {
        let municipality;

        municipality = res;

        this.municipalityList = municipality.filter(x => x.Provinces == value)

        this.municipalityList = this.municipalityList.map(item => item.Municipalities)
          .filter((value, index, self) => self.indexOf(value) === index);

      });

      this.getRDC(value);
    }
  }

  // Region, Designation and CenterCapital
  getRDC(value) {
    if (!this.service.formCustomer.value.Provinces || this.service.formCustomer.value.Provinces == null) {
      return;
    } else {
      this.politicalMapService.getList().subscribe(res => {
        let region;
        let designation;

        region = res;
        designation = res;

        this.service.formCustomer.patchValue({
          Region: (!value ? '' : region.filter(x => x.Provinces == value)[0].Region),
          Designation: (!value ? '' : designation.filter(x => x.Provinces == value)[0].Designation)
        });
      });
    }
  }

  getBarangay(value) {
    if (!value || value == null) {
      return;
    }
    if (!this.service.formCustomer.value.Provinces || this.service.formCustomer.value.Provinces == null) {
      return;
    } else {
      this.politicalMapService.getList().subscribe(res => {
        let barangay;
        let city;
        let capital;
        let zone;

        city = res;
        capital = res;
        barangay = res;
        zone = res;

        this.service.formCustomer.patchValue({
          City: (city.filter(x => x.Provinces == this.service.formCustomer.value.Provinces && x.Municipalities == value)[0].City),
          Capital: (!value ? '' : capital.filter(x => x.Provinces == this.service.formCustomer.value.Provinces && x.Municipalities == value)[0].CenterCapital)
        })


        this.barangayList = barangay.filter(x => x.Provinces == this.service.formCustomer.value.Provinces && x.Municipalities == value)
        this.zoneList = zone.filter(x => x.Provinces == this.service.formCustomer.value.Provinces && x.Municipalities == value)

        this.barangayList = this.barangayList.map(item => item.Barangay)
          .filter((value, index, self) => self.indexOf(value) === index);

        this.zoneList = this.zoneList.map(item => item.Zone)
          .filter((value, index, self) => self.indexOf(value) === index);
      });
    }
  }

  getZipCode(value) {
    if (!value || value == null) {
      return;
    }
    if (!this.service.formCustomer.value.Provinces || this.service.formCustomer.value.Provinces == null) {
      return;
    } else {
      this.politicalMapService.getList().subscribe(res => {
        let area;
        let zipcode;
        let district;

        area = res;
        zipcode = res;
        district = res;

        // areaList;

        this.service.formCustomer.patchValue({
          Zipcode: (!value ? '' : zipcode.filter(x => x.Provinces == this.service.formCustomer.value.Provinces &&
            x.Municipalities == this.service.formCustomer.value.Municipalities &&
            x.Barangay == value)[0].ZipCode),

          District: (!value ? '' : district.filter(x => x.Provinces == this.service.formCustomer.value.Provinces &&
            x.Municipalities == this.service.formCustomer.value.Municipalities &&
            x.Barangay == value)[0].District)
        });

        this.areaList = area.filter(x => x.Provinces == this.service.formCustomer.value.Provinces &&
          x.Municipalities == this.service.formCustomer.value.Municipalities &&
          x.Barangay == value)

        this.areaList = this.areaList.map(item => item.Area)
          .filter((value, index, self) => self.indexOf(value) === index);
      });
    }
  }

  onAddShipToAdd() {
    (<FormArray>this.service.formCustomer.get('CustomerShipTo')).push(
      this.fb.group({
        ShipToID: [0],
        CustomerID: [0],
        ShipToCode: [''],
        ShipAddress: [''],

      })
    );
  }

  ondeleteRow(item, i: number) {
    if (item.value.ShipToID != null) {
      this.deletedIDs += item.value.ShipToID + ",";
      this.service.formCustomer.patchValue({
        DeleteIDs: this.deletedIDs
      });
    }
    (<FormArray>this.service.formCustomer.get('CustomerShipTo')).removeAt(i);

  }

  onSubmit() {
    this.service.insertCustomer().subscribe(
      (res: any) => {
        this.service.formCustomer.reset();
        // this.service.initializeFormGroup();
        this.onClose();
        this.notificationService.success('Submitted successfully');
      });
  }

  onClear() {
    this.service.formCustomer.reset();
    // this.service.initializeFormGroup();
  }

  onClose() {
    this.service.formCustomer.reset();
    // this.service.initializeFormGroup();
    this.dialogRef.close();
  }

  changeClient(value) {
    console.log(value);
  }


}
