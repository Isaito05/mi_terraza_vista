import { Component, OnInit } from '@angular/core';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { environment } from 'src/environments/environment';

export interface Product {
  PROD_VENTA_ID: number;
  PROD_VENTA_NOMBRE: string;
  PROD_VENTA_PRECIO: number;
  PROD_VENTA_DESCRIPCION: string;
  PROD_VENTA_IMAGEN: string;
  PROD_VENTA_ESTADO: number
}
@Component({
  selector: 'app-menu',
  // standalone: true,
  // imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  menuItems: Product[] = [];

  constructor(private prodventaService: ProdventaService) {}

  ngOnInit(): void {
    this.prodventaService.getData().subscribe((items: Product[]) => {

      this.menuItems = items.filter((item: { PROD_VENTA_ESTADO: number; }) => item.PROD_VENTA_ESTADO === 1);;
      this.menuItems.forEach(item => {
        item.PROD_VENTA_IMAGEN = `${environment.apiUrlHttp}${item.PROD_VENTA_IMAGEN}`;
      });
      console.log(items)
      console.log(this.menuItems)
    });
  }
}
