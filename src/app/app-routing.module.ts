import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrandyRoutingModule } from './route/prandy-routing.module';
import { NikkoRoutingModule } from './route/nikko-routing.module';
import { EmakRoutingModule } from './route/emak-routing.module';


@NgModule({
  imports: [
    PrandyRoutingModule,
    NikkoRoutingModule,
    EmakRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
