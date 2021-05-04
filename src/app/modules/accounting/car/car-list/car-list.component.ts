import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CarService } from 'src/app/service/accounting/car.service';
import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CarEntryComponent } from '../car-entry/car-entry.component';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styles: []
})
export class CarListComponent implements OnInit {

  constructor(private service: CarService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private comfirmDialogService: ConfirmDialogService) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['CarMaker','Model','PlateNo','actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getCarList().subscribe(item => {
      this.dataSource = new MatTableDataSource(item as []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        return this.displayedColumns.some(ele => {
          return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
        });
      };
    });
  }

  onAdd(){
    this.service.initializeFormGroup();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "60%";

    const dialogRef = this.dialog.open(CarEntryComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

  onEdit(row: number){
    this.service.getCarByID(row).subscribe(data => {
      this.service.formCar.patchValue({
        CarListID: data.CarListID,
        CRNo: data.CRNo,
        CarMaker: data.CarMaker,
        Model: data.Model,
        PlateNo: data.PlateNo,
        ChassisNo: data.ChassisNo,
        EngineNo: data.EngineNo,
        Value: data.Value,
        PropertyTagNo: data.PropertyTagNo
      });

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "50%";

      const dialogRef = this.dialog.open(CarEntryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();
      });
    });
  }

  onDelete(row: number){

  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

}
