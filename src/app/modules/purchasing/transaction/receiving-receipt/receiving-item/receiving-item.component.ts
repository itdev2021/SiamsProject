import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ReceivingReceiptService } from 'src/app/service/purchasing/transaction/receiving-receipt.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-receiving-item',
  templateUrl: './receiving-item.component.html',
  styles: []
})
export class ReceivingItemComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['PONumber','PurchaseOrderID','Product', 'UOMDescription','QtyRemaining', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public rrService: ReceivingReceiptService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.rrService.getPOProductList(this.data).subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'QtyRemaining' && ele != 'ProductCode' && ele != 'UOMDescription' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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
    this.rrService.getItemRow(row)
    if (this.searchKey != "") {
      this.dataSource.data.splice(i, 1);
      this.dataSource.data = this.dataSource.data;
      
    } else {
      this.dataSource.filteredData.splice(i, 1);
      this.dataSource.data = this.dataSource.data;
    }

  }

}
