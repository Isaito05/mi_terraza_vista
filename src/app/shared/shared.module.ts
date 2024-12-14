import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa FormsModule aquí

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';


import { SharedRoutingModule } from './shared-routing.module';

import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CarritoEditModalComponent } from './components/carrito-edit-modal/carrito-edit-modal.component';
import { LocationComponent } from './components/location/location.component';



@NgModule({
  imports: [
    NgxLoadingModule.forRoot({animationType: ngxLoadingAnimationTypes.wanderingCubes,}),
    CommonModule,
    SharedRoutingModule,
    NgxPaginationModule,
    NgxDatatableModule,
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule,
    MatBottomSheetModule,
    
  ],
  declarations: [
    SidebarComponent,
    TableComponent,
    ModalComponent,
    CheckBoxComponent,
    MenuComponent,
    CarritoEditModalComponent,
    LocationComponent
  ],
  exports: [
    SidebarComponent,
    TableComponent,
    ModalComponent,
    HeaderComponent,
    CheckBoxComponent,
    MenuComponent,
    CarritoEditModalComponent,
    LocationComponent
    
  ]
})
export class SharedModule { }
