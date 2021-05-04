import { Injectable, ɵɵresolveBody } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Event, NavigationEnd, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavService {
    public appDrawer: any;
    public currentUrl = new BehaviorSubject<string>(undefined);


    constructor(private http: HttpClient,
        private router: Router,
        private fb: FormBuilder) {
            this.router.events.subscribe((event: Event) => {
                if (event instanceof NavigationEnd) {
                  this.currentUrl.next(event.urlAfterRedirects);
                }
              });
    }

    public closeNav() {
        this.appDrawer.close();
      }
    
      public openNav() {
        this.appDrawer.open();
      }

    getNavMenu(){
        return this.http.get(environment.apiURL+'/RefMenu');
    }

    getNavMenuById(id):any{
        return this.http.get(environment.apiURL+'/RefMenu/User/'+id);
    }

}