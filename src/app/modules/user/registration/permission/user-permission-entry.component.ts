import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { UserPermissionService } from 'src/app/service/user/user-permission.service';
import { UserService } from 'src/app/service/User/user.service';

@Component({
  selector: 'app-user-permission-entry',
  templateUrl: './user-permission-entry.component.html',
  styles: []
})
export class UserPermissionEntryComponent implements OnInit {
  indetermine: boolean = false;
  allComplete: boolean = false;
  userList;

  constructor(public service: UserPermissionService,
    public userService: UserService,
    private fb: FormBuilder,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getUserList();
    // this.service.getNavMenuInfo();

  }

  getUserPermission(value) {
    this.service.getNavMenuInfoById(value);
  }

  getUserList() {
    this.userService.getuserList().subscribe(res => this.userList = res);
  }

  setAll(completed: boolean, menu,) {
    this.allComplete = true;
    this.indetermine = false;
    menu.patchValue({
      View: completed,
      Create: completed,
      Edit: completed,
      Save: completed,
      Delete: completed,
      Post: completed,
      Unpost: completed,
      Cancel: completed,
      Print: completed,
      Amount: completed,
    });
  }

  updateAllComplete(menu) {

    if (menu.value.View == true
      && menu.value.Create == true
      && menu.value.Edit == true
      && menu.value.Save == true
      && menu.value.Delete == true
      && menu.value.Post == true
      && menu.value.Unpost == true
      && menu.value.Cancel == true
      && menu.value.Print == true
      && menu.value.Amount == true)
      this.allComplete = true;
    else
      this.allComplete = false;
  }

  someComplete(): boolean {
    if (this.allComplete == true)
      return false;
    console.log(this.allComplete);
    return this.indetermine = !this.allComplete;
  }

  changeClient(value) {
    console.log(value);
  }

  onSubmit(fg: FormGroup) {
    this.service.saveOrUpdate()
      .subscribe(
        (res: any) => {
          this.notificationService.success('Submitted successfully!');
        });
  }

}
