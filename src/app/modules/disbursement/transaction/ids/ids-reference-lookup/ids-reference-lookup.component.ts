import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDSService } from 'src/app/service/disbursement/transaction/ids.service';
import { DeliveredToService } from 'src/app/service/lookup/delivered-to.service';
import { AccountTitleService } from 'src/app/service/accounting/account-title.service';

@Component({
  selector: 'app-ids-reference-lookup',
  templateUrl: './ids-reference-lookup.component.html',
  styles: []
})
export class IDSReferenceLookupComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['ReferenceNo', 'Date', 'PayTo', 'Debit', 'Credit', 'AccountTitle', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public service: IDSService,
    private deliveredService: DeliveredToService,
    private acctTitleService: AccountTitleService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.deliveredService.getList().subscribe(payTo => {
      const listArray = [...payTo.supplier, ...payTo.customer, ...payTo.employee];

        this.service.getReferenceNo().subscribe(item => {

          const mergeById = (array1, array2) =>
            array1.map(itm => ({
              ...array2.find((i) => (i.PayToID === itm.SupplierID) && item),
              ...itm
            }));

          let result = mergeById(item, listArray);
          this.dataSource = new MatTableDataSource(result as []);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = (data, filter) => {
            return this.displayedColumns.some(ele => {
              return ele != 'Date' && ele != 'Debit' && ele != 'Credit' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
            });
          };
      });
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
    this.service.patchByReferenceNo(row,this.data)
  }

}
