import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProprovComponent } from './component/proprov.component';
const routes: Routes = [
  {
    path: '',
    component: ProprovComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProprovRoutingModule { }
