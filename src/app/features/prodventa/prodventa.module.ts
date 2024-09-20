import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdventaRoutingModule } from './prodventa-routing.module';
import { ProdventaComponent } from './component/prodventa.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [
    ProdventaComponent
  ],
  imports: [
    CommonModule,
    ProdventaRoutingModule, 
    SharedModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class ProdventaModule { }
