import { Injectable, ɵɵresolveBody } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  menuList: any[] = [];


  constructor(private http: HttpClient,
    private fb: FormBuilder) { }

  formLogin = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', Validators.required]
  });

  formUser = this.fb.group({
    Id: [''],
    UserName: ['', Validators.required],
    Email: [''],
    FullName: [''],
    DepartmentID:[''],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords }),

  });



  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //

    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      UserName: this.formUser.value.UserName,
      Email: this.formUser.value.Email,
      FullName: this.formUser.value.FullName,
      DepartmentID:this.formUser.value.DepartmentID,
      Password: this.formUser.value.Passwords.Password,
    }

    return this.http.post(environment.apiURL + '/ApplicationUser/Register', body);
  }


  login(formData) {
    return this.http.post(environment.apiURL + '/ApplicationUser/Login', formData);
  }


  getuserProfile():any {
    return this.http.get(environment.apiURL + '/UserProfile');
  }

  getuserList() {
    return this.http.get(environment.apiURL + '/UserProfile/UserList');
  }

  getNavMenuList(): any {
    return this.http.get(environment.apiURL + '/RefMenu');
  }








  insert(formBody) {
    return this.http.post(environment.apiURL + '/user', formBody);
  }

  update(formBody) {
    return this.http.put(environment.apiURL + '/user/' + formBody.pk, formBody);
  }

  getList() {
    return this.http.get(environment.apiURL + '/user');
  }

  getByID(id: number): any {
    return this.http.get(environment.apiURL + '/user/' + id);
  }

  delete(id: number) {
    return this.http.delete(environment.apiURL + '/user/' + id);
  }
}
