import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalesInvoicingService } from 'src/app/service/sales/transaction/sales-invoicing.service';

@Component({
  selector: 'app-sales-invoicing-item',
  templateUrl: './sales-invoicing-item.component.html',
  styles: []
})
export class SalesInvoicingItemComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ProductCode', 'Product','UOMDescription','LotNo','QtyRemaining', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public siService: SalesInvoicingService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.siService.getBBProductList(this.data).subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'QtyRemaining' && ele != 'Product' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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
    this.siService.getItemRow(row)
    if (this.searchKey != "") {
      this.dataSource.data.splice(i, 1);
      this.dataSource.data = this.dataSource.data;
      
    } else {
      this.dataSource.filteredData.splice(i, 1);
      this.dataSource.data = this.dataSource.data;
    }

  }

}
