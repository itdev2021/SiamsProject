import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { AccountTitleEntryComponent } from '../account-title-entry/account-title-entry.component';

@Component({
  selector: 'app-account-title-list',
  templateUrl: './account-title-list.component.html',
  styles: []
})
export class AccountTitleListComponent implements OnInit {

  constructor(private service: AccountTitleService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Code', 'AccountTitle','actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

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
          return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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
    this.service.initializeFormGroup();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(AccountTitleEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  onEdit(row: number) {
    this.service.getAccountTitleByID(row).subscribe(data => {
      this.service.formAccountTitle.patchValue({
        AccountTitleID: data.AccountTitleID,
        Code: data.Code,
        AccountTitle: data.AccountTitle
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";

      const dialogRef = this.dialog.open(AccountTitleEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
      });
    });
  }

  onDelete(row: number) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.deleteAccountTitle(row).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully!');
              this.dataSource.data.forEach(item => {
                let index: number = this.dataSource.data.findIndex(d => d === item);
                console.log(this.dataSource.data.findIndex(d => d === item));
                this.dataSource.data.splice(index, 1)
                this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.dataSource.filterPredicate = (data, filter) => {
                  return this.displayedColumns.some(ele => {
                    return data[ele].toLowerCase().indexOf(filter) != -1;
                  });
                };
              });
            });
          this.notificationService.warn('Deleted successfully!');          
        }
      });
  }
}
