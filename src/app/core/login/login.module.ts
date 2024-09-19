import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    LoginRoutingModule,
    LoginComponent
  ],
  declarations: [],
})
export class LoginModule { }
