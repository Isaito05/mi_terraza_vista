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
}
