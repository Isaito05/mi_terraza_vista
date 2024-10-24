import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CanComponentDeactivate, CanDeactivateType } from 'src/app/guard/can-deactivate.guard';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, CanComponentDeactivate {
  registerForm!: FormGroup;
  cmbTipo = 'password';
  cmbTipoC = 'password';
  intentoFallido: boolean = false;
  botonHabilitado: boolean = true;
  usuarios: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      RGU_NOMBRES: ['', [Validators.required, Validators.minLength(2)]],
      RGU_APELLIDOS: ['', [Validators.required, Validators.minLength(2)]],
      RGU_GENERO: ['', [Validators.required]],
      RGU_TP_DOC: ['', [Validators.required]],
      RGU_IDENTIFICACION: ['', [Validators.required,Validators.pattern(/^\d{8,10}$/)]],
      RGU_DIRECCION: ['', [Validators.required]],
      RGU_TELEFONO: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
      RGU_CORREO: ['', [Validators.required, this.validacionEmail]],
      RGU_PASSWORD: ['', [Validators.required, Validators.minLength(8), this.validacionContrasena]],
      confirmPassword: ['', Validators.required],
      RGU_ROL: ['Cliente'],
    }, { validator: this.passwordsMatchValidator });
    this.registerForm.valueChanges.subscribe(() => {
      if (this.intentoFallido) {
        this.intentoFallido = false // Habilita el formulario cuando hay cambios
        this.botonHabilitado = true
      }
    });
  }

  // passwordMatchValidator(form: FormGroup) {
  //   return form.get('RGU_PASSWORD')?.value === form.get('confirmPassword')?.value
  //     ? null : { mismatch: true };
  // }

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

    return null;
  }

  passwordsMatchValidator(form: FormGroup) {
    const { RGU_PASSWORD, confirmPassword } = form.controls;
    if (!RGU_PASSWORD || !confirmPassword) {
      return null;
    }

    if (RGU_PASSWORD.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  validacionEmail(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = (/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,4})?$/);
    const email = control.value;
    return emailRegex.test(email) ? null : { invalidEmail: true }
  }

  verContrasena(campo: 'cmbTipo' | 'cmbTipoC'): void {
    this[campo] = this[campo] === 'password' ? 'text' : 'password';
  }

  guardarDatos(formData: any) {

    this.usuarioService.getData().subscribe({
      next: (data) => {
        this.usuarios = data.filter((item: { RGU_ESTADO: number }) => item.RGU_ESTADO === 1);
        const emails = this.usuarios.map((item: { RGU_CORREO: string }) => item.RGU_CORREO);

        if (emails.includes(formData.RGU_CORREO)) {
          Swal.fire({
            title: 'Correo duplicado',
            text: 'Este correo ya existe. No se puede actualizar.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        } else {
          
          
        }
      },
      error: (err) => {
        console.error('Error obteniendo usuarios:', err);
      }
    });
  }

  onSubmit() {
    const formData = this.registerForm.value;
    this.usuarioService.getData().subscribe({
      next: (data) => {
        this.usuarios = data.filter((item: { RGU_ESTADO: number }) => item.RGU_ESTADO === 1);
        const emails = this.usuarios.map((item: { RGU_CORREO: string }) => item.RGU_CORREO);

        if (emails.includes(this.registerForm.value.RGU_CORREO)) {
          Swal.fire({
            title: 'Correo duplicado',
            text: 'Este correo ya existe. No se puede actualizar.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        } else {
          if (this.registerForm.valid) {  
            delete formData.confirmPassword;
            this.usuarioService.saveData(formData).subscribe(
              {
                next: (response) => {
                  console.log('Registro exitoso', response);
                  Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Serás redirigido a la página de login.',
                    showConfirmButton: false,
                    timer: 3000
                  }).then(() => {
                    this.registerForm.reset();
                    this.router.navigate(['/login']);
                  });
                  this.intentoFallido = false;
                  this.botonHabilitado = true;
                },
                error: (error) => {
                  console.error('Error al guardar los datos:', error);
                  Swal.fire({
                    title: 'Error',
                    text: 'No se pudo guardar el registro',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
                  this.intentoFallido = true;
                  this.botonHabilitado = false;
                }
              });
          } else {
            console.log('Formulario inválido');
          }
        }
      }
    })
    }
    
    

    canDeactivate(): Promise<boolean> {
      if (this.registerForm.dirty && !this.registerForm.invalid) {
        return Swal.fire({
          title: 'Cambios sin guardar',
          text: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, salir',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          return result.isConfirmed; // Retorna true si el usuario confirma, false si cancela
        });
      }
      return Promise.resolve(true); // Si no hay cambios sin guardar, permite navegar sin confirmación
    }

  validateNumberInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
  const charCode = event.charCode ? event.charCode : event.keyCode;

  if (charCode < 48 || charCode > 57) {
    event.preventDefault(); 
  }

  if (input.value.length >= 10) {
    event.preventDefault(); 
  }
  }

}


