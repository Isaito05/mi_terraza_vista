import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {
  private apiUrl = 'http://localhost:3000/bodega';
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener un usuario por ID
  getBodegaById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data.BOD_ID}`;
    return this.http.put<any>(url, data);
  }

  deleteData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data}`;
    const body = { BOD_ESTADOE: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }

}
