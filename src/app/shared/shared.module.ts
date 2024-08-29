import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableComponent } from './components/table/table.component';



@NgModule({
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  declarations: [
    SidebarComponent,
    TableComponent
  ],
  exports: [
    SidebarComponent,
    TableComponent
  ]
})
export class SharedModule { }
