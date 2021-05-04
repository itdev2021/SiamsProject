import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { GlobalService } from 'src/app/service/global.service';
import { ProductService } from 'src/app/service/inventory/product.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UmcService } from 'src/app/service/references/umc.service';
import { UMConversionEntryComponent } from '../um-conversion-entry/um-conversion-entry.component';



@Component({
  selector: 'app-um-conversion-list',
  templateUrl: './um-conversion-list.component.html',
  styles: []
})
export class UMConversionComponent implements OnInit {

  ProductDesc = [];

  constructor(private service: UmcService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService,
    private productService: ProductService) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ProductCode', 'Product', 'actions']
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    this.refreshList();
  }

  refreshList() {
    this.productService.getProductList().subscribe(product => {
      this.service.getList().subscribe(item => {
        const mergeById = (array1, array2) =>
          array1.map(itm => ({
            ...array2.find((i) => (i.ProductCode === itm.ProductCode) && item),
          }));

        let result = mergeById(item, product);

        this.dataSource = new MatTableDataSource(result as []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
          });
        };
      });
    });
  }

  onAdd() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(UMConversionEntryComponent, dialogconfig);
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

  onEdit(id: string) {
    this.service.getInfo(id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = id;

    const dialogRef = this.dialog.open(UMConversionEntryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (this.searchKey)
        this.applyFilter();
      else
        this.refreshList();
    });
  }

  onDelete(id: string) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.delete(id).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully!');
              this.refreshList();
              this.onSearchClear();
            });
        }
      });
  }

}
