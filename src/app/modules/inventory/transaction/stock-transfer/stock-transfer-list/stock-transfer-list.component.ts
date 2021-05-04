import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { StockTransferService } from 'src/app/service/inventory/transaction/stock-transfer.service';
import { GlobalService } from 'src/app/service/global.service';
import { StockTransferEntryComponent } from '../stock-transfer-entry/stock-transfer-entry.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-stock-transfer-list',
  templateUrl: './stock-transfer-list.component.html',
  styles: []
})
export class StockTransferListComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['STSID', 'STSDate', 'ReferenceNo', 'FromWarehouse', 'ToWarehouse', 'Amount', 'Status', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  purchasePrintInfo;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);

  constructor(
    private service: StockTransferService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.refreshList();
  }

  refreshList() {
    this.service.getList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'ReferenceNo' && ele != 'Amount' && ele != 'ReferenceNo' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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

  onAdd() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "100%";

    const dialogRef = this.dialog.open(StockTransferEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  onEdit(id: number) {
    this.service.getInfo(id);
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "100%";
      dialogConfig.data = id;

      const dialogRef = this.dialog.open(StockTransferEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (this.searchKey)
          this.applyFilter();
        else
          this.refreshList();
      });
  }

  onApprove(id) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to approve this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.updateStatus(parseInt(id), '/sts/updateStatus/Approved/').subscribe(
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
          this.service.updateStatus(parseInt(id), '/sts/updateStatus/Cancelled/').subscribe(
            (res: any) => {
              this.notificationService.success('Cancelled successfully!');
              this.refreshList();
            });
        }
      });
  }

  onUnpost(id) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to un-post this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.updateStatus(parseInt(id), '/sts/updateStatus/Unpost/').subscribe(
            (res: any) => {
              this.notificationService.success('Un-posted successfully!');
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
