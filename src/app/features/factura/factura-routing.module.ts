import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturaComponent } from './component/factura.component';

const routes: Routes = [
  {
    path: '',
    component: FacturaComponent, // Componente principal para la característica
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaRoutingModule { }





