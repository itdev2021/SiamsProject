import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../layouts/default/default.component';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { ProductListComponent } from '../modules/inventory/products/product-list/product-list.component';
import { ProductEntryComponent } from '../modules/inventory/products/product-entry/product-entry.component';
import { WarehouseListComponent } from '../modules/inventory/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseEntryComponent } from '../modules/inventory/warehouses/warehouse-entry/warehouse-entry.component';
import { SupplierListComponent } from '../modules/inventory/suppliers/supplier-list/supplier-list.component';
import { SupplierEntryComponent } from '../modules/inventory/suppliers/supplier-entry/supplier-entry.component';
import { SupplierPriceQuotationListComponent } from '../modules/inventory/supplier-price-quotations/supplier-price-quotation-list/supplier-price-quotation-list.component';
import { SupplierPriceQuotationEntryComponent } from '../modules/inventory/supplier-price-quotations/supplier-price-quotation-entry/supplier-price-quotation-entry.component';
import { PrsListComponent } from '../modules/purchasing/transaction/prs/prs-list/prs-list.component';
import { PrsEntryComponent } from '../modules/purchasing/transaction/prs/prs-entry/prs-entry.component';
import { DesignationListComponent } from '../modules/inventory/designation/designation-list/designation-list.component';
import { DesignationEntryComponent } from '../modules/inventory/designation/designation-entry/designation-entry.component';
import { PurchaseListComponent } from '../modules/purchasing/transaction/purchase/purchase-list/purchase-list.component';
import { PurchasePrintComponent } from '../modules/purchasing/transaction/purchase/purchase-print/purchase-print.component';
import { PurchaseEntryComponent } from '../modules/purchasing/transaction/purchase/purchase-entry/purchase-entry.component';
import { WarehouseRecevingListComponent } from '../modules/inventory/transaction/warehouse-receving/warehouse-receving-list/warehouse-receving-list.component';
import { StockTransferListComponent } from '../modules/inventory/transaction/stock-transfer/stock-transfer-list/stock-transfer-list.component';
import { WarehouseRecevingEntryComponent } from '../modules/inventory/transaction/warehouse-receving/warehouse-receving-entry/warehouse-receving-entry.component';
import { StockTransferEntryComponent } from '../modules/inventory/transaction/stock-transfer/stock-transfer-entry/stock-transfer-entry.component';
import { WithdrawalListComponent } from '../modules/inventory/transaction/withdrawal/withdrawal-list/withdrawal-list.component';
import { WithdrawalEntryComponent } from '../modules/inventory/transaction/withdrawal/withdrawal-entry/withdrawal-entry.component';
import { ReceivingReceiptListComponent } from '../modules/purchasing/transaction/receiving-receipt/receiving-receipt-list/receiving-receipt-list.component';
import { ReceivingReceiptEntryComponent } from '../modules/purchasing/transaction/receiving-receipt/receiving-receipt-entry/receiving-receipt-entry.component';
import { PayableVoucherListComponent } from '../modules/purchasing/transaction/payable-voucher/payable-voucher-list/payable-voucher-list.component';
import { PayableVoucherEntryComponent } from '../modules/purchasing/transaction/payable-voucher/payable-voucher-entry/payable-voucher-entry.component';
import { NikkoRoutingModule } from './nikko-routing.module';
import { EmakRoutingModule } from './emak-routing.module';
import { OtherPayableVoucherListComponent } from '../modules/purchasing/transaction/other-payable-voucher/other-payable-voucher-list/other-payable-voucher-list.component';
import { OtherPayableVoucherEntryComponent } from '../modules/purchasing/transaction/other-payable-voucher/other-payable-voucher-entry/other-payable-voucher-entry.component';
import { PurchaseReturnListComponent } from '../modules/purchasing/transaction/purchase-return/purchase-return-list/purchase-return-list.component';
import { PurchaseReturnEntryComponent } from '../modules/purchasing/transaction/purchase-return/purchase-return-entry/purchase-return-entry.component';
import { CashDisbursementListComponent } from '../modules/disbursement/transaction/cash-disbursement/cash-disbursement-list/cash-disbursement-list.component';
import { CashDisbursementEntryComponent } from '../modules/disbursement/transaction/cash-disbursement/cash-disbursement-entry/cash-disbursement-entry.component';
import { DisbursementFromAdvsToListComponent } from '../modules/disbursement/transaction/disburment-from-advs-to/disbursement-from-advs-to-list/disbursement-from-advs-to-list.component';
import { DisbursementFromAdvsToEntryComponent } from '../modules/disbursement/transaction/disburment-from-advs-to/disbursement-from-advs-to-entry/disbursement-from-advs-to-entry.component';
import { DisbursementDPEntryComponent } from '../modules/disbursement/transaction/advancesto/disbursement-dp-entry/disbursement-dp-entry.component';
import { DisbursementDPListComponent } from '../modules/disbursement/transaction/advancesto/disbursement-dp-list/disbursement-dp-list.component';
import { IDSToListComponent } from '../modules/disbursement/transaction/ids/ids-list/ids-list.component';
import { IDSEntryComponent } from '../modules/disbursement/transaction/ids/ids-entry/ids-entry.component';
import { OtherDisbursementListComponent } from '../modules/disbursement/transaction/other-disbursement/other-disbursement-list/other-disbursement-list.component';
import { OtherDisbursementEntryComponent } from '../modules/disbursement/transaction/other-disbursement/other-disbursement-entry/other-disbursement-entry.component';
import { CreditTermsListComponent } from '../modules/sales/credit-terms/credit-term-list/credit-terms-list.component';
import { CreditTermsEntryComponent } from '../modules/sales/credit-terms/credit-terms-entry/credit-terms-entry.component';
import { UserListComponent } from '../modules/user/registration/user-list/user-list.component';
import { UserEntryComponent } from '../modules/user/registration/user-entry/user-entry.component';
import { LoginComponent } from '../modules/user/login/login.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserPermissionEntryComponent } from '../modules/user/registration/permission/user-permission-entry.component';
import { CustomerListComponent } from '../modules/sales/customer/customer-list/customer-list.component';
import { CustomerEntryComponent } from '../modules/sales/customer/customer-entry/customer-entry.component';
import { HomeComponent } from '../layouts/home/home.component';
import { DeliveryReceiptListComponent } from '../modules/sales/transaction/delivery-receipt/delivery-receipt-list/delivery-receipt-list.component';
import { DeliveryReceiptEntryComponent } from '../modules/sales/transaction/delivery-receipt/delivery-receipt-entry/delivery-receipt-entry.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

      { path: 'user', component: UserEntryComponent, canActivate: [AuthGuard] },
      { path: 'user-permission', component: UserPermissionEntryComponent, canActivate: [AuthGuard] },
      { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
      {
        path: 'products', component: ProductListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'product', component: ProductEntryComponent, canActivate: [AuthGuard] },
          { path: 'product/:id', component: ProductEntryComponent, canActivate: [AuthGuard] }
        ]
      },

      {
        path: 'warehouse-list', component: WarehouseListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'warehouse', component: WarehouseEntryComponent, canActivate: [AuthGuard] },
          { path: 'warehouse/:id', component: WarehouseEntryComponent, canActivate: [AuthGuard] }
        ]
      },

      {
        path: 'supplier-list', component: SupplierListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'supplier', component: SupplierEntryComponent, canActivate: [AuthGuard] },
          { path: 'supplier/:id', component: SupplierEntryComponent, canActivate: [AuthGuard] }
        ]
      },

      { path: 'supplier-quotation-list', component: SupplierPriceQuotationListComponent, canActivate: [AuthGuard] },
      { path: 'supplier-quotation', component: SupplierPriceQuotationEntryComponent, canActivate: [AuthGuard] },
      { path: 'supplier-quotation/:id', component: SupplierPriceQuotationEntryComponent, canActivate: [AuthGuard] },

      { path: 'prs-list', component: PrsListComponent, canActivate: [AuthGuard] },
      { path: 'prs-entry', component: PrsEntryComponent, canActivate: [AuthGuard] },
      { path: 'prs-entry/:id', component: PrsEntryComponent, canActivate: [AuthGuard] },

      {
        path: 'designation-list', component: DesignationListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'designation', component: DesignationEntryComponent, canActivate: [AuthGuard] },
          { path: 'designation/:id', component: DesignationEntryComponent, canActivate: [AuthGuard] }
        ]
      },

      {
        path: 'purchase-list', component: PurchaseListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'purchase-print/:id', component: PurchasePrintComponent, canActivate: [AuthGuard] }
        ]
      },
      { path: 'purchase-entry', component: PurchaseEntryComponent, canActivate: [AuthGuard] },
      { path: 'purchase-entry/:id', component: PurchaseEntryComponent, canActivate: [AuthGuard] },
      { path: 'purchase-print/:id', component: PurchasePrintComponent, canActivate: [AuthGuard] },

      { path: 'warehouse-receiving-list', component: WarehouseRecevingListComponent, canActivate: [AuthGuard] },
      { path: 'warehouse-receiving-entry', component: WarehouseRecevingEntryComponent, canActivate: [AuthGuard] },
      { path: 'warehouse-receiving-entry/:id', component: WarehouseRecevingEntryComponent, canActivate: [AuthGuard] },

      { path: 'stock-transfer-list', component: StockTransferListComponent, canActivate: [AuthGuard] },
      { path: 'stock-transfer-entry', component: StockTransferEntryComponent, canActivate: [AuthGuard] },
      { path: 'stock-transfer-entry/:id', component: StockTransferEntryComponent, canActivate: [AuthGuard] },

      { path: 'withdrawal-list', component: WithdrawalListComponent, canActivate: [AuthGuard] },
      { path: 'withdrawal-entry', component: WithdrawalEntryComponent, canActivate: [AuthGuard] },
      { path: 'withdrawal-entry/:id', component: WithdrawalEntryComponent, canActivate: [AuthGuard] },

      { path: 'receiving-receipt-list', component: ReceivingReceiptListComponent, canActivate: [AuthGuard] },
      { path: 'receiving-receipt-entry', component: ReceivingReceiptEntryComponent, canActivate: [AuthGuard] },
      { path: 'receiving-receipt-entry/:id', component: ReceivingReceiptEntryComponent, canActivate: [AuthGuard] },

      { path: 'payable-voucher-list', component: PayableVoucherListComponent, canActivate: [AuthGuard] },
      { path: 'payable-voucher-entry', component: PayableVoucherEntryComponent, canActivate: [AuthGuard] },
      { path: 'payable-voucher-entry/:id', component: PayableVoucherEntryComponent, canActivate: [AuthGuard] },

      { path: 'other-payable-voucher-list', component: OtherPayableVoucherListComponent, canActivate: [AuthGuard] },
      { path: 'other-payable-voucher-entry', component: OtherPayableVoucherEntryComponent, canActivate: [AuthGuard] },
      { path: 'other-payable-voucher-entry/:id', component: OtherPayableVoucherEntryComponent, canActivate: [AuthGuard] },

      { path: 'purchase-return-list', component: PurchaseReturnListComponent, canActivate: [AuthGuard] },
      { path: 'purchase-return-entry', component: PurchaseReturnEntryComponent, canActivate: [AuthGuard] },
      { path: 'purchase-return-entry/:id', component: PurchaseReturnEntryComponent, canActivate: [AuthGuard] },

      { path: 'cash-disbursement-list', component: CashDisbursementListComponent, canActivate: [AuthGuard] },
      { path: 'cash-disbursement-entry', component: CashDisbursementEntryComponent, canActivate: [AuthGuard] },
      { path: 'cash-disbursement-entry/:id', component: CashDisbursementEntryComponent, canActivate: [AuthGuard] },

      { path: 'disbursement-from-advs-to-list', component: DisbursementFromAdvsToListComponent, canActivate: [AuthGuard] },
      { path: 'disbursement-from-advs-to-entry', component: DisbursementFromAdvsToEntryComponent, canActivate: [AuthGuard] },
      { path: 'disbursement-from-advs-to-entry/:id', component: DisbursementFromAdvsToEntryComponent, canActivate: [AuthGuard] },

      { path: 'disbursement-advs-to-list', component: DisbursementDPListComponent, canActivate: [AuthGuard] },
      { path: 'disbursement-advs-to-entry', component: DisbursementDPEntryComponent, canActivate: [AuthGuard] },
      { path: 'disbursement-advs-to-entry/:id', component: DisbursementFromAdvsToEntryComponent, canActivate: [AuthGuard] },

      { path: 'ids-list', component: IDSToListComponent, canActivate: [AuthGuard] },
      { path: 'ids-entry', component: IDSEntryComponent, canActivate: [AuthGuard] },
      { path: 'ids-entry/:id', component: IDSEntryComponent, canActivate: [AuthGuard] },

      { path: 'other-disbursement-list', component: OtherDisbursementListComponent, canActivate: [AuthGuard] },
      { path: 'other-disbursement-entry', component: OtherDisbursementEntryComponent, canActivate: [AuthGuard] },
      { path: 'other-disbursement-entry/:id', component: OtherDisbursementEntryComponent, canActivate: [AuthGuard] },

      {
        path: 'credit-terms-list', component: CreditTermsListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'credit-terms', component: CreditTermsEntryComponent, canActivate: [AuthGuard] },
          { path: 'credit-terms/:id', component: CreditTermsEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'customer-list', component: CustomerListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'customer', component: CustomerEntryComponent, canActivate: [AuthGuard] },
          { path: 'customer.:id', component: CustomerEntryComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'delivery-receipt-list', component: DeliveryReceiptListComponent, canActivate: [AuthGuard],
        children: [
          { path: 'delivery-receipt-entry', component: DeliveryReceiptEntryComponent, canActivate: [AuthGuard] },
          { path: 'delivery-receipt-entry.:id', component: DeliveryReceiptEntryComponent, canActivate: [AuthGuard] }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    NikkoRoutingModule,
    EmakRoutingModule
  ],
  exports: [RouterModule]
})
export class PrandyRoutingModule { }
