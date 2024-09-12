import { Component, OnInit } from '@angular/core';
import { ProprovService } from '../service/proprov.service';
import { ProveedorService } from '../../proveedor/service/proveedor.service';

export interface Proveedor {
  PROV_ID: number;
  PROV_NOMBRE: string;
}


@Component({
  selector: 'app-proprov',
  templateUrl: './proprov.component.html',
  styleUrls: ['./proprov.component.css']
})
export class ProprovComponent implements OnInit {
  proprovs: any[] = []; // Variable para almacenar la lista de proprovs
  proveedoresOptions: { value: string; label: string }[] = [];
  constructor(private ProprovService: ProprovService, private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.ProprovService.getData().subscribe(data => {
      this.proprovs = data; // Asigna los datos recibidos a la variable proprovs
      console.log(this.proprovs); // Muestra los datos en la consola para verificar
    });
  }

  
  isModalVisible: boolean = false;

  openModal() {
    this.proveedorService.getProveedor().subscribe((proveedor: Proveedor[]) => {
      this.proveedoresOptions = proveedor.map((proveedor: Proveedor) => ({
        value: proveedor.PROV_ID.toString(), // Convierte el id a string
        label: `${proveedor.PROV_NOMBRE}` // Combina nombres y apellidos para la etiqueta
      }));
      console.log(proveedor);
      this.isModalVisible = true;
    });
  }

  handleClose() {
    this.isModalVisible = false;
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }
}

