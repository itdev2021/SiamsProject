import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ProductService } from 'src/app/service/inventory/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisbursementFATService } from 'src/app/service/disbursement/transaction/disbursementfat.service';

@Component({
  selector: 'app-dfat-reference-lookup',
  templateUrl: './dfat-reference-lookup.component.html',
  styles: []
})
export class DFATReferenceLookupComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ReferenceNo','ReceivingReceiptID','ReceivingDate', 'Supplier', 'TotalCost', 'NetTotalCost','AccountDebit', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public service: DisbursementFATService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    if (this.data[0]) {
      this.service.getReceivingReceiptInfoBy(this.data[0]).subscribe(item => {
        this.dataSource = new MatTableDataSource(item as []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return  ele != 'ReceivingDate' &&  ele != 'TotalCost' &&  ele != 'TotalEWT' && ele != 'NetTotalCost' && ele != 'AccountDebit' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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
    this.service.getItemRow(row)
  }

}
