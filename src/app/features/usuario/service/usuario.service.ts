import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Usuario } from '../models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<any>(null);
  $usuario = this.usuarioSubject.asObservable();
  secretKey = 'your-secret-key';
  constructor(private http: HttpClient) { 
    const usuario = sessionStorage.getItem('user');
    if (usuario) {
      try {
        const decryptedData = this.decryptData(usuario); // Desencriptar los datos
        this.usuarioSubject.next(JSON.parse(decryptedData)); // Luego parsear
      } catch (error) {
        console.error('Error al desencriptar o parsear los datos del usuario:', error);
        // Manejar el error adecuadamente (ej. limpiar sessionStorage, mostrar un mensaje, etc.)
      }
    }
  }

  private decryptData(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlHttp}/rgu-usuario`);
  }

  // Método para obtener un usuario por ID
  getUsuarioById(id: number): Observable<any> {
    const url = `${environment.apiUrlHttp}/rgu-usuario/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlHttp}/rgu-usuario`, data);
  }

  updateData(data: any): Observable<any> {
    console.log('Datos que se van a enviar para actualizar:', data);
    const url = `${environment.apiUrlHttp}/rgu-usuario/${data.RGU_ID}`;
    const dataToUpdate = { ...data };
    console.log(dataToUpdate)
    delete dataToUpdate.RGU_PASSWORD; 
    return this.http.put<any>(url, dataToUpdate).pipe(
      tap((response) => {
        const usuarioActualizado = {
          RGU_NOMBRES: response.RGU_NOMBRES,
          RGU_APELLIDOS: response.RGU_APELLIDOS,
          RGU_IMG_PROFILE: response.RGU_IMG_PROFILE,
          RGU_DIRECCION: response.DIRECCION,
        }
        // const encryptedUsuario = encryptData(JSON.stringify(usuarioActualizado));
        sessionStorage.setItem('user', this.encryptData(usuarioActualizado));
        this.usuarioSubject.next(usuarioActualizado);
      })
    );
  }

  setUsuario(usuario: any) {
    // Método para actualizar el BehaviorSubject
    this.usuarioSubject.next(usuario);
  }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('files', file, file.name);

    return this.http.post(`${environment.apiUrlHttp}/upload/file`, formData);
  }

  deleteData(data: any): Observable<any> {
    const url = `${environment.apiUrlHttp}/rgu-usuario/${data}`;
    const body = { RGU_ESTADO: 2 }; // El cuerpo de la solicitud contiene solo el campo a actualizar
    return this.http.put<any>(url, body).pipe(
      tap(() => {
        // Si estás eliminando el usuario actual, también elimina los datos locales
        sessionStorage.removeItem('user');
        this.usuarioSubject.next(null);  // Resetea el BehaviorSubject
      })
    );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any[]>(`${environment.apiUrlHttp}/rgu-usuario`).pipe(
      map((usuarios: any[]) => 
        usuarios.map(usuario => ({
          RGU_ID: usuario.RGU_ID,
          RGU_NOMBRES: usuario.RGU_NOMBRES,
          RGU_IDENTIFICACION: usuario.RGU_IDENTIFICACION,
          RGU_APELLIDOS: usuario.RGU_APELLIDOS,
          RGU_ROL: usuario.RGU_ROL,
          RGU_CORREO: usuario.RGU_CORREO
        }))
      )
    );
  }
}
