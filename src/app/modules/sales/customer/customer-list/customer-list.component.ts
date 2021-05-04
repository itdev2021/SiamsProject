import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { CustomerEntryComponent } from '../customer-entry/customer-entry.component';
import { CustomerService } from 'src/app/service/sales/customer.service';
import { CreditTermsService } from 'src/app/service/references/credit-terms.service';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styles: []
})

export class CustomerListComponent implements OnInit {

  constructor(private service: CustomerService,
    private TermsService: CreditTermsService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService,
    private fb: FormBuilder,) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['CustomerID', 'Customer', 'Drugstore', 'CreditTerms', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.TermsService.getList().subscribe(terms => {

      this.service.getCustomerList().subscribe(item => {

        const mergeById = (array1, array2) =>
          array1.map(itm => ({
            ...array2.find((i) => (i.CreditTermsID === itm.CreditTermsID) && item),
            ...itm
          }));

        let result = mergeById(item, terms);

        this.dataSource = new MatTableDataSource(result as []);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter) => {
          return this.displayedColumns.some(ele => {
            return ele != 'CustomerID' && ele != 'CreditTerms' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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

  onAdd() {
    // this.service.initializeFormGroup();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(CustomerEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });

  }

  onEdit(id) {
    this.service.getCustomerByID(parseInt(id)).subscribe(data => {

      this.service.formCustomer.patchValue({
        CustomerID: data.Customer.CustomerID,
        Customer: data.Customer.Customer,
        Drugstore: data.Customer.Drugstore,
        CreditTermsID: data.Customer.CreditTermsID,
        PriceListID: data.Customer.PriceListID,
        IsMember: data.Customer.IsMember,
        DiscountSchemeID: data.Customer.DiscountSchemeID,
        Region: data.Customer.Region,
        Designation: data.Customer.Designation,
        Provinces: data.Customer.Provinces,
        Capital: data.Customer.Capital,
        City: data.Customer.City,
        Municipalities: data.Customer.Municipalities,
        District: data.Customer.District,
        Zone: data.Customer.Zone,
        Barangay: data.Customer.Barangay,
        Area: data.Customer.Area,
        Zipcode: data.Customer.Zipcode,
        Street: data.Customer.Street,
        Contact: data.Customer.Contact,
        InvoicePrint: data.Customer.InvoicePrint,
        CreditLimit: data.Customer.CreditLimit,
        TIN: data.Customer.TIN,
        NonVat: data.Customer.NonVat,
        CustomerGroupID: data.Customer.CustomerGroupID,
        SPMSPrincipalsID: data.Customer.SPMSPrincipalsID,
        UserRefenceCode: data.Customer.UserRefenceCode,
        EntryTypeID: data.Customer.EntryTypeID,
        ProductDealID: data.Customer.ProductDealID,
        CROID: data.Customer.CROID,
        RC: data.Customer.RC,
        RCU: data.Customer.RCU
      });

      this.service.formCustomer.setControl('CustomerShipTo', this.setExistingItems(data.customerShipToAdd));

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "60%";
      const dialogRef = this.dialog.open(CustomerEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (this.searchKey)
          this.applyFilter();
        else
          this.refreshList();
      });

    });
  }

  setExistingItems(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        ShipToID: i.ShipToID,
        CustomerID: i.CustomerID,
        ShipToCode: i.ShipToCode,
        ShipAddress: i.ShipAddress
      }));
    });
    return formArray;
  }

  onDelete(row, i) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.deleteCustomer(row).subscribe(
            (res: any) => {
              this.notificationService.warn('! Deleted successfully');
              this.refreshList();
              this.applyFilter();
            });
        }
      });
  }

}
