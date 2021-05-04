import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/User/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  hide = true;

  constructor(public service: UserService,
    private router: Router,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null)
      this.router.navigateByUrl('/home');
  }

  onSubmit(fg: FormGroup) {
    this.service.login(fg.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/home')
      },
      err => {
        if (err.status == 400)
          this.notificationService.warn("Incorrect username and password.");
        else
          console.log(err);
      }
    )
  }

}
