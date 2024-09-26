import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdventaService {
  private apiUrl = 'http://localhost:3000/prodventa';
  private apiUrlF = 'http://localhost:3000/upload/file'; 

  constructor(private http:HttpClient) { }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    return this.http.post(this.apiUrlF, formData);
  }

  getData(): Observable<any>{
    return this.http.get<any>(this.apiUrl)
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getProVenById(id: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

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
