import { Injectable } from '@angular/core';
import { FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { SupplierPriceQuotationService } from '../inventory/supplier-price-quotation.service';
import { PrsService } from '../purchasing/transaction/prs.service';
import { PurchaseService } from '../purchasing/transaction/purchase.service';
import { WarehouseReceivingService } from '../inventory/transaction/warehouse-receiving.service';
import { StockTransferService } from '../inventory/transaction/stock-transfer.service';
import { WithdrawalService } from '../inventory/transaction/withdrawal.service';
import { ReceivingReceiptService } from '../purchasing/transaction/receiving-receipt.service';
import { UmcService } from '../references/umc.service';
import { DeliveryReceiptService } from '../sales/transaction/delivery-receipt.service';
import { SalesInvoicingService } from '../sales/transaction/sales-invoicing.service';
import { BeginningBalanceService } from '../accounting/adjustment-entry/beg-bal.service';

@Injectable({
  providedIn: 'root'
})
export class ItemLookupService {

  constructor(public priceQuotationService: SupplierPriceQuotationService,
    public umcservice: UmcService,
    public prsService: PrsService,
    public poService: PurchaseService,
    public wrService: WarehouseReceivingService,
    public stsService: StockTransferService,
    public wsService: WithdrawalService,
    public rrService: ReceivingReceiptService,
    public drService:DeliveryReceiptService,
    private fb: FormBuilder,
    public siservice: SalesInvoicingService,
    public bbservice: BeginningBalanceService) { }

  getItemRow(module, row) {

    if (module == "SPQ") {
      (<FormArray>this.priceQuotationService.formPriceQuatation.get('item')).push(
        this.fb.group({
          PriceQuotationDetailID: [0],
          PriceQuotationID: [0],
          ProductID: [row.ProductID],
          Product: [row.Product],
          UOMID: [row.UOMID],
          UOMDescription: [row.UOMDescription],
          UnitCost: [null, Validators.required]
        })
      );
    } else if (module == "PRS") {
      (<FormArray>this.prsService.formPRS.get('items')).push(
        this.fb.group({
          pkid: [0],
          PRSID: [0],
          Rownum: [0],
          ProductID: [row.ProductID],
          Product: [row.Product],
          UOMID: [row.UOMID],
          UOMDescription: [row.UOMDescription],
          Quantity: [null, Validators.required]
        })
      );
    } else if (module == "PO") {
      (<FormArray>this.poService.formPO.get('items')).push(
        this.fb.group({
          PurchaseOrderDetailID: [0],
          PurchaseOrderID: [0],
          Code: [row.ProductCode],
          ProductID: [row.ProductID],
          Product: [row.Product],
          UOMID: [row.UOMID],
          UOMDescription: [row.UOMDescription],
          Quantity: [1, Validators.required],
          UnitCost: [row.BuyPrice, Validators.required],
          Amount: [0],
          Particulars: ['']
        })
      );
    } else if (module == "WR") {
      (<FormArray>this.wrService.formWR.get('items')).push(
        this.fb.group({
          WRDID: [0],
          WRID: [0],
          Code: [row.ProductCode],
          ProductID: [row.ProductID],
          Product: [row.Product],
          UOMID: [row.UOMID],
          UOMDescription: [row.UOMDescription],
          Quantity: [1, Validators.required],
          UnitCost: [row.BuyPrice, Validators.required],
          Amount: [0],
          LotNo: ['', Validators.required],
          ExpiryDate: ['', Validators.required],
          ManufacturingDate: ['', Validators.required],
          Particulars: [''],
          SampleTaken: [0],
          SPG: [0],
          ControlNo: [''],
          AccountTitleIDDebit: [0, Validators.required],
          AccountTitleIDCredit: [0, Validators.required]
        })
      );
    } else if (module == "STS") {
      (<FormArray>this.stsService.formSTS.get('items')).push(
        this.fb.group({
          STSDID: [0],
          STSID: [0],
          Code: [row.ProductCode],
          ProductID: [row.ProductID],
          Product: [row.Product],
          UOMID: [row.UOMID],
          UOMDescription: [row.UOMDescription],
          Quantity: [0, Validators.required],
          UnitCost: [row.BuyPrice, Validators.required],
          Amount: [0],
          LotNo: ['', Validators.required],
          ExpiryDate: ['', Validators.required],
          ManufacturingDate: ['', Validators.required],
          Particulars: [''],
          AccountTitleIDDebit: [0, Validators.required],
          AccountTitleIDCredit: [0, Validators.required]
        })
      );
    } else if (module == "WS") {
      (<FormArray>this.wsService.formWS.get('items')).push(
        this.fb.group({
          WithdrawalSlipDetailID: [0],
          WithdrawalSlipID: [0],
          WarehouseID: ['', Validators.required],
          ProductID: [row.ProductID],
          Product: [row.Product],
          UOMID: [row.UOMID],
          UOMDescription: [row.UOMDescription],
          Quantity: [1, Validators.required],
          UnitCost: [row.BuyPrice, Validators.required],
          Amount: [0],
          LotNo: ['', Validators.required],
          ExpiryDate: ['', Validators.required],
          ManufacturingDate: ['', Validators.required],
          ControlNo: [''],
          AccountTitleIDDebit: ['', Validators.required],
          AccountTitleIDCredit: ['', Validators.required],
          IssuanceLotNo: ['']
        })
      );
    } 
    else if (module == "RR") {

    } 
    else if (module == "UMC") {
        this.umcservice.formUMConversion.patchValue({
          ProductCode: row.ProductCode,
          ProductDesc: row.Product
        });
    }else if(module == "DR"){
      this.drService.getItemRow(row);
    }
    else if (module == "SI"){
      this.siservice.getItemRow(row);
    }
    else if (module == 'BB'){
      this.bbservice.getItemRow(row);
    }
  }
}
