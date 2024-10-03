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

  constructor(private fb: FormBuilder,  private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      RGU_NOMBRES: ['', [Validators.required, Validators.minLength(2)]],
      RGU_APELLIDOS: ['', [Validators.required, Validators.minLength(2)]],
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
  
    return  null;
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

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
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
    }else {
      console.log('Formulario inválido');
    }
  }

  canDeactivate(): CanDeactivateType {
    if (this.registerForm.dirty && !this.registerForm.invalid) {
      return confirm('Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?');
    }
    return true;
  }
  
} 
 

