import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  cmbTipo: string = 'password';
  cmbTipoC: string = 'password';
  intentoFallido: boolean = false;
  botonHabilitado: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa el formulario con validaciones
    this.resetPasswordForm = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8), this.validacionContrasena]],
      matchContrasena: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator 
    } as AbstractControlOptions);
    this.resetPasswordForm.valueChanges.subscribe(() => {
      if (this.intentoFallido) {
        this.intentoFallido = false // Habilita el formulario cuando hay cambios
        this.botonHabilitado = true
      }
    }); // Aplicar la validación personalizada aquí
  }

  ngOnInit(): void {
    // Captura el token de los parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('Token capturado:', this.token); // Verifica que el token se esté capturando
    });
  }

  validacionContrasena(control: AbstractControl) {
    const password = control.value;

    const hasMinLength = password ? password.length >= 8 : false;
    // const hasMaxLength = password ? password.length <= 8 : false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&_*(),.?":{}|<>]/.test(password);

    if (!hasMinLength) {
      return { minlength: true };
    }

    if (!hasUpperCase) {
      return { uppercase: true };    
    } else if (!hasNumber) {
      return { number: true };
    } else if (!hasSpecialChar) {
      return { specialchar: true };
    }
  
    return  null;
  }

  verContrasena(campo: 'cmbTipo' | 'cmbTipoC'): void {
    this[campo] = this[campo] === 'password' ? 'text' : 'password';
  }
  

  // verContrasena(): void {
  //   this.cmbTipo = this.cmbTipo === 'password' ? 'text' : 'password';
  // }

  // verContrasenaC(): void {
  //   this.cmbTipoC = this.cmbTipoC === 'password' ? 'text' : 'password';
  // }
  
  // Valida que las contraseñas coincidan
  passwordsMatchValidator(form: FormGroup) {
    const { nuevaContrasena, matchContrasena } = form.controls;
    if (!nuevaContrasena || !matchContrasena) {
      return null;
    } 

    if (nuevaContrasena.value !== matchContrasena.value) {
      matchContrasena.setErrors({ mismatch: true });
    } else {
      matchContrasena.setErrors(null);
    }
 
    return null; 
  }
  
  onSubmit(): void {
    console.log('Intento de envío del formulario'); // Mensaje de inicio del envío
    const nuevaContrasena = this.resetPasswordForm.get('nuevaContrasena')?.value;
    if (this.resetPasswordForm.valid) {
      console.log('Formulario válido, token:', this.token); // Verifica que el formulario sea válido y el token esté disponible.    
      this.authService.resetPassword(this.token, nuevaContrasena).subscribe({
        next: (response) => {
          console.log('Respuesta exitosa de la API:', response); // Muestra la respuesta exitosa de la API.
          // Si todo sale bien, muestra una alerta de éxito.
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña cambiada!',
            text: 'Tu contraseña ha sido actualizada exitosamente.',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
          })
          .then((result) => {
            if( result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
          this.intentoFallido = false; 
          this.botonHabilitado = true;
        },
        error: (error) => {
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
              title: 'Error al cambiar la contraseña',
              text: 'Hubo un problema al cambiar la contraseña. Inténtalo de nuevo más tarde.',
              confirmButtonText: 'Aceptar'
            });
          }
          this.intentoFallido = true; 
          this.botonHabilitado = false;
        }
      });
    } else {
      console.log('Formulario no válido:', this.resetPasswordForm.errors); // Verifica si el formulario es inválido.
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonText: 'Aceptar',
      });
    }
  }
}
