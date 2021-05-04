import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { DisbursementDPService } from 'src/app/service/disbursement/transaction/disbursementdp.service';
import { GlobalService } from 'src/app/service/global.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DisbursementDPEntryComponent } from '../disbursement-dp-entry/disbursement-dp-entry.component';

@Component({
  selector: 'app-disbursement-dp-list',
  templateUrl: './disbursement-dp-list.component.html',
  styles: []
})
export class DisbursementDPListComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['CashDisbursementDPID', 'CheckNo', 'CashDisbursementDPDate', 'Supplier', 'TotalPayment', 'AccountTitleDebit', 'AccountTitleCredit', 'StatusCode', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  purchasePrintInfo;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);

  constructor(
    private service: DisbursementDPService,
    private supplierService: SupplierService,
    private router: Router,
    private dialog: MatDialog,
    public globalService: GlobalService,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.refreshList();
  }

  refreshList() {
    this.supplierService.getSupplierList().subscribe(supplier => {

      this.service.getList().subscribe(item => {

        const mergeById = (array1, array2) =>
          array1.map(itm => ({
            ...array2.find((i) => (i.SupplierID === itm.SupplierID) && item),
            ...itm
          }));

        let result = mergeById(item, supplier);

        this.dataSource = new MatTableDataSource(result as []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele != 'CashDisbursementDPDate' && ele != 'TotalPayment' && ele != 'Status' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
          });
        };
      });
    });
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onAdd() {
    this.service.formDDP.reset();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "100%";

    const dialogRef = this.dialog.open(DisbursementDPEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });

  }

  onEdit(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "100%";
    dialogConfig.data = id;
    this.dialog.open(DisbursementDPEntryComponent, dialogConfig).afterClosed().subscribe(res => {
      this.refreshList();
    });
  }

  onApprove(id) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to approve this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.updateStatus(parseInt(id), '/DisbursementDP/updateStatus/Approved/', 1).subscribe(
            (res: any) => {
              this.notificationService.success('Approved successfully!');
              this.refreshList();
            });
        }
      });
  }

  onCancel(id) {

    this.comfirmDialogService.openConfirmDialog('Are you sure to cancel this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.updateStatus(parseInt(id), '/DisbursementDP/updateStatus/Cancelled/', 0).subscribe(
            (res: any) => {
              this.notificationService.warn('Cancelled successfully!');
              this.refreshList();
            });
        }
      });
  }

  onUnpost(id) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to un-post this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.updateStatus(parseInt(id), '/DisbursementDP/updateStatus/Unpost/', -1).subscribe(
            (res: any) => {
              this.notificationService.warn('Un-posted successfully!');
              this.refreshList();
            });
        }
      });
  }

  onDelete(row, i) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.delete(row).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully !');
              this.dataSource.data.splice(i, 1);
              this.dataSource.data = this.dataSource.data;
            });
        }
      });
  }

}
