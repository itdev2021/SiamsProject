import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CostUnitService } from 'src/app/service/lookup/cost-unit.service';
import { WithdrawalService } from 'src/app/service/inventory/transaction/withdrawal.service';
import { PayableVourcherService } from 'src/app/service/purchasing/transaction/payable-vourcher.service';
import { OtherPayableVourcherService } from 'src/app/service/purchasing/transaction/other-payable-vourcher.service';
import { DisbursementDPService } from 'src/app/service/disbursement/transaction/disbursementdp.service';
import { IDSService } from 'src/app/service/disbursement/transaction/ids.service';
import { OtherDisbursementService } from 'src/app/service/disbursement/transaction/other-disbursement.service';
import { DeliveryReceiptService } from 'src/app/service/sales/transaction/delivery-receipt.service';

@Component({
  selector: 'app-cost-unit',
  templateUrl: './cost-unit.component.html',
  styles: []
})
export class CostUnitComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['CostUnit', 'EmployeeName', 'Division', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public service: CostUnitService,
    public wsService: WithdrawalService,
    public pvService: PayableVourcherService,
    public opvService: OtherPayableVourcherService,
    public ddpService: DisbursementDPService,
    public idsService: IDSService,
    public odService: OtherDisbursementService,
    public drService:DeliveryReceiptService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'Division' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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
    if (this.data == 'WS')
      this.wsService.getPatchCostUnit(row);
    else if (this.data[0] == 'PV')
      this.pvService.getPatchCostUnit(row, this.data[1], this.data[2]);
    else if (this.data[0] == 'OPV')
      this.opvService.getPatchCostUnit(row, this.data[1], this.data[2]);
    else if (this.data[0] == 'DDP')
      this.ddpService.getPatchCostUnit(row);
    else if (this.data[0] == 'IDS')
      this.idsService.getPatchCostUnit(row, this.data[1]);
    else if (this.data[0] == 'OD')
      this.odService.getPatchCostUnit(row, this.data[1]);
      else if (this.data[0] == 'DR')
        this.drService.getPatchCostUnit(row);
  }

}
