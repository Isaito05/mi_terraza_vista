import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/rgu-usuario';
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener un usuario por ID
  getUsuarioById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}