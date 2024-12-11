import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FacturaRoutingModule } from './factura-routing.module';
import { NgxLoadingModule } from 'ngx-loading';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FacturaRoutingModule,
    SharedModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class FacturaModule { }
