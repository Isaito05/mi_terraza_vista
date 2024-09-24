import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private apiUrl = 'http://localhost:3000/auth/login';
  // Cambia el puerto si es necesario

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password })
    .pipe(
      map(response => {
        // Guardar el token en localStorage o sessionStorage
        sessionStorage.setItem('token', response.access_token);
        return response;
      })
    );
  }


  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('apellido');
    this.router.navigate(['/login']);
  }

  public get loggedIn(): boolean {
    return sessionStorage.getItem('token') !== null;
  }


}
