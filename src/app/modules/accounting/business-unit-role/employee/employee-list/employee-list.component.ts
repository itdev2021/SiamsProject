import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from 'src/app/service/accounting/business-unit-role/employee.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { EmployeeEntryComponent } from '../employee-entry/employee-entry.component';



@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styles: []
})
export class EmployeeComponent implements OnInit {

  constructor(private service: EmployeeService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['EmployeeID','EmployeeCode','LastName',
    'FirstName','MiddleName','Address','PositionID','DateHired','Status','actions'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchKey: string;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'Status' &&  ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      };
    });
  }

  onAdd(){
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "35%";

    const dialogRef = this.dialog.open(EmployeeEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  onEdit(row: number){
    this.service.getByID(row).subscribe(data => {
      this.service.formEmployee.patchValue({
        EmployeeID: data.EmployeeID,
        EmployeeCode: data.EmployeeCode,
        LastName: data.LastName,
        FirstName: data.FirstName,
        MiddleName: data.MiddleName,
        Address: data.Address,
        PositionID: data.PositionID,
        DateHired: data.DateHired,
        Status: data.Status

        
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "35%";

      const dialogRef = this.dialog.open(EmployeeEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
        this.onSearchClear();
      });
    });
  }

  onDelete(row: number){
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.service.delete(row).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully!');
              this.refreshList();
              this.onSearchClear();
            });         
        }
      });
  }

}
