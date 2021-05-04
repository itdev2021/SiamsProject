import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductService } from 'src/app/service/inventory/product.service';
import { ProductEntryComponent } from '../product-entry/product-entry.component';
import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styles: []
})

export class ProductListComponent implements OnInit {

  constructor(private service: ProductService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService,
    public globalService: GlobalService,
    private router: Router) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ProductCode', 'Product', 'Classification', 'Category', 'UOMDescription', 'Active', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.globalService.getUserAccess(this.router.url);
    this.service.getProductList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'Active' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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

    const dialogRef = this.dialog.open(ProductEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });

  }

  onEdit(row: number) {
    this.service.getProductByID(row).subscribe(data => {
      this.service.formProduct.patchValue({
        ProductID: data.ProductID,
        ProductCode: data.ProductCode,
        Product: data.Product,
        ClassID: data.ClassID,
        CategoryID: data.CategoryID,
        PreparationID: data.PreparationID,
        WarehouseID: data.WarehouseID,
        UOMID: data.UOMID,
        AccountTitleID: data.AccountTitleID,
        ShelfLife: data.ShelfLife,
        MinimumStock: data.MinimumStock,
        MinimumOrder: data.MinimumOrder,
        SupplierID: data.SupplierID,
        UMCID: data.UMCID,
        CostMethodID: data.CostMethodID,
        PImage: data.PImage,
        PBarcode: data.PBarcode,
        Active: data.Active,
        BuyPrice: data.BuyPrice,
        SellPrice: data.SellPrice,
        iSTrade: data.iSTrade,
        CaseSize: data.CaseSize,
        DLIProductCode: data.DLIProductCode
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "60%";
      const dialogRef = this.dialog.open(ProductEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
      });
    });
  }

  onDelete(row,i) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.deleteProduct(row).subscribe(
            (res: any) => {
              this.notificationService.warn('! Deleted successfully');
              this.dataSource.data.splice(i, 1);
              this.dataSource.data = this.dataSource.data;
            });
        }
      });
  }

}
