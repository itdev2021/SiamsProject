import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ProductService } from 'src/app/service/inventory/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ItemLookupService } from 'src/app/service/lookup/item-lookup.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/service/sales/customer.service';
import { DeliveryReceiptService } from 'src/app/service/sales/transaction/delivery-receipt.service';

@Component({
  selector: 'app-shipadd-lookup',
  templateUrl: './shipadd-lookup.component.html',
  styles: []
})
export class ShipAddLookupComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ShipToCode', 'ShipAddress', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public service: CustomerService,
    public drService: DeliveryReceiptService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getCustomerShipAdd(this.data[1]).subscribe(item => {
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

  onAddItem(row): void {
    if (this.data[0] == "DR")
      this.drService.getPatchCustomerShipAdd(row);

  }

}
