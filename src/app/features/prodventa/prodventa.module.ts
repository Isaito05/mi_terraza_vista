import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdventaRoutingModule } from './prodventa-routing.module';
import { ProdventaComponent } from './component/prodventa.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProdventaComponent
  ],
  imports: [
    CommonModule,
    ProdventaRoutingModule, 
    SharedModule
  ]
})
export class ProdventaModule { }
