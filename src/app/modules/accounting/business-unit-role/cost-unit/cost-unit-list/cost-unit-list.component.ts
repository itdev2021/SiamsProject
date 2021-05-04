import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { CostUnitService } from 'src/app/service/lookup/cost-unit.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CostUnitEntryComponent } from '../cost-unit-entry/cost-unit-entry.component';



@Component({
  selector: 'app-cost-unit-list',
  templateUrl: './cost-unit-list.component.html',
  styles: []
})
export class CostUnitComponent implements OnInit {

  constructor(private service: CostUnitService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['CostUnitID','CostUnit','CostCenterID',
    'CostCenter','EmployeeID','EmployeeName','DivisionID','Division','actions'];
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
          return ele != 'CostCenter' && ele != 'EmployeeName' && ele != 'Division' 
          &&  ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      };
    });
  }

  onAdd(){
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "35%";

    const dialogRef = this.dialog.open(CostUnitEntryComponent, dialogconfig);
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
      this.service.formCostUnit.patchValue({
        CostUnitID: data.CostUnitID,
        CostUnit: data.CostUnit,
        CostCenterID: data.CostCenterID,
        EmployeeID: data.EmployeeID,
        DivisionID: data.DivisionID
        
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "35%";

      const dialogRef = this.dialog.open(CostUnitEntryComponent, dialogConfig);
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
