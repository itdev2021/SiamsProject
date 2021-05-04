import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultComponent } from '../layouts/default/default.component';
import { TopNavComponent } from '../layouts/top-nav/top-nav.component';
import { MenuListItemComponent } from '../layouts/menu-list-item/menu-list-item.component';
import { HomeComponent } from '../layouts/home/home.component';

import { NavMenuComponent } from '../layouts/nav-menu/nav-menu.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { PostComponent } from 'src/app/modules/post/post.component';

// ******************* COMMON ****************** \\ 
import { ConfirmDialogComponent } from 'src/app/modules/confirm-dialog/confirm-dialog.component';
import { CustomerComponent } from '../modules/lookup/customer/customer.component';
import { SupplierLookupComponent } from '../modules/lookup/supplier-lookup/supplier-lookup.component';
import { DeliveredToComponent } from '../modules/lookup/delivered-to/delivered-to.component';
import { CostUnitComponent } from '../modules/lookup/cost-unit/cost-unit.component';
import { ItemsLookupComponent } from '../modules/lookup/items-lookup/items-lookup.component';
import { ShipAddLookupComponent } from '../modules/lookup/shipadd-lookup/shipadd-lookup.component';

// ******************* USER ****************** \\ 
import { LoginComponent } from '../modules/user/login/login.component';
import { UserListComponent } from '../modules/user/registration/user-list/user-list.component';
import { UserEntryComponent } from '../modules/user/registration/user-entry/user-entry.component';
import { UserPermissionEntryComponent } from '../modules/user/registration/permission/user-permission-entry.component';

// ******************* INVENTORY ****************** \\ 
import { ProductListComponent } from 'src/app/modules/inventory/products/product-list/product-list.component';
import { ProductEntryComponent } from 'src/app/modules/inventory/products/product-entry/product-entry.component';
import { WarehouseListComponent } from 'src/app/modules/inventory/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseEntryComponent } from 'src/app/modules/inventory/warehouses/warehouse-entry/warehouse-entry.component';
import { SupplierListComponent } from 'src/app/modules/inventory/suppliers/supplier-list/supplier-list.component';
import { SupplierEntryComponent } from 'src/app/modules/inventory/suppliers/supplier-entry/supplier-entry.component';
import { SupplierPriceQuotationListComponent } from 'src/app/modules/inventory/supplier-price-quotations/supplier-price-quotation-list/supplier-price-quotation-list.component';
import { SupplierPriceQuotationEntryComponent } from 'src/app/modules/inventory/supplier-price-quotations/supplier-price-quotation-entry/supplier-price-quotation-entry.component';
import { DesignationEntryComponent } from '../modules/inventory/designation/designation-entry/designation-entry.component';
import { DesignationListComponent } from '../modules/inventory/designation/designation-list/designation-list.component';
// Transaction \\
import { WarehouseRecevingListComponent } from '../modules/inventory/transaction/warehouse-receving/warehouse-receving-list/warehouse-receving-list.component';
import { WarehouseRecevingEntryComponent } from '../modules/inventory/transaction/warehouse-receving/warehouse-receving-entry/warehouse-receving-entry.component';
import { StockTransferListComponent } from '../modules/inventory/transaction/stock-transfer/stock-transfer-list/stock-transfer-list.component';
import { StockTransferEntryComponent } from '../modules/inventory/transaction/stock-transfer/stock-transfer-entry/stock-transfer-entry.component';
import { WithdrawalListComponent } from '../modules/inventory/transaction/withdrawal/withdrawal-list/withdrawal-list.component';
import { WithdrawalEntryComponent } from '../modules/inventory/transaction/withdrawal/withdrawal-entry/withdrawal-entry.component';

// ******************* PURCHASING ****************** \\ 
import { PrsListComponent } from 'src/app/modules/purchasing/transaction/prs/prs-list/prs-list.component';
import { PrsEntryComponent } from 'src/app/modules/purchasing/transaction/prs/prs-entry/prs-entry.component';
import { PurchaseEntryComponent } from '../modules/purchasing/transaction/purchase/purchase-entry/purchase-entry.component';
import { PurchaseListComponent } from '../modules/purchasing/transaction/purchase/purchase-list/purchase-list.component';
import { PurchasePrintComponent } from '../modules/purchasing/transaction/purchase/purchase-print/purchase-print.component';
import { ReceivingReceiptListComponent } from '../modules/purchasing/transaction/receiving-receipt/receiving-receipt-list/receiving-receipt-list.component';
import { ReceivingReceiptEntryComponent } from '../modules/purchasing/transaction/receiving-receipt/receiving-receipt-entry/receiving-receipt-entry.component';
import { ReceivingItemComponent } from '../modules/purchasing/transaction/receiving-receipt/receiving-item/receiving-item.component';
import { PayableVoucherEntryComponent } from '../modules/purchasing/transaction/payable-voucher/payable-voucher-entry/payable-voucher-entry.component';
import { PayableVoucherListComponent } from '../modules/purchasing/transaction/payable-voucher/payable-voucher-list/payable-voucher-list.component';
import { MaterialModule } from './material.modules';
import { AccountTitleLookupComponent } from '../modules/lookup/account-title-lookup/account-title-lookup.component';
import { OtherPayableVoucherListComponent } from '../modules/purchasing/transaction/other-payable-voucher/other-payable-voucher-list/other-payable-voucher-list.component';
import { OtherPayableVoucherEntryComponent } from '../modules/purchasing/transaction/other-payable-voucher/other-payable-voucher-entry/other-payable-voucher-entry.component';
import { PurchaseReturnListComponent } from '../modules/purchasing/transaction/purchase-return/purchase-return-list/purchase-return-list.component';
import { PurchaseReturnEntryComponent } from '../modules/purchasing/transaction/purchase-return/purchase-return-entry/purchase-return-entry.component';
import { PurchaseItemsLookupComponent } from '../modules/purchasing/transaction/purchase-return/purchase-item-lookup/purchase-items-lookup.component';

// ******************* DISBURSEMENT ****************** \\
import { CashDisbursementListComponent } from '../modules/disbursement/transaction/cash-disbursement/cash-disbursement-list/cash-disbursement-list.component';
import { CashDisbursementEntryComponent } from '../modules/disbursement/transaction/cash-disbursement/cash-disbursement-entry/cash-disbursement-entry.component';
import { DVReferenceLookupComponent } from '../modules/disbursement/transaction/cash-disbursement/reference-lookup/dv-reference-lookup.component';
import { CDVoucherPaymentComponent } from '../modules/disbursement/transaction/cash-disbursement/cd-voucher-payment/cd-voucher-payment.component';

import { DisbursementFromAdvsToEntryComponent } from '../modules/disbursement/transaction/disburment-from-advs-to/disbursement-from-advs-to-entry/disbursement-from-advs-to-entry.component';
import { DisbursementFromAdvsToListComponent } from '../modules/disbursement/transaction/disburment-from-advs-to/disbursement-from-advs-to-list/disbursement-from-advs-to-list.component';
import { DFATReferenceLookupComponent } from '../modules/disbursement/transaction/disburment-from-advs-to/reference-lookup/dfat-reference-lookup.component';

import { DisbursementDPEntryComponent } from '../modules/disbursement/transaction/advancesto/disbursement-dp-entry/disbursement-dp-entry.component';
import { DisbursementDPListComponent } from '../modules/disbursement/transaction/advancesto/disbursement-dp-list/disbursement-dp-list.component';
import { AdvsLookupComponent } from '../modules/disbursement/transaction/disburment-from-advs-to/advs-lookup/advs-lookup.component';

import { IDSToListComponent } from '../modules/disbursement/transaction/ids/ids-list/ids-list.component';
import { IDSEntryComponent } from '../modules/disbursement/transaction/ids/ids-entry/ids-entry.component';
import { IDSReferenceLookupComponent } from '../modules/disbursement/transaction/ids/ids-reference-lookup/ids-reference-lookup.component';
import { OtherDisbursementListComponent } from '../modules/disbursement/transaction/other-disbursement/other-disbursement-list/other-disbursement-list.component';
import { OtherDisbursementEntryComponent } from '../modules/disbursement/transaction/other-disbursement/other-disbursement-entry/other-disbursement-entry.component';
import { OtherDisbursementReferenceLookupComponent } from '../modules/disbursement/transaction/other-disbursement/other-disbursement-reference-lookup/other-disbursement-reference-lookup.component';
import { DDPVoucherPaymentComponent } from '../modules/disbursement/transaction/advancesto/ddp-voucher-payment/ddp-voucher-payment.component';
import { ODVoucherPaymentComponent } from '../modules/disbursement/transaction/other-disbursement/od-voucher-payment/od-voucher-payment.component';
import { DFATVoucherPaymentComponent } from '../modules/disbursement/transaction/disburment-from-advs-to/dfat-voucher-payment/dfat-voucher-payment.component';

// ******************* SALES ****************** \\
import { CreditTermsListComponent } from '../modules/sales/credit-terms/credit-term-list/credit-terms-list.component';
import { CreditTermsEntryComponent } from '../modules/sales/credit-terms/credit-terms-entry/credit-terms-entry.component';
import { CustomerListComponent } from '../modules/sales/customer/customer-list/customer-list.component';
import { CustomerEntryComponent } from '../modules/sales/customer/customer-entry/customer-entry.component';
import { DeliveryReceiptEntryComponent } from '../modules/sales/transaction/delivery-receipt/delivery-receipt-entry/delivery-receipt-entry.component';
import { DeliveryReceiptListComponent } from '../modules/sales/transaction/delivery-receipt/delivery-receipt-list/delivery-receipt-list.component';






@NgModule({
  declarations: [
    DefaultComponent,
    // ******************* NAVIGATION ****************** \\ 
    TopNavComponent,
    MenuListItemComponent,
    HomeComponent,
    NavMenuComponent,
    DashboardComponent,
    PostComponent,
    // ******************* COMMON ****************** \\ 
    ItemsLookupComponent,
    CustomerComponent,
    SupplierLookupComponent,
    DeliveredToComponent,
    CostUnitComponent,
    ConfirmDialogComponent,
    ShipAddLookupComponent,
    // ******************* USER ****************** \\ 
    LoginComponent,
    UserListComponent,
    UserEntryComponent,
    UserPermissionEntryComponent,
    // ******************* INVENTORY ****************** \\ 
    ProductListComponent,
    ProductEntryComponent,
    WarehouseListComponent,
    WarehouseEntryComponent,
    SupplierListComponent,
    SupplierEntryComponent,
    SupplierPriceQuotationListComponent,
    SupplierPriceQuotationEntryComponent,
    DesignationEntryComponent,
    DesignationListComponent,
    // Transaction \\
    PrsListComponent,
    PrsEntryComponent,
    PurchaseEntryComponent,
    PurchasePrintComponent,
    PurchaseListComponent,
    WarehouseRecevingListComponent,
    WarehouseRecevingEntryComponent,
    StockTransferListComponent,
    StockTransferEntryComponent,
    WithdrawalListComponent,
    WithdrawalEntryComponent,

    // ******************* PURCHASING ****************** \\ 
    // Transaction \\
    ReceivingReceiptListComponent,
    ReceivingReceiptEntryComponent,
    ReceivingItemComponent,
    PayableVoucherListComponent,
    PayableVoucherEntryComponent,
    OtherPayableVoucherListComponent,
    OtherPayableVoucherEntryComponent,
    PurchaseReturnListComponent,
    PurchaseReturnEntryComponent,
    PurchaseItemsLookupComponent,

    AccountTitleLookupComponent,

    // ******************* DISBURSEMENT ****************** \\ 
    CashDisbursementEntryComponent,
    CashDisbursementListComponent,
    DVReferenceLookupComponent,
    CDVoucherPaymentComponent,

    DisbursementFromAdvsToEntryComponent,
    DisbursementFromAdvsToListComponent,
    DFATReferenceLookupComponent,
    DFATVoucherPaymentComponent,
    AdvsLookupComponent,

    DisbursementDPEntryComponent,
    DisbursementDPListComponent,
    DDPVoucherPaymentComponent,

    IDSToListComponent,
    IDSEntryComponent,
    IDSReferenceLookupComponent,

    OtherDisbursementListComponent,
    OtherDisbursementEntryComponent,
    OtherDisbursementReferenceLookupComponent,
    ODVoucherPaymentComponent,

    // ******************* DISBURSEMENT ****************** \\
    CreditTermsListComponent,
    CreditTermsEntryComponent,



    
    // ******************* SALES ****************** \\
    CustomerListComponent,
    CustomerEntryComponent,
    DeliveryReceiptListComponent,
    DeliveryReceiptEntryComponent,
    ShipAddLookupComponent,
    
  ],
  imports: [
    CommonModule,
    MaterialModule

  ],
  exports: [],
  providers: []
})
export class PrandySharedModule { }
