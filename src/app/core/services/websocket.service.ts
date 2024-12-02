import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;

  constructor() {
    // Conexión al servidor de WebSocket
    this.socket = io(`${environment.apiUrlHttp}`); // Cambia la URL según tu configuración
  }

  // Método para escuchar eventos
  on(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data) => subscriber.next(data));
    });
  }

  // Método para emitir eventos (si necesitas enviar datos)
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
