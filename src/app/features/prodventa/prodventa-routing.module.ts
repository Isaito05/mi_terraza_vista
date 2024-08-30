import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdventaComponent } from './component/prodventa.component';

const routes: Routes = [
  {
    path: '',
    component: ProdventaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdventaRoutingModule { }
