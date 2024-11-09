import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import * as CryptoJS from 'crypto-js';

const secretKey = 'Secret-key'
function decryptData(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  rol: string = ""
  secretKey = 'your-secret-key';
  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }
  login(email: string, password: string): Observable<any> {
    console.log( email, password)
    console.log(`${environment.apiUrlHttp}`)

    return this.http.post<any>(`${environment.apiUrlHttp}/auth/login`, { email, password })
    .pipe(
      map(response => {
        // Guardar el token en localStorage o sessionStorage
        sessionStorage.setItem('token', response.access_token);
        const decodedToken: any = jwtDecode(response.access_token);
        const user = {
          RGU_NOMBRES: decodedToken.nombre,
          RGU_APELLIDOS: decodedToken.apellido,
          RGU_IMG_PROFILE: decodedToken.i_perfil
        }
        sessionStorage.setItem('user', JSON.stringify(user));
        // Emitir los cambios del usuario
        this.usuarioService.setUsuario(user);
        this.rol = decodedToken.rol
        // console.log('Rol decodificado después de iniciar sesión:', this.rol);
        if (this.rol === 'Administrador') {
          console.log('Redirigiendo a módulo de usuario...');
          this.router.navigate(['/usuario']);
        } else if (this.rol === 'Trabajador') {
          console.log('Redirigiendo a módulo de usuario...');
          this.router.navigate(['/pedido']);
        } 
        // else {
        //   this.router.navigate(['/home']);
        // }
        return response;
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    if(this.rol === 'Administrador' || this.rol === 'Trabajador' ){
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/']);
    }
    localStorage.clear();
  }

  public loggedIn(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  requestPasswordReset(email: string): Observable<any> {
    console.log('Requesting password reset for email:', email); 
    return this.http.post(`${environment.apiUrlHttp}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    console.log('Requesting password reset for email:', token, password);
    return this.http.post(`${environment.apiUrlHttp}/auth/reset-password`, { token, password });
  }
}
