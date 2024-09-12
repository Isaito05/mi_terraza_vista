import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Proveedor {
  PROV_ID: number;
  PROV_NOMBRE: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:3000/proveedor';
  
  constructor(private http:HttpClient) { }

  getdata(): Observable<any>{
    return this.http.get<any>(this.apiUrl)
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getProveedor(): Observable<Proveedor[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((proveedores: any[]) =>
        proveedores.map(proveedor => ({
           PROV_ID: proveedor. PROV_ID,
           PROV_NOMBRE: proveedor. PROV_NOMBRE,
        }))
      )
    );
  }

  updateData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data.PROV_ID}`;
    return this.http.put<any>(url, data);
  }

  deleteData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data}`;
    const body = { PROV_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }
}
