import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';



@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    LoginComponent,

  ],
})
export class LoginModule { }
