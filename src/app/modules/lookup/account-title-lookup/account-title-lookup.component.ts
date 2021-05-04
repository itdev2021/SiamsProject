import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PayableVourcherService } from 'src/app/service/purchasing/transaction/payable-vourcher.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { OtherPayableVourcherService } from 'src/app/service/purchasing/transaction/other-payable-vourcher.service';
import { PurchaseReturnService } from 'src/app/service/purchasing/transaction/purchase-return.service';
import { DisbursementService } from 'src/app/service/disbursement/transaction/disbursement.service';
import { DisbursementFATService } from 'src/app/service/disbursement/transaction/disbursementfat.service';
import { DisbursementDPService } from 'src/app/service/disbursement/transaction/disbursementdp.service';
import { IDSService } from 'src/app/service/disbursement/transaction/ids.service';
import { OtherDisbursementService } from 'src/app/service/disbursement/transaction/other-disbursement.service';
import { ReceivingReceiptService } from 'src/app/service/purchasing/transaction/receiving-receipt.service';

@Component({
  selector: 'app-account-title-lookup',
  templateUrl: './account-title-lookup.component.html',
  styles: []
})
export class AccountTitleLookupComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['AccountTitleID', 'Code', 'AccountTitle', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public service: AccountTitleService,
    public rrService:ReceivingReceiptService,
    public pvService: PayableVourcherService,
    public opvService: OtherPayableVourcherService,
    public purchaseReturnService: PurchaseReturnService,
    public cashDisbursementService: DisbursementService,
    public disbursmentFroAdvsToService: DisbursementFATService,
    public disbursmentDPService: DisbursementDPService,
    public idsService: IDSService,
    public odService: OtherDisbursementService,
  ) {

  }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getAccountTitleList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'AccountTitleID' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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

  onAddItem(row): void {
    if (this.data[0] == "RR")
      this.rrService.getPatchAccountTitle(row, this.data[1], this.data[2], this.data[3]);
    else if (this.data[0] == "PV")
      this.pvService.getPatchAccountTitle(row, this.data[1], this.data[2]);
    else if (this.data[0] == "OPV")
      this.opvService.getPatchAccountTitle(row, this.data[1], this.data[2]);
    else if (this.data[0] == "SR")
      this.purchaseReturnService.getPatchAccountTitle(row, this.data[1], this.data[2], this.data[3]);
    else if (this.data[0] == "DV")
      this.cashDisbursementService.getPatchAccountTitle(row, this.data[1], this.data[2]);
    else if (this.data[0] == "DFAT")
      this.disbursmentFroAdvsToService.getPatchAccountTitle(row, this.data[1], this.data[2], this.data[3]);
    else if (this.data[0] == "DDP")
      this.disbursmentDPService.getPatchAccountTitle(row, this.data[1]);
    else if (this.data[0] == "IDS")
      this.idsService.getPatchAccountTitle(row, this.data[1]);
    else if (this.data[0] == "OD")
      this.odService.getPatchAccountTitle(row, this.data[1]);

  }

}
