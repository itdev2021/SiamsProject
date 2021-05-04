import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from 'src/app/service/inventory/supplier.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierEntryComponent } from '../supplier-entry/supplier-entry.component';
import { GlobalService } from 'src/app/service/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styles: []
})
export class SupplierListComponent implements OnInit {

  constructor(private serviceSupplier: SupplierService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService,
    public globalService: GlobalService,
    private router: Router) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Code', 'Supplier', 'ContactNo', 'ContactPerson', 'EmailAdd', 'Active', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.refreshList();
  }

  refreshList() {
    this.serviceSupplier.getSupplierList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'actions' && ele != 'Active' && data[ele].toLowerCase().indexOf(filter) != -1;
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
    this.serviceSupplier.initializeFormGroup();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(SupplierEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  onEdit(row: number) {
    this.serviceSupplier.getSupplierByID(row).subscribe(data => {
      this.serviceSupplier.formSupplier.patchValue({
        SupplierID: data.SupplierID,
        Code: data.Code,
        Supplier: data.Supplier,
        StAddress: data.StAddress,
        CityTown: data.CityTown,
        Province: data.Province,
        ContactNo: data.ContactNo,
        ContactPerson: data.ContactPerson,
        EmailAdd: data.EmailAdd,
        Active: data.Active,
        EWT: data.EWT,
        InputVat: data.InputVat,
        TIN: data.TIN
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";

      const dialogRef = this.dialog.open(SupplierEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
      });
    });
  }

  onDelete(row: number) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.serviceSupplier.deleteSupplier(row).subscribe(
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
                    return ele != 'actions' && ele != 'Active' && data[ele].toLowerCase().indexOf(filter) != -1;
                  });
                };
              });
            });
          this.notificationService.warn('Deleted successfully!');
          
        }
      });
  }

}
