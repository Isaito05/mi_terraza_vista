import { Component } from '@angular/core'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    const email = this.resetForm.value.email;

    if (this.resetForm.valid) {
      // Validación adicional: verificar si hay caracteres después del "@"
      const emailParts = email.split('@');
      if (emailParts.length !== 2 || emailParts[1].length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Formato de correo inválido',
          text: 'Asegúrate de que hay un carácter después del símbolo "@" en tu dirección de correo electrónico.',
          confirmButtonText: 'Aceptar',
        });
        return; // Salir del método si el formato es inválido
      }

      // Muestra el spinner mientras se espera la respuesta
      Swal.fire({
        title: 'Enviando...',
        text: 'Por favor, espera mientras procesamos tu solicitud.',
        allowOutsideClick: false, // Evitar que se cierre al hacer clic afuera
        didOpen: () => {
          Swal.showLoading(); // Muestra el spinner
        }
      });
  
      this.authService.requestPasswordReset(email).subscribe(
        response => {
          console.log(response);
          Swal.fire({
            icon: 'success',
            title: '¡El email de recuperación ha sido enviado!',
            html: `
              <p>Por favor, revisa tu bandeja de entrada o carpeta de spam.</p>
            `,
            confirmButtonText: 'Aceptar',
          });
        },
        error => {
          console.log(error);
          let errorMessage = 'No se pudo enviar el email.';
        
          if (error.status === 404) {
            errorMessage = 'El email ingresado no está registrado en nuestra base de datos. Verifica e intenta nuevamente.';
          }
        
          Swal.fire({
            icon: 'error',
            html: `
              <h3>${errorMessage}</h3>
            `,
            confirmButtonText: 'Reintentar',
          });
        }
      );
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
