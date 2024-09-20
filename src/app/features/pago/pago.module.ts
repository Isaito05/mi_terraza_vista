import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagoRoutingModule } from './pago-routing.module';
import { PagoComponent } from './component/pago.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [
    PagoComponent
  ],
  imports: [
    CommonModule,
    PagoRoutingModule,
    SharedModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class PagoModule { }
