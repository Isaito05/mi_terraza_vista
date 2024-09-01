import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedorComponent } from './component/proveedor.component';

const routes: Routes = [

  {
    path: '',
    component: ProveedorComponent, // Componente principal para la característica
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
