import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisbursementFATService } from 'src/app/service/disbursement/transaction/disbursementfat.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-advs-lookup',
  templateUrl: './advs-lookup.component.html',
  styles: []
})
export class AdvsLookupComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['CashDisbursementDPID', 'CashDisbursementDPDate', 'CheckNo', 'TotalPayment', 'AccountTitleCredit', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public service: DisbursementFATService,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    if (this.data[0]) {
      this.service.getAdvsToReference(this.data[0]).subscribe(item => {
        this.dataSource = new MatTableDataSource(item as []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele != 'CashDisbursementDPDate' && ele != 'TotalPayment' && ele != 'AccountTitleDebit' && ele != 'AccountTitleCredit' && ele != 'AccountDebit' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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
    this.service.getAdvsReference(row, this.data[1])
  }

}
