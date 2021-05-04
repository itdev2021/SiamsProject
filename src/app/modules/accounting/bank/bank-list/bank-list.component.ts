import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BankService } from 'src/app/service/accounting/bank.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { BankEntryComponent } from '../bank-entry/bank-entry.component';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styles: []
})
export class BankListComponent implements OnInit {

  constructor(private service: BankService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['AccountCode','BankName','actions'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchKey: string;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getBankList().subscribe(item => {
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

  onAdd(){
    this.service.initializeFormGroup();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(BankEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  onEdit(row: number){
    this.service.getBankByID(row).subscribe(data => {
      this.service.formBank.patchValue({
        BankID: data.BankID,
        AccountNumber: data.AccountNumber,
        AccountCode: data.AccountCode,
        BankName: data.BankName,
        Address: data.Address,
        AccountTitleID: data.AccountTitleID,
        CheckType: data.CheckType
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";

      const dialogRef = this.dialog.open(BankEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
      });
    });
  }

  onDelete(row: number){
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.deleteBank(row).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully!');
              this.refreshList();
            });         
        }
      });
  }

}
