import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../layouts/default/default.component';


const routes: Routes = [
  // {path:'',redirectTo:'',pathMatch:'full'},
  {
    path: '', component: DefaultComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class EmakRoutingModule { }
