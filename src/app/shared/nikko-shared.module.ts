import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.modules';
import { AccountTitleListComponent } from '../modules/accounting/account-title/account-title-list/account-title-list.component';
import { AccountTitleEntryComponent } from '../modules/accounting/account-title/account-title-entry/account-title-entry.component'; 
import { BankListComponent } from '../modules/accounting/bank/bank-list/bank-list.component';
import { BankEntryComponent } from '../modules/accounting/bank/bank-entry/bank-entry.component';
import { CarEntryComponent } from '../modules/accounting/car/car-entry/car-entry.component';
import { CarListComponent } from '../modules/accounting/car/car-list/car-list.component';
import { PriceListComponent } from '../modules/references/price-list/price-list/price-list.component';
import { PriceListEntryComponent } from '../modules/references/price-list/price-list-entry/price-list-entry.component';
import { DiscountSchemeComponent } from '../modules/references/discount-scheme/discount-scheme-list/discount-scheme-list.component';
import { DiscountSchemeEntryComponent } from '../modules/references/discount-scheme/discount-scheme-entry/discount-scheme-entry.component';
import { CurrencyEntryComponent } from '../modules/references/currency-list/currency-entry/currency-entry.component';
import { CurrencyComponent } from '../modules/references/currency-list/currency-list/currency-list.component';
import { CostMethodEntryComponent } from '../modules/references/cost-method/cost-method-entry/cost-method-entry.component';
import { CostMethodComponent } from '../modules/references/cost-method/cost-method-list/cost-method-list.component';
import { CreditReasonComponent } from '../modules/references/credit-reason/credit-reason-list/credit-reason-list.component';
import { CreditReasonEntryComponent } from '../modules/references/credit-reason/credit-reason-entry/credit-reason-entry.component';
import { CROEntryComponent } from '../modules/references/cro/cro-entry/cro-entry.component';
import { CROComponent } from '../modules/references/cro/cro-list/cro-list.component';
import { CustomerGroupComponent } from '../modules/references/customer-group/customer-group-list/customer-group-list.component';
import { CustomerGroupEntryComponent } from '../modules/references/customer-group/customer-group-entry/customer-group-entry.component';
import { DepartmentComponent } from '../modules/references/department/department-list/department-list.component';
import { DepartmentEntryComponent } from '../modules/references/department/department-entry/department-entry.component';
import { EntryTypeComponent } from '../modules/references/entry-type/entry-type-list/entry-type-list.component';
import { EntryTypeEntryComponent } from '../modules/references/entry-type/entry-type-entry/entry-type-entry.component';
import { InvoiceFormatComponent } from '../modules/references/invoice-format/invoice-format-list/invoice-format-list.component';
import { InvoiceFormatEntryComponent } from '../modules/references/invoice-format/invoice-format-entry/invoice-format-entry.component';
// import { CreditTermsEntryComponent } from '../modules/sales/credit-terms/credit-terms-entry/credit-terms-entry.component';
// import { CreditTermsListComponent } from '../modules/sales/credit-terms/credit-term-list/credit-terms-list.component';
import { ProductDealEntryComponent } from '../modules/references/product-deal/product-deal-entry/product-deal-entry.component';
import { ProductDealComponent } from '../modules/references/product-deal/product-deal-list/product-deal-list.component';
import { SPMSPrincipalsEntryComponent } from '../modules/references/spms-principals/spms-principals-entry/spms-principals-entry.component';
import { SPMSPrincipalsComponent } from '../modules/references/spms-principals/spms-principals-list/spms-principals-list.component';
import { PoliticalMapEntryComponent } from '../modules/references/political-map/political-map-entry/political-map-entry.component';
import { PoliticalMapComponent } from '../modules/references/political-map/political-map-list/political-map-list.component';
import { ProductClassEntryComponent } from '../modules/references/product-class/product-class-entry/product-class-entry.component';
import { ProductClassComponent } from '../modules/references/product-class/product-class-list/product-class-list.component';
import { ProdCategorygComponent } from '../modules/references/prod-category/prod-category-list/prod-category-list.component';
import { ProdCategoryEntryComponent } from '../modules/references/prod-category/prod-category-entry/prod-category-entry.component';
import { ProdPreparationComponent } from '../modules/references/prod-preparation/prod-preparation-list/prod-preparation-list.component';
import { ProdPreparationEntryComponent } from '../modules/references/prod-preparation/prod-preparation-entry/prod-preparation-entry.component';
import { UOMEntryComponent } from '../modules/references/uom/uom-entry/uom-entry.component';
import { UOMComponent } from '../modules/references/uom/uom-list/uom-list.component';
import { RefDataComponent } from '../modules/references/ref-data/ref-data-list/ref-data-list.component';
import { RefDataEntryComponent } from '../modules/references/ref-data/ref-data-entry/ref-data-entry.component';
import { AssetLifeComponent } from '../modules/accounting/asset-life/asset-life-list/asset-life-list.component';
import { AssetLifeEntryComponent } from '../modules/accounting/asset-life/asset-life-entry/asset-life-entry.component';
import { CostUnitEntryComponent } from '../modules/accounting/business-unit-role/cost-unit/cost-unit-entry/cost-unit-entry.component';
import { CostUnitComponent } from '../modules/accounting/business-unit-role/cost-unit/cost-unit-list/cost-unit-list.component';
import { EmployeeComponent } from '../modules/accounting/business-unit-role/employee/employee-list/employee-list.component';
import { EmployeeEntryComponent } from '../modules/accounting/business-unit-role/employee/employee-entry/employee-entry.component';
import { CostCenterComponent } from '../modules/accounting/business-unit-role/cost-center/cost-center-list/cost-center-list.component';
import { CostCenterEntryComponent } from '../modules/accounting/business-unit-role/cost-center/cost-center-entry/cost-center-entry.component';
import { DivisionEntryComponent } from '../modules/references/division/division-entry/division-entry.component';
import { DivisionComponent } from '../modules/references/division/division-list/division-list.component';
import { UMConversionComponent } from '../modules/references/um-conversion/um-conversion-list/um-conversion-list.component';
import { UMConversionEntryComponent } from '../modules/references/um-conversion/um-conversion-entry/um-conversion-entry.component';
import { ItemsLookupexComponent } from '../modules/lookup/item-lookupex/items-lookupex.component';
import { ClientNameComponent } from '../modules/dli/reference/client-name-list/client-name-list.component';
import { ClientNameEntryComponent } from '../modules/dli/reference/client-name-entry/client-name-entry.component';
import { GroupNameComponent } from '../modules/dli/reference/group/group-name-list/group-name-list.component';
import { GroupNameEntryComponent } from '../modules/dli/reference/group/group-name-entry/group-name-entry.component';
import { CategoryDLIEntryComponent } from '../modules/dli/reference/CategoryDLI/category-dli-entry/category-dli-entry.component';
import { CategoryDLIComponent } from '../modules/dli/reference/CategoryDLI/category-dli-list/category-dli-list.component';
import { TherapeuticComponent } from '../modules/dli/reference/therapeutic/therapeutic-list/therapeutic-list.component';
import { TherapeuticEntryComponent } from '../modules/dli/reference/therapeutic/therapeutic-entry/therapeutic-entry.component';
import { EGCComponent } from '../modules/dli/reference/EGC/EGC-list/EGC-list.component';
import { EGCEntryComponent } from '../modules/dli/reference/EGC/EGC-entry/EGC-entry.component';
import { ShelfLifeComponent } from '../modules/dli/reference/ShelfLife/shelf-life-list/shelf-life-list.component';
import { ShelfLifeEntryComponent } from '../modules/dli/reference/ShelfLife/shelf-life-entry/shelf-life-entry.component';
import { WeightClaimComponent } from '../modules/dli/reference/weight-claim/weight-claim-list/weight-claim-list.component';
import { WeightClaimEntryComponent } from '../modules/dli/reference/weight-claim/weight-claim-entry/weight-claim-entry.component';
import { FormulationComponent } from '../modules/dli/reference/formulation/formulation-list/formulation-list.component';
import { FormulationEntryComponent } from '../modules/dli/reference/formulation/formulation-entry/formulation-entry.component';
import { BatchSizeEntryComponent } from '../modules/dli/reference/batch-size/batch-size-entry/batch-size-entry.component';
import { BatchSizeComponent } from '../modules/dli/reference/batch-size/batch-size-list/batch-size-list.component';
import { ClassificationDLIComponent } from '../modules/dli/reference/classification-dli/classification-dli-list/classification-dli-list.component';
import { ClassificationDLIEntryComponent } from '../modules/dli/reference/classification-dli/classification-dli-entry/classification-dli-entry.component';


@NgModule({
  declarations: [
    AccountTitleListComponent,
    AccountTitleEntryComponent,
    BankListComponent,
    BankEntryComponent,
    CarListComponent,
    CarEntryComponent,
    PriceListComponent,
    PriceListEntryComponent,
    DiscountSchemeComponent,
    DiscountSchemeEntryComponent,
    CurrencyEntryComponent,
    CurrencyComponent,
    CostMethodEntryComponent,
    CostMethodComponent,
    CreditReasonComponent,
    CreditReasonEntryComponent,
    CROEntryComponent,
    CROComponent,
    CustomerGroupComponent,
    CustomerGroupEntryComponent,
    DepartmentComponent,
    DepartmentEntryComponent,
    EntryTypeComponent,
    EntryTypeEntryComponent,
    InvoiceFormatComponent,
    InvoiceFormatEntryComponent,
    ProductDealEntryComponent,
    ProductDealComponent,
    SPMSPrincipalsEntryComponent,
    SPMSPrincipalsComponent,
    PoliticalMapEntryComponent,
    PoliticalMapComponent,
    ProductClassEntryComponent,
    ProductClassComponent,
    ProdCategorygComponent,
    ProdCategoryEntryComponent,
    ProdPreparationComponent,
    ProdPreparationEntryComponent,
    UOMEntryComponent,
    UOMComponent,
    RefDataComponent,
    RefDataEntryComponent,
    AssetLifeComponent,
    AssetLifeEntryComponent,
    CostUnitEntryComponent,
    CostUnitComponent,
    EmployeeComponent,
    EmployeeEntryComponent,
    CostCenterComponent,
    CostCenterEntryComponent,
    DivisionEntryComponent,
    DivisionComponent,
    UMConversionComponent,
    UMConversionEntryComponent,
    ItemsLookupexComponent,
    ClientNameComponent,
    ClientNameEntryComponent,
    GroupNameComponent,
    GroupNameEntryComponent,
    CategoryDLIEntryComponent,
    CategoryDLIComponent,
    TherapeuticComponent,
    TherapeuticEntryComponent,
    EGCComponent,
    EGCEntryComponent,
    ShelfLifeComponent,
    ShelfLifeEntryComponent,
    WeightClaimComponent,
    WeightClaimEntryComponent,
    FormulationComponent,
    FormulationEntryComponent,
    BatchSizeEntryComponent,
    BatchSizeComponent,
    ClassificationDLIComponent,
    ClassificationDLIEntryComponent

    

  ],
  imports: [
    CommonModule,
    MaterialModule
    
  ],
  exports:[],
  providers: []
})
export class NikkoSharedModule { }
