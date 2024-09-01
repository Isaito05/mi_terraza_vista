import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prodventa',
  templateUrl: './prodventa.component.html',
  styleUrls: ['./prodventa.component.css']
})
export class ProdventaComponent implements OnInit {
  prodventa: any[] = [];
  productData = {
    PROD_VENTA_IMAGEN: null
  };
  constructor(private http: HttpClient) { }

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
    if (this.productData.PROD_VENTA_IMAGEN) {
      formData.append('imagen', this.productData.PROD_VENTA_IMAGEN);
    }
    this.isModalVisible = false;
  }
}


