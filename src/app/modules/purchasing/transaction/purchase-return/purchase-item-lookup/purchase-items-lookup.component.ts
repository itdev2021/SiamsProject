import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ProductService } from 'src/app/service/inventory/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PurchaseReturnService } from 'src/app/service/purchasing/transaction/purchase-return.service';

@Component({
  selector: 'app-purchase-items-lookup',
  templateUrl: './purchase-items-lookup.component.html',
  styles: []
})
export class PurchaseItemsLookupComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ProductID', 'Product', 'UOMDescription', 'UnitCost', 'LotNo', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public purchaseItemService: PurchaseReturnService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    if (this.data[1]) {
      this.purchaseItemService.getSuplierRetrnItemList(this.data[0], this.data[1]).subscribe(item => {
        this.dataSource = new MatTableDataSource(item as []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele != 'ProductCode' && ele != 'UnitCost' && ele != 'UOMDescription' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
          });
        };
      });
    }
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onAddItem(row): void {
    this.purchaseItemService.getPatchPurchaseItem(row, this.data[2], this.data[3])
    // if (this.searchKey != "") {
    //   this.dataSource.data.splice(i, 1);
    //   this.dataSource.data = this.dataSource.data;

    // } else {
    //   this.dataSource.filteredData.splice(i, 1);
    //   this.dataSource.data = this.dataSource.data;
    // }

  }

}
