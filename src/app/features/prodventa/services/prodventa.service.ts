import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdventaService {
  private apiUrl = 'http://localhost:3000/prodventa';
  
  constructor(private http:HttpClient) { }

  getdata(): Observable<any>{
    return this.http.get<any>(this.apiUrl)
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

}
