import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/pedido';
  historialPedidos: any[] = [];
  private pedidosSubject = new BehaviorSubject<any[]>([]);
  private notificacionSubject = new BehaviorSubject<boolean>(false);
  notificacion$: Observable<boolean> = this.notificacionSubject.asObservable();
  constructor(private http: HttpClient) { }

  // Método para obtener datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener un usuario por ID
  getPedidoById(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  getPedidoByUsuId(id: number): Observable<any> {
    const url = `${this.apiUrl}/usuario/${id}`; // Construye la URL con el ID
    return this.http.get<any>(url); // Realiza la solicitud GET a la URL con el ID
  }

  saveData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data.PED_ID}`;
    return this.http.put<any>(url, data);
  }

  deleteData(data: any): Observable<any> {
    const url = `${this.apiUrl}/${data}`;
    const body = {PED_ESTADOE: 2}; // El cuerpo de la solicitud contiene solo el campo a actualizar
    console.log(this.http.put<any>(url, body))
    return this.http.put<any>(url, body);
  }

  // agregarPedido(pedido: any) {
  //   // const historialActual = this.obtenerHistorial();
  //   this.historialPedidos.push(pedido);
  //   localStorage.setItem('historialPedidos', JSON.stringify(this.historialPedidos));
  //   this.pedidosSubject.next(this.historialPedidos);
  // }

  // cargarHistorialDesdeLocalStorage() {
  //   const pedidos = localStorage.getItem('historialPedidos');
  //   if (pedidos) {
  //     this.historialPedidos = JSON.parse(pedidos);
  //   }
  // }

  // getPedidosObservable() {
  //   return this.pedidosSubject.asObservable();
  // }

  // obtenerHistorial(): any[] {
  //   if (this.historialPedidos.length === 0) {
  //     const localHistorial = localStorage.getItem('historialPedidos');
  //     this.historialPedidos = localHistorial ? JSON.parse(localHistorial) : [];
  //   }
  //   return this.historialPedidos;
  // }

  actualizarPedidos(pedidos: any[]): void {
    this.pedidosSubject.next(pedidos); // Actualiza el estado de pedidos
  }

  getPedidosObservable(): Observable<any[]> {
    return this.pedidosSubject.asObservable(); // Permite que otros componentes escuchen cambios
  }

  activarNotificacion() {
    this.notificacionSubject.next(true);
    localStorage.setItem('hayNotificacion', JSON.stringify(true));
  }

  desactivarNotificacion() {
    this.notificacionSubject.next(false);
    localStorage.setItem('hayNotificacion', JSON.stringify(false));
  }

  getEstadoNotificacion(): boolean {
    return JSON.parse(localStorage.getItem('hayNotificacion') || 'false');
  }
 
}
