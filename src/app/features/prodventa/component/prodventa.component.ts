import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ProdventaService } from '../services/prodventa.service';

@Component({
  selector: 'app-prodventa',
  templateUrl: './prodventa.component.html',
  styleUrls: ['./prodventa.component.css']
})
export class ProdventaComponent implements OnInit {
  prodventa: any[] = [];
  productData = {
    PROD_VENTA_NOMBRE: '',
    PROD_VENTA_DESCRIPCION: '',
    PROD_VENTA_PRECIO: '',
    PROD_VENTA_IMAGEN: null as File | null
  };
  constructor(private http: HttpClient,private prodventaService: ProdventaService) { }

  ngOnInit(): void {
    this.getProdventa()
  }


  getProdventa(): void {
    this.http.get<any[]>('http://localhost:3000/prodventa').subscribe(data => {
      this.prodventa = data;
    })
  }

  isModalVisible: boolean = false;

  openModal() {
    this.isModalVisible = true;
  }

  handleClose() {
    this.isModalVisible = false;
  }

  handleConfirm() {
    const formData = new FormData();
  
    // Agregar datos del producto
    formData.append('PROD_VENTA_NOMBRE', this.productData.PROD_VENTA_NOMBRE);
    formData.append('PROD_VENTA_DESCRIPCION', this.productData.PROD_VENTA_DESCRIPCION);
    formData.append('PROD_VENTA_PRECIO', this.productData.PROD_VENTA_PRECIO.toString());
  
    // Primero, guarda los datos del producto
    this.prodventaService.saveData(formData).subscribe(response => {
        const PROD_VENTA_ID = response.PROD_VENTA_ID; // Asumiendo que recibes el ID del nuevo producto
      
        // Luego, sube la imagen si está disponible
        if (this.productData.PROD_VENTA_IMAGEN) {
            this.prodventaService.uploadImage(PROD_VENTA_ID, this.productData.PROD_VENTA_IMAGEN).subscribe(() => {
                this.isModalVisible = false;
                this.getProdventa(); // Actualizar la lista de productos
            });
        } else {
            this.isModalVisible = false;
            this.getProdventa(); // Actualizar la lista de productos
        }
    });
}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
        this.productData.PROD_VENTA_IMAGEN = event.target.files[0];
    } else {
        this.productData.PROD_VENTA_IMAGEN = null; // Manejar el caso en que no se selecciona ningún archivo
    }
}

}


