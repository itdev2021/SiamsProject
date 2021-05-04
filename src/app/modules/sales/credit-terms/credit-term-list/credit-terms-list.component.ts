import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CreditTermsService } from 'src/app/service/references/credit-terms.service';
import { CreditTermsEntryComponent } from '../credit-terms-entry/credit-terms-entry.component';

@Component({
  selector: 'app-credit-terms-list',
  templateUrl: './credit-terms-list.component.html',
  styles: []
})
export class CreditTermsListComponent implements OnInit {

  constructor(private service: CreditTermsService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['CreditTermsID','CreditTerms','Days','actions'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchKey: string;

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
          return ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
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

    const dialogRef = this.dialog.open(CreditTermsEntryComponent, dialogconfig);
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
    this.service.getByID(row).subscribe(data => {
      this.service.formCreditTerms.patchValue({
        CreditTermsID: data.CreditTermsID,
        CreditTerms: data.CreditTerms,
        Days: data.Days
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";

      const dialogRef = this.dialog.open(CreditTermsEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
      });
    });
  }

  onDelete(row: number){
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.delete(row).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully!');
              this.refreshList();
            });         
        }
      });
  }

}
