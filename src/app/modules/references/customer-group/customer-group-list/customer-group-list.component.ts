import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CustomerGroupService } from 'src/app/service/references/customer-group.service';
import { CustomerGroupEntryComponent } from '../customer-group-entry/customer-group-entry.component';



@Component({
  selector: 'app-customer-group-list',
  templateUrl: './customer-group-list.component.html',
  styles: []
})
export class CustomerGroupComponent implements OnInit {

  constructor(private service: CustomerGroupService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['CustomerGroupID', 'CustomerGroupCode','CustomerGroupName', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    this.refreshList();
  }

  refreshList() {
    this.service.getList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      };
    });
  }

  onAdd() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "30%";

    const dialogRef = this.dialog.open(CustomerGroupEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  onEdit(row: number) {
    this.service.getByID(row).subscribe(data => {
      this.service.formCustomerGroup.patchValue({
        CustomerGroupID: data.CustomerGroupID,
        CustomerGroupCode: data.CustomerGroupCode,
        CustomerGroupName: data.CustomerGroupName
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "30%";

      const dialogRef = this.dialog.open(CustomerGroupEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
        this.onSearchClear();
      });
    });
  }

  onDelete(row: number) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.delete(row).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully!');
              this.refreshList();
              this.onSearchClear();
            });
        }
      });
  }

}
