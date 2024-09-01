import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';
import { ProprovService } from '../../proprov/service/proprov.service';

export interface ProProv {
  PROPROV_ID: number;
  PROPROV_NOMBRE: string;
}

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent implements OnInit {
  bodegas: any[] = [];
  proprov: any[] = [];
  proprovMap: { [key: number]: string } = {}; // Mapa para relacionar ID con nombre
  productosoOptions: { value: string; label: string }[] = [];

  constructor(private http: HttpClient,
    private proporvService: ProprovService
    ) { }

  ngOnInit(): void {
    this.getBodegas();
    
  }

  getBodegas(): void {
    this.http.get<any[]>('http://localhost:3000/bodega').subscribe(data => {
      this.bodegas = data;
    });
  }

  isModalVisible: boolean = false;


  openModal() {
    this.proporvService.getProprov().subscribe((productos: ProProv[]) => {
      this.productosoOptions = productos.map((producto: ProProv) => ({
        value: producto.PROPROV_ID.toString(), // Convierte el id a string
        label: `${producto.PROPROV_NOMBRE}` // Combina nombres y apellidos para la etiqueta
      }));
      console.log(productos);
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
