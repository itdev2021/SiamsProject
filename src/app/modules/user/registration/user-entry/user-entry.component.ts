import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { DepartmentService } from 'src/app/service/references/department.service';
import { UserService } from 'src/app/service/User/user.service';

@Component({
  selector: 'app-user-entry',
  templateUrl: './user-entry.component.html',
  styles: []
})
export class UserEntryComponent implements OnInit {
  departmentList;

  constructor(public service: UserService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.departmentService.getList().subscribe(res => this.departmentList = res);
  }

  changeClient(value) {
    console.log(value);
  }

  onSubmit() {
    this.service.register().subscribe(
      (res: any) => {
        if (res.Succeeded) {
          this.service.formUser.reset();
          this.notificationService.success('New User Created!');
        } else {
          console.log(res);
          res.Errors.forEach(element => {
            switch (element.Code) {
              case 'DuplicateUserName':
                this.notificationService.warn('Username is already taken!');
                break;

              default:
                this.notificationService.warn('Registration failed!');
                break;
            }
          });
        }
      },
      err => {
        console.log();
      }
    );
  }

}
