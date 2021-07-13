import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WithdrawalService } from 'src/app/service/inventory/transaction/withdrawal.service';
import { DeliveredToService } from 'src/app/service/lookup/delivered-to.service';
import { PayableVourcherService } from 'src/app/service/purchasing/transaction/payable-vourcher.service';
import { OtherPayableVourcherService } from 'src/app/service/purchasing/transaction/other-payable-vourcher.service';
import { PurchaseReturnService } from 'src/app/service/purchasing/transaction/purchase-return.service';
import { DisbursementService } from 'src/app/service/disbursement/transaction/disbursement.service';
import { DisbursementFATService } from 'src/app/service/disbursement/transaction/disbursementfat.service';
import { DisbursementDPService } from 'src/app/service/disbursement/transaction/disbursementdp.service';
import { IDSService } from 'src/app/service/disbursement/transaction/ids.service';
import { OtherDisbursementService } from 'src/app/service/disbursement/transaction/other-disbursement.service';
import { ReceivingReceiptService } from 'src/app/service/purchasing/transaction/receiving-receipt.service';
import { PurchaseService } from 'src/app/service/purchasing/transaction/purchase.service';
import { DeliveryReceiptService } from 'src/app/service/sales/transaction/delivery-receipt.service';
import { SalesInvoicingService } from 'src/app/service/sales/transaction/sales-invoicing.service';

@Component({
  selector: 'app-delivered-to',
  templateUrl: './delivered-to.component.html',
  styles: []
})
export class DeliveredToComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['PayToID', 'PayTo', 'PayToType', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  headerTitle = "Delivered To"

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public service: DeliveredToService,
    public poService: PurchaseService,
    public rrService: ReceivingReceiptService,
    public wsService: WithdrawalService,
    public pvService: PayableVourcherService,
    public opvService: OtherPayableVourcherService,
    public srService: PurchaseReturnService,
    public dvService: DisbursementService,
    public dfatService: DisbursementFATService,
    public ddpService: DisbursementDPService,
    public idsService: IDSService,
    public odService: OtherDisbursementService,
    public drService: DeliveryReceiptService,
    public siservice: SalesInvoicingService) {

  }

  ngOnInit(): void {
    this.refreshList();
    if (this.data == "PO")
      this.headerTitle = "Supplier";
    else if (this.data == "RR")
      this.headerTitle = "Supplier";
    else if (this.data == "WS")
      this.headerTitle = "Delivered To";
    else if (this.data == "PV")
      this.headerTitle = "Supplier";
    else if (this.data == "OPV")
      this.headerTitle = "Supplier";
    else if (this.data == "SR")
      this.headerTitle = "Supplier";
    else if (this.data == "DV")
      this.headerTitle = "Supplier";
    else if (this.data == "DFAT")
      this.headerTitle = "Supplier";
    else if (this.data == "DDP")
      this.headerTitle = "Supplier";
    else if (this.data == "IDS")
      this.headerTitle = "Payable To";
    else if (this.data == "DDPDetail")
      this.headerTitle = "Account Name";
    else if (this.data == "OD")
      this.headerTitle = "Payable To";
    else if (this.data == "DR")
      this.headerTitle = "Delivered To";
    else if (this.data == "SI")
      this.headerTitle = "Delivered To";

  }

  refreshList() {
    this.service.getList().subscribe(item => {
      const listArray = [...item.supplier, ...item.customer, ...item.employee];
      // const res = listArray.filter(i => i.PayToType == (this.data != 'WS' ? 'Supplier' : ''));

      this.dataSource = new MatTableDataSource(listArray);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'deliveredID' && ele != 'actions' && (ele == 'PayTo' ? data[ele].toLowerCase().indexOf(filter) != -1 : '');
        });
      };
    });
  }


  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onAddItem(row, i): void {
    if (this.data == "PO")
      this.poService.getPatchDelivered(row);
    else if (this.data == "RR")
      this.rrService.getPatchDelivered(row);
    else if (this.data == "WS")
      this.wsService.getPatchDelivered(row);
    else if (this.data == "PV")
      this.pvService.getPatchDelivered(row);
    else if (this.data == "OPV")
      this.opvService.getPatchDelivered(row);
    else if (this.data == "SR")
      this.srService.getPatchSupplier(row);
    else if (this.data == "DV")
      this.dvService.getPatchSupplier(row);
    else if (this.data == "DFAT")
      this.dfatService.getPatchSupplier(row);
    else if (this.data == "DDP")
      this.ddpService.getPatchSupplier(row);
    else if (this.data == "IDS")
      this.idsService.getPatchSupplier(row);
    else if (this.data[0] == "IDSDetail")
      this.idsService.getPatchSupplierDetail(row, this.data[1]);
    else if (this.data == "OD")
      this.odService.getPatchSupplier(row);
    else if (this.data == "DR")
      this.drService.getPatchCustomer(row);
    else if (this.data == "SI")
      this.siservice.getPatchCustomer(row);

  }

}
