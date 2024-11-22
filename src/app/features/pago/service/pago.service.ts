import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlHttp}/pago`);
  }

  // Método para obtener un usuario por ID
  getPagoById(id: number): Observable<any> {
    const url = `${environment.apiUrlHttp}/pago/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlHttp}/pago`, data);
  }

  updateData(data: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/pago/${data.PAGO_ID}`;
    return this.http.put<any>(url, data);
  }

  deleteData(data: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/pago/${data}`;
    const body = { PAGO_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }
}
