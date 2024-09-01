import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ProProv {
  PROPROV_ID: number;
  PROPROV_NOMBRE: string;
}

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
