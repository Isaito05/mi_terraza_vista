import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoComponent } from './component/pedido.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PedidoComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    SharedModule,
    NgxLoadingModule.forRoot({}),
    FormsModule
  ]
})
export class PedidoModule { }
