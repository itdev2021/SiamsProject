import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemLookupService } from './service/lookup/item-lookup.service';
import { MaterialModule } from './shared/material.modules';

// Shared Module \\
import { PrandySharedModule } from './shared/prandy-shared.module';
import { NikkoSharedModule } from './shared/nikko-shared.module';
import { EmakSharedModule } from './shared/emak-shared.module';
import { UserService } from './service/User/user.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    PrandySharedModule,
    NikkoSharedModule,
    EmakSharedModule,
  ],
  providers:
    [ItemLookupService,
      UserService, {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }],
  bootstrap: [AppComponent]
})
export class AppModule { }
