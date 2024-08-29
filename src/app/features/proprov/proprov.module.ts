import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProprovRoutingModule } from './proprov-routing.module';
import { ProprovComponent } from './component/proprov.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProprovComponent
  ],
  imports: [
    CommonModule,
    ProprovRoutingModule,
    SharedModule
  ]
})
export class ProprovModule { }
