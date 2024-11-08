import { Component, Input, OnInit } from '@angular/core';
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
  @Input() productLimit: number = 0;  // Propiedad que definirá el límite de productos a mostrar
  menuItems: Product[] = [];

  constructor(private prodventaService: ProdventaService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.prodventaService.getData().subscribe((items: Product[]) => {
      // Filtrar productos que están activos
      this.menuItems = items.filter((item: Product) => item.PROD_VENTA_ESTADO === 1);

      // Agregar la URL completa de la imagen
      this.menuItems.forEach(item => {
        item.PROD_VENTA_IMAGEN = `${environment.apiUrlHttp}${item.PROD_VENTA_IMAGEN}`;
      });

      // Limitar la cantidad de productos a mostrar, si se establece 'productLimit'
      if (this.productLimit > 0) {
        this.menuItems = this.menuItems.slice(0, this.productLimit);
      }
    });
  }
}
