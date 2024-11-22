import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { ProProv } from '../models/proprov.interface';

@Injectable({
  providedIn: 'root'
})
export class ProprovService {
  private apiUrl = 'http://localhost:3000/proprov';
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener un usuario por ID
  getProprovById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    console.log(data)
    console.log(this.http.post<any>(this.apiUrl, data))
    return this.http.post<any>(this.apiUrl, data);
  }

  updateData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data.PROPROV_ID}`;
    return this.http.put<any>(url, data);
  }
  
  deleteData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data}`;
    const body = {PROPROV_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }

  getProprov(): Observable<ProProv[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((productos: any[]) =>
        productos.map(producto => ({
          PROPROV_ID: producto.PROPROV_ID,
          PROPROV_NOMBRE: producto.PROPROV_NOMBRE,
        }))
      )
    );
   
  }

  
}
