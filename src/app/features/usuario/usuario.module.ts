import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './component/usuario.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    SharedModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class UsuarioModule { }
