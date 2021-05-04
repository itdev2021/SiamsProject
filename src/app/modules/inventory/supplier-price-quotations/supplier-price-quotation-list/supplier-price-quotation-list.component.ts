import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SupplierPriceQuotationService } from 'src/app/service/inventory/supplier-price-quotation.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-supplier-price-quotation-list',
  templateUrl: './supplier-price-quotation-list.component.html',
  styles: []
})
export class SupplierPriceQuotationListComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['PriceQuotationID', 'Supplier', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  constructor(private service: SupplierPriceQuotationService,
    private dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService,
    public globalService: GlobalService,) { }

  ngOnInit(): void {
    this.globalService.getUserAccess(this.router.url);
    this.refreshList();
  }

  refreshList() {
    this.service.getPriceQuotationList().subscribe(item => {
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
    this.router.navigate(['/supplier-quotation']);
  }

  onEdit(row: number) {
    console.log(row);
    this.router.navigate(['/supplier-quotation/'+row]);
  }

  onDelete(row,i) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.deletePriceQuotation(row).subscribe(
            (res: any) => {
              this.notificationService.warn('! Deleted successfully');
              this.dataSource.data.splice(i, 1);
              this.dataSource.data = this.dataSource.data;
            });
        }
      });
  }

}
