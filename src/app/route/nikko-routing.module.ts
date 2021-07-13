import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../layouts/default/default.component';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { AccountTitleListComponent } from '../modules/accounting/account-title/account-title-list/account-title-list.component';
import { AccountTitleEntryComponent } from '../modules/accounting/account-title/account-title-entry/account-title-entry.component';
import { BankListComponent } from '../modules/accounting/bank/bank-list/bank-list.component';
import { BankEntryComponent } from '../modules/accounting/bank/bank-entry/bank-entry.component';
import { CarListComponent } from '../modules/accounting/car/car-list/car-list.component';
import { CarEntryComponent } from '../modules/accounting/car/car-entry/car-entry.component';
import { PriceListComponent } from '../modules/references/price-list/price-list/price-list.component';
import { PriceListEntryComponent } from '../modules/references/price-list/price-list-entry/price-list-entry.component';
import { AuthGuard } from '../auth/auth.guard';
import { LoginComponent } from '../modules/user/login/login.component';
import { DiscountSchemeComponent } from '../modules/references/discount-scheme/discount-scheme-list/discount-scheme-list.component';
import { DiscountSchemeEntryComponent } from '../modules/references/discount-scheme/discount-scheme-entry/discount-scheme-entry.component';
import { CurrencyComponent } from '../modules/references/currency-list/currency-list/currency-list.component';
import { CurrencyEntryComponent } from '../modules/references/currency-list/currency-entry/currency-entry.component';
import { CostMethodComponent } from '../modules/references/cost-method/cost-method-list/cost-method-list.component';
import { CostMethodEntryComponent } from '../modules/references/cost-method/cost-method-entry/cost-method-entry.component';
import { CreditReasonComponent } from '../modules/references/credit-reason/credit-reason-list/credit-reason-list.component';
import { CreditReasonEntryComponent } from '../modules/references/credit-reason/credit-reason-entry/credit-reason-entry.component';
import { CROComponent } from '../modules/references/cro/cro-list/cro-list.component';
import { CROEntryComponent } from '../modules/references/cro/cro-entry/cro-entry.component';
import { CustomerGroupComponent } from '../modules/references/customer-group/customer-group-list/customer-group-list.component';
import { CustomerGroupEntryComponent } from '../modules/references/customer-group/customer-group-entry/customer-group-entry.component';
import { DepartmentComponent } from '../modules/references/department/department-list/department-list.component';
import { DepartmentEntryComponent } from '../modules/references/department/department-entry/department-entry.component';
import { EntryTypeComponent } from '../modules/references/entry-type/entry-type-list/entry-type-list.component';
import { EntryTypeEntryComponent } from '../modules/references/entry-type/entry-type-entry/entry-type-entry.component';
import { InvoiceFormatEntryComponent } from '../modules/references/invoice-format/invoice-format-entry/invoice-format-entry.component';
import { InvoiceFormatComponent } from '../modules/references/invoice-format/invoice-format-list/invoice-format-list.component';
import { ProductDealComponent } from '../modules/references/product-deal/product-deal-list/product-deal-list.component';
import { ProductDealEntryComponent } from '../modules/references/product-deal/product-deal-entry/product-deal-entry.component';
import { SPMSPrincipalsComponent } from '../modules/references/spms-principals/spms-principals-list/spms-principals-list.component';
import { SPMSPrincipalsEntryComponent } from '../modules/references/spms-principals/spms-principals-entry/spms-principals-entry.component';
import { PoliticalMapComponent } from '../modules/references/political-map/political-map-list/political-map-list.component';
import { PoliticalMapEntryComponent } from '../modules/references/political-map/political-map-entry/political-map-entry.component';
import { ProductClassEntryComponent } from '../modules/references/product-class/product-class-entry/product-class-entry.component';
import { ProductClassComponent } from '../modules/references/product-class/product-class-list/product-class-list.component';
import { ProdCategorygComponent } from '../modules/references/prod-category/prod-category-list/prod-category-list.component';
import { ProdCategoryEntryComponent } from '../modules/references/prod-category/prod-category-entry/prod-category-entry.component';
import { HomeComponent } from '../layouts/home/home.component';
import { ProdPreparationComponent } from '../modules/references/prod-preparation/prod-preparation-list/prod-preparation-list.component';
import { ProdPreparationEntryComponent } from '../modules/references/prod-preparation/prod-preparation-entry/prod-preparation-entry.component';
import { UOMComponent } from '../modules/references/uom/uom-list/uom-list.component';
import { UOMEntryComponent } from '../modules/references/uom/uom-entry/uom-entry.component';
import { RefDataEntryComponent } from '../modules/references/ref-data/ref-data-entry/ref-data-entry.component';
import { RefDataComponent } from '../modules/references/ref-data/ref-data-list/ref-data-list.component';
import { AssetLifeEntryComponent } from '../modules/accounting/asset-life/asset-life-entry/asset-life-entry.component';
import { AssetLifeComponent } from '../modules/accounting/asset-life/asset-life-list/asset-life-list.component';
import { CostUnitEntryComponent } from '../modules/accounting/business-unit-role/cost-unit/cost-unit-entry/cost-unit-entry.component';
import { CostUnitComponent } from '../modules/accounting/business-unit-role/cost-unit/cost-unit-list/cost-unit-list.component';
import { EmployeeComponent } from '../modules/accounting/business-unit-role/employee/employee-list/employee-list.component';
import { EmployeeEntryComponent } from '../modules/accounting/business-unit-role/employee/employee-entry/employee-entry.component';
import { CostCenterEntryComponent } from '../modules/accounting/business-unit-role/cost-center/cost-center-entry/cost-center-entry.component';
import { CostCenterComponent } from '../modules/accounting/business-unit-role/cost-center/cost-center-list/cost-center-list.component';
import { DivisionEntryComponent } from '../modules/references/division/division-entry/division-entry.component';
import { DivisionComponent } from '../modules/references/division/division-list/division-list.component';
import { UMConversionEntryComponent } from '../modules/references/um-conversion/um-conversion-entry/um-conversion-entry.component';
import { UMConversionComponent } from '../modules/references/um-conversion/um-conversion-list/um-conversion-list.component';
import { ClientNameComponent } from '../modules/dli/reference/client-name-list/client-name-list.component';
import { ClientNameEntryComponent } from '../modules/dli/reference/client-name-entry/client-name-entry.component';
import { GroupNameEntryComponent } from '../modules/dli/reference/group/group-name-entry/group-name-entry.component';
import { GroupNameComponent } from '../modules/dli/reference/group/group-name-list/group-name-list.component';
import { CategoryDLIEntryComponent } from '../modules/dli/reference/CategoryDLI/category-dli-entry/category-dli-entry.component';
import { CategoryDLIComponent } from '../modules/dli/reference/CategoryDLI/category-dli-list/category-dli-list.component';
import { TherapeuticComponent } from '../modules/dli/reference/therapeutic/therapeutic-list/therapeutic-list.component';
import { TherapeuticEntryComponent } from '../modules/dli/reference/therapeutic/therapeutic-entry/therapeutic-entry.component';
import { EGCComponent } from '../modules/dli/reference/EGC/EGC-list/EGC-list.component';
import { EGCEntryComponent } from '../modules/dli/reference/EGC/EGC-entry/EGC-entry.component';
import { ShelfLifeComponent } from '../modules/dli/reference/ShelfLife/shelf-life-list/shelf-life-list.component';
import { ShelfLifeEntryComponent } from '../modules/dli/reference/ShelfLife/shelf-life-entry/shelf-life-entry.component';
import { WeightClaimEntryComponent } from '../modules/dli/reference/weight-claim/weight-claim-entry/weight-claim-entry.component';
import { WeightClaimComponent } from '../modules/dli/reference/weight-claim/weight-claim-list/weight-claim-list.component';
import { FormulationEntryComponent } from '../modules/dli/reference/formulation/formulation-entry/formulation-entry.component';
import { FormulationComponent } from '../modules/dli/reference/formulation/formulation-list/formulation-list.component';
import { BatchSizeComponent } from '../modules/dli/reference/batch-size/batch-size-list/batch-size-list.component';
import { BatchSizeEntryComponent } from '../modules/dli/reference/batch-size/batch-size-entry/batch-size-entry.component';
import { ClassificationDLIComponent } from '../modules/dli/reference/classification-dli/classification-dli-list/classification-dli-list.component';
import { ClassificationDLIEntryComponent } from '../modules/dli/reference/classification-dli/classification-dli-entry/classification-dli-entry.component';
import { VatNonVatComponent } from '../modules/sales/vat-nonvat/vat-nonvat-list/vat-nonvat-list.component';
import { VatNonVatEntryComponent } from '../modules/sales/vat-nonvat/vat-nonvat-entry/vat-nonvat-entry.component';
import { SalesInvoicingListComponent } from '../modules/sales/transaction/sales-invoicing/sales-invoicing-list/sales-invoicing-list.component';
import { SalesInvoicingEntryComponent } from '../modules/sales/transaction/sales-invoicing/sales-invoicing-entry/sales-invoicing-entry.component';
import { DeliveredToComponent } from '../modules/lookup/delivered-to/delivered-to.component';
import { BeginningBalanceEntryComponent } from '../modules/adjustment-entry/begbal/beg-bal-entry/beg-bal-entry.component';
import { BeginningBalanceListComponent } from '../modules/adjustment-entry/begbal/beg-bal-list/beg-bal-list.component';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},

  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      
      {
        path: 'chart-of-account-list', component: AccountTitleListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'chart-of-account-entry', component: AccountTitleEntryComponent, canActivate: [AuthGuard] },
          { path: 'chart-of-account-entry/:id', component: AccountTitleEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'bank-list', component: BankListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'bank-entry', component: BankEntryComponent, canActivate: [AuthGuard] },
          { path: 'bank-entry/:id', component: BankEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'car-list', component: CarListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'car-entry', component: CarEntryComponent, canActivate: [AuthGuard] },
          { path: 'car-entry/:id', component: CarEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'price-list', component: PriceListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'price-list-entry', component: PriceListEntryComponent, canActivate: [AuthGuard] },
          { path: 'price-list-entry/:id', component: PriceListEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'discount-scheme', component: DiscountSchemeComponent, canActivate: [AuthGuard],
        children: [
          { path: 'discount-scheme-entry', component: DiscountSchemeEntryComponent, canActivate: [AuthGuard] },
          { path: 'discount-scheme-entry/:id', component: DiscountSchemeEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'currency-list', component: CurrencyComponent, canActivate: [AuthGuard],
        children: [
          { path: 'currency-entry', component: CurrencyEntryComponent, canActivate: [AuthGuard] },
          { path: 'currency-entry/:id', component: CurrencyEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'cost-method-list', component: CostMethodComponent, canActivate: [AuthGuard],
        children: [
          { path: 'cost-method-entry', component: CostMethodEntryComponent, canActivate: [AuthGuard] },
          { path: 'cost-method-entry/:id', component: CostMethodEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'credit-reason-list', component: CreditReasonComponent, canActivate: [AuthGuard],
        children: [
          { path: 'credit-reason-entry', component: CreditReasonEntryComponent, canActivate: [AuthGuard] },
          { path: 'credit-reason-entry/:id', component: CreditReasonEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'cro-list', component: CROComponent, canActivate: [AuthGuard],
        children: [
          { path: 'cro-entry', component: CROEntryComponent, canActivate: [AuthGuard] },
          { path: 'cro-entry/:id', component: CROEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'customer-group-list', component: CustomerGroupComponent, canActivate: [AuthGuard],
        children: [
          { path: 'customer-group-entry', component: CustomerGroupEntryComponent, canActivate: [AuthGuard] },
          { path: 'customer-group-entry/:id', component: CustomerGroupEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'department-list', component: DepartmentComponent, canActivate: [AuthGuard],
        children: [
          { path: 'department-entry', component: DepartmentEntryComponent, canActivate: [AuthGuard] },
          { path: 'department-entry/:id', component: DepartmentEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'entry-type-list', component: EntryTypeComponent, canActivate: [AuthGuard],
        children: [
          { path: 'entry-type-entry', component: EntryTypeEntryComponent, canActivate: [AuthGuard] },
          { path: 'entry-type-entry/:id', component: EntryTypeEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'invoice-format-list', component: InvoiceFormatComponent, canActivate: [AuthGuard],
        children: [
          { path: 'invoice-format-entry', component: InvoiceFormatEntryComponent, canActivate: [AuthGuard] },
          { path: 'invoice-format-entry/:id', component: InvoiceFormatEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'product-deal-list', component: ProductDealComponent, canActivate: [AuthGuard],
        children: [
          { path: 'product-deal-entry', component: ProductDealEntryComponent, canActivate: [AuthGuard] },
          { path: 'product-deal-entry/:id', component: ProductDealEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'spms-principals-list', component: SPMSPrincipalsComponent, canActivate: [AuthGuard],
        children: [
          { path: 'spms-principals-entry', component: SPMSPrincipalsEntryComponent, canActivate: [AuthGuard] },
          { path: 'spms-principals-entry/:id', component: SPMSPrincipalsEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'political-map-list', component: PoliticalMapComponent, canActivate: [AuthGuard],
        children: [
          { path: 'political-map-entry', component: PoliticalMapEntryComponent, canActivate: [AuthGuard] },
          { path: 'political-map-entry/:id', component: PoliticalMapEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'product-class-list', component: ProductClassComponent, canActivate: [AuthGuard],
        children: [
          { path: 'product-class-entry', component: ProductClassEntryComponent, canActivate: [AuthGuard] },
          { path: 'product-class-entry/:id', component: ProductClassEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'prod-category-list', component: ProdCategorygComponent, canActivate: [AuthGuard],
        children: [
          { path: 'prod-category-entry', component: ProdCategoryEntryComponent, canActivate: [AuthGuard] },
          { path: 'prod-category-entry/:id', component: ProdCategoryEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'prod-preparation-list', component: ProdPreparationComponent, canActivate: [AuthGuard],
        children: [
          { path: 'prod-preparation-entry', component: ProdPreparationEntryComponent, canActivate: [AuthGuard] },
          { path: 'prod-preparation-entry/:id', component: ProdPreparationEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'uom-list', component: UOMComponent, canActivate: [AuthGuard],
        children: [
          { path: 'uom-entry', component: UOMEntryComponent, canActivate: [AuthGuard] },
          { path: 'uom-entry/:id', component: UOMEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'ref-data-list', component: RefDataComponent, canActivate: [AuthGuard],
        children: [
          { path: 'ref-data-entry', component: RefDataEntryComponent, canActivate: [AuthGuard] },
          { path: 'ref-data-entry/:id', component: RefDataEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'asset-life-list', component: AssetLifeComponent, canActivate: [AuthGuard],
        children: [
          { path: 'asset-life-entry', component: AssetLifeEntryComponent, canActivate: [AuthGuard] },
          { path: 'asset-life-entry/:id', component: AssetLifeEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'cost-unit-list', component: CostUnitComponent, canActivate: [AuthGuard],
        children: [
          { path: 'cost-unit-entry', component: CostUnitEntryComponent, canActivate: [AuthGuard] },
          { path: 'cost-unit-entry/:id', component: CostUnitEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'employee-list', component: EmployeeComponent, canActivate: [AuthGuard],
        children: [
          { path: 'employee-entry', component: EmployeeEntryComponent, canActivate: [AuthGuard] },
          { path: 'employee-entry/:id', component: EmployeeEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'cost-center-list', component: CostCenterComponent, canActivate: [AuthGuard],
        children: [
          { path: 'cost-center-entry', component: CostCenterEntryComponent, canActivate: [AuthGuard] },
          { path: 'cost-center-entry/:id', component: CostCenterEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'division-list', component: DivisionComponent, canActivate: [AuthGuard],
        children: [
          { path: 'division-entry', component: DivisionEntryComponent, canActivate: [AuthGuard] },
          { path: 'division-entry/:id', component: DivisionEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'um-conversion-list', component: UMConversionComponent, canActivate: [AuthGuard],
        children: [
          { path: 'um-conversion-entry', component: UMConversionEntryComponent, canActivate: [AuthGuard] },
          { path: 'um-conversion-entry/:id', component: UMConversionEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'client-name-list', component: ClientNameComponent, canActivate: [AuthGuard],
        children: [
          { path: 'client-name-entry', component: ClientNameEntryComponent, canActivate: [AuthGuard] },
          { path: 'client-name-entry/:id', component: ClientNameEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'group-name-list', component: GroupNameComponent, canActivate: [AuthGuard],
        children: [
          { path: 'group-name-entry', component: GroupNameEntryComponent, canActivate: [AuthGuard] },
          { path: 'group-name-entry/:id', component: GroupNameEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'category-dli-list', component: CategoryDLIComponent, canActivate: [AuthGuard],
        children: [
          { path: 'category-dli-entry', component: CategoryDLIEntryComponent, canActivate: [AuthGuard] },
          { path: 'category-dli-entry/:id', component: CategoryDLIEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'therapeutic-list', component: TherapeuticComponent, canActivate: [AuthGuard],
        children: [
          { path: 'therapeutic-entry', component: TherapeuticEntryComponent, canActivate: [AuthGuard] },
          { path: 'therapeutic-entry/:id', component: TherapeuticEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'egc-list', component: EGCComponent, canActivate: [AuthGuard],
        children: [
          { path: 'egc-entry', component: EGCEntryComponent, canActivate: [AuthGuard] },
          { path: 'egc-entry/:id', component: EGCEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'shelf-life-list', component: ShelfLifeComponent, canActivate: [AuthGuard],
        children: [
          { path: 'shelf-life-entry', component: ShelfLifeEntryComponent, canActivate: [AuthGuard] },
          { path: 'shelf-life-entry/:id', component: ShelfLifeEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'weight-claim-list', component: WeightClaimComponent, canActivate: [AuthGuard],
        children: [
          { path: 'weight-claim-entry', component: WeightClaimEntryComponent, canActivate: [AuthGuard] },
          { path: 'weight-claim-entry/:id', component: WeightClaimEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'formulation-list', component: FormulationComponent, canActivate: [AuthGuard],
        children: [
          { path: 'formulation-entry', component: FormulationEntryComponent, canActivate: [AuthGuard] },
          { path: 'formulation-entry/:id', component: FormulationEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'batch-size-list', component: BatchSizeComponent, canActivate: [AuthGuard],
        children: [
          { path: 'batch-size-entry', component: BatchSizeEntryComponent, canActivate: [AuthGuard] },
          { path: 'batch-size-entry/:id', component: BatchSizeEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'classification-dli-list', component: ClassificationDLIComponent, canActivate: [AuthGuard],
        children: [
          { path: 'classification-dli-entry', component: ClassificationDLIEntryComponent, canActivate: [AuthGuard] },
          { path: 'classification-dli-entry/:id', component: ClassificationDLIEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'vat-nonvat-list', component: VatNonVatComponent, canActivate: [AuthGuard],
        children: [
          { path: 'vat-nonvat-entry', component: VatNonVatEntryComponent, canActivate: [AuthGuard] },
          { path: 'vat-nonvat-entry/:id', component: VatNonVatEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'sales-invoicing-list', component: SalesInvoicingListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'sales-invoicing-entry', component: SalesInvoicingEntryComponent, canActivate: [AuthGuard] },
          { path: 'sales-invoicing-entry/:id', component: SalesInvoicingEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'delivered-to', component: DeliveredToComponent, canActivate: [AuthGuard]
      },
      {
        path: 'beg-bal-list', component: BeginningBalanceListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'beg-bal-entry', component: BeginningBalanceEntryComponent, canActivate: [AuthGuard] },
          { path: 'beg-bal-entry/:id', component: BeginningBalanceEntryComponent, canActivate: [AuthGuard] }
        ]
      },
    ]

  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class NikkoRoutingModule { }
