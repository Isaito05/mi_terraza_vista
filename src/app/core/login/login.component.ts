import { Component, NgZone } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  standalone: false,
  // imports: [FormsModule,ReactiveFormsModule,  // Asegúrate de incluir ReactiveFormsModule aquí
  //   FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  cmbTipo: string = 'password';
  loginForm: FormGroup;
  intentoFallido: boolean = false;
  botonHabilitado: boolean = true;
  loading: boolean = false;
  rol: string = "";
  userInfo: any ;
  private clientId: string = '1016354076787-sjg4iutorlppu716q4hsognu5hk68u57.apps.googleusercontent.com';
  public user: any = null; // Información del usuario logueado

  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, this.validacionEmail]],
      password: ['', Validators.required]
    });
    this.loginForm.valueChanges.subscribe(() => {
      if (this.intentoFallido) {
        this.intentoFallido = false // Habilita el formulario cuando hay cambios
        this.botonHabilitado = true
      }
    });
  }

  ngOnInit(): void {
    this.initializeGoogleButton();
  }
  
  initializeGoogleButton() {
    google.accounts.id.initialize({
      client_id: this.clientId, // Tu Client ID
      callback: this.handleGoogleCallback.bind(this), 
    });
  
    // Renderiza el botón en el contenedor con ID 'googleButton'
    const googleButton = document.getElementById('googleButton');
    if (googleButton) {
      google.accounts.id.renderButton(googleButton, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
      });
    } else {
      console.error('El elemento con ID googleButton no se encontró en el DOM.');
    }
  
    // Opcional: Muestra el prompt si el usuario ya está autenticado
    google.accounts.id.prompt();
  }
  
  handleGoogleCallback(response: any) {
    // console.log('Google JWT Token:', response.credential);
    this.authService.loginWithGoogle(response.credential).subscribe(
      (data) => {
        this.ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      },
      (error) => { console.error('Error al autenticar con Google:', error); }
    );
  }

  verContrasena(): void {
    this.cmbTipo = this.cmbTipo === 'password' ? 'text' : 'password';
  }

  // Validador personalizado para el email
  validacionEmail(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = (/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook)\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,4})?$/);
    const email = control.value;
    return emailRegex.test(email) ? null : { invalidEmail: true }
  }
  
  login() {
    console.log(this.loginForm.value.email);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (response) => {
          // console.log('Login successful');
          // console.log(response)
          const decodedToken: any = jwtDecode(response.access_token);
          const miNombre = decodedToken.nombre       
          const cliente = decodedToken.rol       
          Swal.fire({
            title: `¡Bienvenido de nuevo, ${miNombre}!`,
            text: "Has iniciado sesión correctamente.",
            icon: 'success',
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
          setTimeout(() => {
            if(cliente === 'Cliente'){
              this.router.navigate(['/home']);  // Redirige al dashboard o página principal
            }
          },1500);
          this.intentoFallido = false; 
          this.botonHabilitado = true;
        },
        error: (err) => {
          console.error('Login failed', err);
          Swal.fire({
            title: err.error.message || 'Ocurrió un error en el login',
            icon: 'error',
            timer: 900000,
            showConfirmButton: true,
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

          this.intentoFallido = true; 
          this.botonHabilitado = false;
        }
      });
      // this.loginForm.disable();
      // this.loginForm.reset();
    }
  }

  olvidaContrasena(){
    this.loading = true
    setTimeout(() => {
      this.router.navigate(['/forgot-password']).then(() => {
        this.loading = false
      })
    }, 1500);

  }

  habilitarBoton() {
    if (this.loginForm.disabled) {
      this.loginForm.enable();
      this.intentoFallido = false; // Reinicia el estado del intento fallido
    }
  }
}
