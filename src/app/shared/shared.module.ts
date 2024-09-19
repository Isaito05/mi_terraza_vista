import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableComponent } from './components/table/table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { HeaderComponent } from './components/header/header.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';



@NgModule({
  imports: [
    NgxLoadingModule.forRoot({animationType: ngxLoadingAnimationTypes.wanderingCubes,}),
    CommonModule,
    SharedRoutingModule,
    NgxPaginationModule,
    NgxDatatableModule,
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule
  ],
  declarations: [
    SidebarComponent,
    TableComponent,
    ModalComponent
  ],
  exports: [
    SidebarComponent,
    TableComponent,
    ModalComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
