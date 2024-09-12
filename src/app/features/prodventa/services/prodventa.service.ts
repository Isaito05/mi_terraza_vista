import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdventaService {
  private apiUrl = 'http://localhost:3000/prodventa';
  constructor(private http:HttpClient) { }

  getData(): Observable<any>{
    return this.http.get<any>(this.apiUrl)
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // uploadImage(PROD_VENTA_ID: number, imageFile: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('PROD_VENTA_IMAGEN', imageFile);
  //   console.log(formData)
  //   return this.http.post<any>(`${this.apiUrl}/src/img/${PROD_VENTA_ID}`, formData);
  // }

//   uploadImage(PROD_VENTA_ID: number, imageFile: File | null): Observable<any> {
//     if (!imageFile) {
//         // Puedes manejar el caso en que no hay archivo
//         return of({ message: 'No file provided' }); // Retorna un observable vacío o algún valor predeterminado
//     }

//     const formData = new FormData();
//     formData.append('imagen', imageFile); // Asegúrate de que el nombre del campo coincida con el esperado en el backend

//     return this.http.post<any>(`${this.apiUrl}/upload/${PROD_VENTA_ID}`, formData);
// }

updateData(data: any): Observable<any> {
  const url = `${this.apiUrl}/${data.PROD_VENTA_ID}`;
  return this.http.put<any>(url, data);
}

deleteData(data: any): Observable<any> {
  const url = `${this.apiUrl}/${data}`;
  const body = { PROD_VENTA_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
  return this.http.put<any>(url, body);
}

}
