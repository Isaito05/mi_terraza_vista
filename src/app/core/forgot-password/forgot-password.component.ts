import { Component } from '@angular/core'; 
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  intentoFallido: boolean = false;
  botonHabilitado: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, this.validacionEmail]],
    });
    this.resetForm.valueChanges.subscribe(() => {
      if (this.intentoFallido) {
        this.intentoFallido = false // Habilita el formulario cuando hay cambios
        this.botonHabilitado = true
      }
    });
  }

   // Validador personalizado para el email
   validacionEmail(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = (/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,4})?$/);
    const email = control.value;
    return emailRegex.test(email) ? null : { invalidEmail: true }
  }

  onSubmit() {
    const email = this.resetForm.value.email;
    if (this.resetForm.valid) {
      Swal.fire({
        title: 'Enviando...',
        text: 'Por favor, espera mientras procesamos tu solicitud.',
        allowOutsideClick: false, // Evitar que se cierre al hacer clic afuera
        didOpen: () => {
          Swal.showLoading(); // Muestra el spinner
        }
      });
      setTimeout(() => {
        this.authService.requestPasswordReset(email).subscribe({
          next: (response) => {
            console.log(response);
            Swal.fire({
              icon: 'success',
              title: '¡Correo de recuperación enviado!',
              text: 'Si no encuentras el correo en tu bandeja de entrada, revisa tu carpeta de spam. Para recibir futuras notificaciones, agrega nuestra dirección a tus contactos.',
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if(result.isConfirmed) {
                this.router.navigate(['/login']);
              }
            });
            this.intentoFallido = false; 
            this.botonHabilitado = true;
          },
          error: (error) => {
            console.log(error);
            let errorMessage = 'No se pudo enviar el email.';        
            if (error.status === 404) {
              errorMessage = 'El email ingresado no está registrado en nuestra base de datos. Verifica e intenta nuevamente.';
            }       
            Swal.fire({
              icon: 'error',
              title: 'No se pudo enviar el email.',
              text: `${errorMessage}`,
              confirmButtonText: 'Reintentar',
            });
            this.intentoFallido = true; 
            this.botonHabilitado = false;
          }
        });
      },2000);
    } else {
      // Si el formulario no es válido, puedes mostrar una alerta aquí también si lo deseas
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonText: 'Aceptar',
      });
    }
  }
}
