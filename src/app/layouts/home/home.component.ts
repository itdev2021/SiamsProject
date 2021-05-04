import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { VERSION } from '@angular/material/core';
import { NavItem } from 'src/app/service/nav-menu/nav-item';
import { NavService } from 'src/app/service/nav-menu/nav.service';
import { UserService } from 'src/app/service/User/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  version = VERSION;

  navItems: NavItem[] = [];

  constructor(private navService: NavService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getuserProfile().subscribe(
      res => {
        this.navService.getNavMenuById(res.Id).subscribe(nav => {
          this.navItems = nav as NavItem[];
        });
      },
      err => {
        console.log(err);
      }
    )

  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

}
