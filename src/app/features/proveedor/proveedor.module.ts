import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorComponent } from './component/proveedor.component';
import { ProveedorRoutingModule } from './proveedor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ProveedorComponent
  ],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    SharedModule
  ]
})
export class ProveedorModule { }
