import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { RegisterModule } from './shared/components/register/register.module';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    ForgotPasswordComponent,
    RegisterModule, 
    
    
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
