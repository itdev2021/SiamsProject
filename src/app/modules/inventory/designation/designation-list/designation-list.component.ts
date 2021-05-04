import { Component, OnInit, ViewChild } from '@angular/core';
import { DesignationService } from 'src/app/service/inventory/designation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DesignationEntryComponent } from '../designation-entry/designation-entry.component';

@Component({
  selector: 'app-designation-list',
  templateUrl: './designation-list.component.html',
  styles: []
})
export class DesignationListComponent implements OnInit {

  constructor(private serviceDesignation: DesignationService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Code', 'Designation', 'Active', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.serviceDesignation.getDesignationList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'Active' && ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
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

  onAdd() {
    this.serviceDesignation.initializeFormGroup();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(DesignationEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });

  }

  onEdit(row) {
    this.serviceDesignation.getDesignationByID(row).subscribe(data => {
      this.serviceDesignation.formDesignation.patchValue({
        DesignationID: data.DesignationID,
        Code: data.Code,
        Designation: data.Designation,
        Active: data.Active
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";

      const dialogRef = this.dialog.open(DesignationEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
      });
    });
  }

  onDelete(row,i) {
    this.comfirmDialogService.openConfirmDialog('Are you sure to delete this record ?')
      .afterClosed().subscribe(res => {
        if (res) {
          this.serviceDesignation.deleteDesignation(row).subscribe(
            (res: any) => {
              this.notificationService.warn('Deleted successfully!');
              this.dataSource.data.splice(i, 1);
              this.dataSource.data = this.dataSource.data;
            });
        }
      });
  }

}
