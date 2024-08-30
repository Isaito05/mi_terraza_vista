import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableComponent } from './components/table/table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí



@NgModule({
  imports: [
    CommonModule,
    SharedRoutingModule,
    NgxPaginationModule,
    FormsModule
  ],
  declarations: [
    SidebarComponent,
    TableComponent,
    ModalComponent
   

  ],
  exports: [
    SidebarComponent,
    TableComponent,
    ModalComponent
  ]
})
export class SharedModule { }
