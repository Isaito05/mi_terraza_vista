import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

    constructor(private http: HttpClient) { }
  
    // Método para obtener datos de la API
    getData(): Observable<any> {
      return this.http.get<any>(`${environment.apiUrlHttp}/factura`);
    }
  
    // Método para obtener un usuario por ID
    getFacturaById(id: number): Observable<any> {
      const url = `${environment.apiUrlHttp}/factura/${id}`; // Construye la URL con el ID
      return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
    }
  
    saveData(data: any): Observable<any> {
      console.log(data)
      return this.http.post<any>(`${environment.apiUrlHttp}/factura`, data);
    }
  
    updateData(data: any): Observable<any> {
      const url = `${environment.apiUrlHttp}/factura/${data.factura_ID}`;
      return this.http.put<any>(url, data);
    }
  
    deleteData(data: any): Observable<any> {
      const url = `${environment.apiUrlHttp}/factura/${data}`;
      const body = { FACTURA_ESTADOE: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
      return this.http.put<any>(url, body);
    }
  }

