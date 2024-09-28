import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  cmbTipo = 'password'; 

  constructor(private fb: FormBuilder,  private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      RGU_NOMBRES: ['', [Validators.required, Validators.minLength(2)]],
      RGU_APELLIDOS: ['', [Validators.required, Validators.minLength(2)]],
      RGU_CORREO: ['', [Validators.required, Validators.email]],
      RGU_PASSWORD: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      RGU_ROL: ['Cliente'],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('RGU_PASSWORD')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  verContrasena() {
    this.cmbTipo = this.cmbTipo === 'password' ? 'text' : 'password';
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
          
        },
        
      });
    }else {
      console.log('Formulario inválido');
    }
  }

    } 
 

