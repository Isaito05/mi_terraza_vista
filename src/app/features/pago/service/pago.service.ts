import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'http://localhost:3000/pago';
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener un usuario por ID
  getPagoById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data.PAGO_ID}`;
    return this.http.put<any>(url, data);
  }

  deleteData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data}`;
    const body = { PAGO_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }

}
