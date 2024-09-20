import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BodegaRoutingModule } from './bodega-routing.module';
import { BodegaComponent } from './component/bodega.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [
    BodegaComponent
  ],
  imports: [
    CommonModule,
    BodegaRoutingModule,
    SharedModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class BodegaModule { }
