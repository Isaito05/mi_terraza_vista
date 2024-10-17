import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authService: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlHttp}/auth/login`, { email, password })
    .pipe(
      map(response => {
        // Guardar el token en localStorage o sessionStorage
        sessionStorage.setItem('token', response.access_token);
        const decodedToken: any = jwtDecode(response.access_token);
        const rol = decodedToken.rol
        console.log('Rol decodificado después de iniciar sesión:', rol);
        if (rol === 'Administrador') {
          console.log('Redirigiendo a módulo de usuario...');
          this.router.navigate(['/usuario']);
        } else if (rol === 'Trabajador') {
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
    this.router.navigate(['/login']);
  }

  public get loggedIn(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  requestPasswordReset(email: string): Observable<any> {
    console.log('Requesting password reset for email:', email); 
    return this.http.post(`${environment.apiUrlHttp}auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    console.log('Requesting password reset for email:', token, password);
    return this.http.post(`${environment.apiUrlHttp}auth/reset-password`, { token, password });
  }
}
