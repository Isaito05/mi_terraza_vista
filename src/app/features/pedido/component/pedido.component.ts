import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../pedido/service/pedido.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  pedidos: any[] = []; // Array para almacenar la lista de pedidos

  constructor(private pedidoservice: PedidoService) { }

  ngOnInit(): void {
    this.pedidoservice.getData().subscribe(data => {
      // Supongamos que `data` es un array de pedidos
      this.pedidos = data.map((pedidos: { PED_INFO: string | never[]; }) => {
        // Parsear `PED_INFO` si es una cadena JSON
        if (typeof pedidos.PED_INFO === 'string') {
          try {
            pedidos.PED_INFO = JSON.parse(pedidos.PED_INFO);
          } catch (error) {
            console.error('Error parsing PED_INFO JSON', error);
            pedidos.PED_INFO = []; // Asigna un array vacío en caso de error
          }
        }
        return pedidos;
      });
      console.log(this.pedidos);
      console.log(this.pedidos[0].rguUsuario.RGU_ID); // Muestra los datos en la consola para verificar
    });
  }
}
