import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { GlobalService } from 'src/app/service/global.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PoliticalMapService } from 'src/app/service/references/political-map.service';
import { PoliticalMapEntryComponent } from '../political-map-entry/political-map-entry.component';



@Component({
  selector: 'app-political-map-list',
  templateUrl: './political-map-list.component.html',
  styles: []
})
export class PoliticalMapComponent implements OnInit {

  constructor(private service: PoliticalMapService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['PoliticalMapID', 'Region', 'Designation', 'CenterCapital'
    , 'Provinces', 'Capital', 'Municipalities', 'City'
    , 'Barangay', 'ZipCode', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    // this.globalService.getUserAccess(this.router.url);
    this.refreshList();
  }

  refreshList() {
    this.service.getList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'actions' && data[ele].toString().toLowerCase().indexOf(filter) != -1;
        });
      };
    });
  }

  onAdd() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(PoliticalMapEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();

    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  onEdit(row: number) {
    this.service.getByID(row).subscribe(data => {
      this.service.formPoliticalMap.patchValue({
        PoliticalMapID: data.PoliticalMapID,
        Region: data.Region,
        Designation: data.Designation,
        CenterCapital: data.CenterCapital,
        Provinces: data.Provinces,
        Capital: data.Capital,
        Municipalities: data.Municipalities,
        City: data.City,
        Barangay: data.Barangay,
        ZipCode: data.ZipCode
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "60%";

      const dialogRef = this.dialog.open(PoliticalMapEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
        this.onSearchClear();
      });
    });
  }

  onDelete(row: number) {
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
