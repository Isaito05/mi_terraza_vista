import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service'; 
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Inicializa el formulario con validaciones
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator }); // Aplicar la validación personalizada aquí
  }

  ngOnInit(): void {
    // Captura el token de los parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('Token capturado:', this.token); // Verifica que el token se esté capturando
    });
  }

  // Valida que las contraseñas coincidan
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    console.log('Intento de envío del formulario'); // Mensaje de inicio del envío

    // Verificar la longitud de la contraseña
    const password = this.resetPasswordForm.get('password')?.value;
    if (password && password.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña demasiado corta',
        text: 'La contraseña debe tener al menos 8 caracteres.',
        confirmButtonText: 'Aceptar'
      });
      return; // Detener el envío del formulario
    }

    if (this.resetPasswordForm.valid) {
      console.log('Formulario válido, token:', this.token); // Verifica que el formulario sea válido y el token esté disponible.
      
      this.authService.resetPassword(this.token, password).subscribe(
        response => {
          console.log('Respuesta exitosa de la API:', response); // Muestra la respuesta exitosa de la API.
          
          // Si todo sale bien, muestra una alerta de éxito.
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña cambiada!',
            text: 'Tu contraseña ha sido actualizada exitosamente.',
          });
        },
        error => {
          console.log('Error en la solicitud de la API:', error); // Verifica si se produce un error.

          // Verifica si es un error 401 (token expirado o inválido).
          if (error.status === 401) {
            console.log('Error 401: Token expirado o inválido'); // Mensaje para indicar que el error es un 401.
            
            Swal.fire({
              icon: 'error',
              title: 'Token expirado',
              text: 'Tu enlace para restablecer la contraseña ha expirado. Por favor, solicita un nuevo enlace.',
              confirmButtonText: 'Aceptar'
            });
          } else {
            console.log('Error no manejado:', error.status); // Si no es 401, muestra el estado del error.
            
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al cambiar la contraseña. Inténtalo de nuevo más tarde.',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      );
    } else {
      console.log('Formulario no válido:', this.resetPasswordForm.errors); // Verifica si el formulario es inválido.
    }
  }
}
