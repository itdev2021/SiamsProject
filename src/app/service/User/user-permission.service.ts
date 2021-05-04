import { Injectable, ɵɵresolveBody } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionService {
  menuList: any[] = [];


  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formMenu = this.fb.group({
    UserId: ['', Validators.required],
    permission: this.fb.array([]),
  });

  getUserPermissionById(id): any {
    return this.http.get(environment.apiURL + '/UserPermission/UserAccess/' + id);
  }

  getNavMenuList(UserId): any {
    return this.http.get(environment.apiURL + '/RefMenu/' + UserId);
  }

  getNavMenuInfoById(UserId) {
    this.getNavMenuList(UserId).subscribe((res) => {
      this.formMenu.setControl('permission', this.setExistingMenu(res));
    },
      err => { console.log(err) });
  }

  setExistingMenu(itemSets): FormArray {
    const formArray = new FormArray([]);
    itemSets.forEach(i => {
      formArray.push(this.fb.group({
        UserpermissionId: i.UserpermissionId,
        Id: i.Id,
        ParentId: i.ParentId,
        displayName: i.displayName,
        category: i.category,
        SelectAll: i.SelectAll,
        View: i.View,
        Create: i.Create,
        Edit: i.Edit,
        Save: i.Save,
        Delete: i.Delete,
        Post: i.Post,
        Unpost: i.Unpost,
        Cancel: i.Cancel,
        Print: i.Print,
        Amount: i.Amount
      }));
    });
    return formArray;
  }

  saveOrUpdate() {
    var body = {
      ApplicationUserPermissions: this.formMenu.get('permission').value
    };
    return this.http.post(environment.apiURL + '/UserPermission/' + this.formMenu.value.UserId, body);
  }











  // insert(formBody) {
  //   return this.http.post(environment.apiURL + '/user', formBody);
  // }

  // update(formBody) {
  //   return this.http.put(environment.apiURL + '/user/' + formBody.pk, formBody);
  // }

  // getList() {
  //   return this.http.get(environment.apiURL + '/user');
  // }

  // getByID(id: number): any {
  //   return this.http.get(environment.apiURL + '/user/' + id);
  // }

  // delete(id: number) {
  //   return this.http.delete(environment.apiURL + '/user/' + id);
  // }
}
