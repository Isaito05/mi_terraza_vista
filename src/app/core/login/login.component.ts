import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  // Método para redirigir a la página de recuperación de contraseña
  redirectToForgotPassword() {
    this.router.navigate(['/forgot-password']); // Redirige al componente de recuperación de contraseña
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // console.log('Login successful');
        const decodedToken: any = jwtDecode(response.access_token);
        sessionStorage.setItem('username', decodedToken.nombre);
        sessionStorage.setItem('role', decodedToken.rol);        
        sessionStorage.setItem('apellido', decodedToken.apellido);        
        Swal.fire({
          title: "Has iniciado sesión correctamente",
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
        setTimeout(() => {
          this.router.navigate(['/']);  // Redirige al dashboard o página principal
        },1000);
      },
      error: (err) => {
        console.error('Login failed', err);
        Swal.fire({
          title: err.error.message || 'Ocurrió un error en el login',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
      }
    });
  }
}
