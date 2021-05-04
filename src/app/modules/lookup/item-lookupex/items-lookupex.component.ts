import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ProductService } from 'src/app/service/inventory/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ItemLookupService } from 'src/app/service/lookup/item-lookup.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-items-lookupex',
  templateUrl: './items-lookupex.component.html',
  styles: []
})
export class ItemsLookupexComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ProductCode', 'Product', 'UOMDescription', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public itemService: ProductService,
    public itemLookupService: ItemLookupService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.itemService.getProductList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'ProductCode' && ele != 'UOMDescription' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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

  onAddItem(row, i): void {
    this.itemLookupService.getItemRow(this.data, row)
    if (this.searchKey != "") {
      this.dataSource.data.splice(i, 1);
      this.dataSource.data = this.dataSource.data;

    } else {
      this.dataSource.filteredData.splice(i, 1);
      this.dataSource.data = this.dataSource.data;
    }

  }

}
