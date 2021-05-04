import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { GlobalService } from 'src/app/service/global.service';
import { NavService } from 'src/app/service/nav-menu/nav.service';
import { UserService } from 'src/app/service/User/user.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: []
})
export class TopNavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(public navService: NavService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public globalService:GlobalService) { }

  ngOnInit() {
    this.globalService.getUserProfile();
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

}