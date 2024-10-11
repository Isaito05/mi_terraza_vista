import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Usuario {
  RGU_ID: number;
  RGU_NOMBRES: string;
  RGU_APELLIDOS: string;
  RGU_ROL: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrlHttp}/rgu-usuario`;
  private apiUrlF = 'http://localhost:3000/upload/file'; 
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener un usuario por ID
  getUsuarioById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateData(data: any): Observable<any> {
    console.log('Datos que se van a enviar para actualizar:', data);
    const url = `${this.apiUrl}/${data.RGU_ID}`;
    return this.http.put<any>(url, data);
  }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    return this.http.post(this.apiUrlF, formData);
  }

  deleteData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data}`;
    const body = { RGU_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((usuarios: any[]) => 
        usuarios.map(usuario => ({
          RGU_ID: usuario.RGU_ID,
          RGU_NOMBRES: usuario.RGU_NOMBRES,
          RGU_APELLIDOS: usuario.RGU_APELLIDOS,
          RGU_ROL: usuario.RGU_ROL
        }))
      )
    );
  }
}
