import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlHttp}/bodega`);
  }

  // Método para obtener un usuario por ID
  getBodegaById(id: number): Observable<any> {
    const url = `${environment.apiUrlHttp}/bodega/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlHttp}/bodega`, data);
  }

  updateData(data: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/bodega/${data.BOD_ID}`;
    return this.http.put<any>(url, data);
  }

  deleteData(data: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/bodega/${data}`;
    const body = { BOD_ESTADOE: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }

}
