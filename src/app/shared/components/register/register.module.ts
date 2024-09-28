import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './component/register.component';

@NgModule({
  declarations: [RegisterComponent],  // Declara el componente aquí
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [RegisterComponent]  // Esto permitirá que el componente sea accesible desde otros módulos si es necesario
})
export class RegisterModule { }
