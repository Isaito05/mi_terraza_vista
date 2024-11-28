import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdventaService { 

  constructor(private http:HttpClient) { }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    return this.http.post(`${environment.apiUrlHttp}/upload/file`, formData);
  }

  getData(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrlHttp}/prodventa`)
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlHttp}/prodventa`, data);
  }

  getProVenByIds(ids: number[]): Observable<any[]> {
    const params = { ids: ids.join(',') }; // Convierte el arreglo de IDs a un string separado por comas
    return this.http.get<any[]>(`${environment.apiUrlHttp}/prodventa/bulk`, { params });
  }

  getProVenById(id: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/prodventa/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  updateData(data: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/prodventa/${data.PROD_VENTA_ID}`;
    return this.http.put<any>(url, data);
  }

  deleteData(data: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/prodventa/${data}`;
    const body = { PROD_VENTA_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }

}
