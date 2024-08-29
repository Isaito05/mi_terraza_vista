import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BodegaRoutingModule } from './bodega-routing.module';
import { BodegaComponent } from './component/bodega.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BodegaComponent
  ],
  imports: [
    CommonModule,
    BodegaRoutingModule,
    SharedModule
  ]
})
export class BodegaModule { }
