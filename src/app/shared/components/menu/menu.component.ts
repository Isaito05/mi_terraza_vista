import { Component, Input, OnInit } from '@angular/core';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { environment } from 'src/environments/environment';

export interface Product {
  PROD_VENTA_ID: number;
  PROD_VENTA_NOMBRE: string;
  PROD_VENTA_PRECIO: number;
  PROD_VENTA_DESCRIPCION: string;
  PROD_VENTA_IMAGEN: string;
  PROD_VENTA_ESTADO: number;
  CANTIDAD: 1
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
  cartCount: number = 0;


  constructor(private prodventaService: ProdventaService) { }

  ngOnInit(): void {
    this.loadMenuItems();
   
  }

 ngOnChange(){
  this.updateCartCount();
 }

 updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
  this.cartCount = cart.length; // Número de productos en el carrito
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

  agregarCarrito(item: Product) {
    // console.log(item, 'samuel');
    let iCarrito: Product = {
      PROD_VENTA_ID: item.PROD_VENTA_ID,
      PROD_VENTA_NOMBRE: item.PROD_VENTA_NOMBRE,
      PROD_VENTA_PRECIO: item.PROD_VENTA_PRECIO,
      PROD_VENTA_DESCRIPCION: item.PROD_VENTA_DESCRIPCION,
      PROD_VENTA_IMAGEN: item.PROD_VENTA_IMAGEN,
      PROD_VENTA_ESTADO: item.PROD_VENTA_ESTADO,
      CANTIDAD: 1,
    }

    if (localStorage.getItem("carrito") === null) {
      let carrito: Product[] = [];
      carrito.push(iCarrito);
      localStorage.setItem("carrito", JSON.stringify(carrito));
    }else{
      let carritoStorage = localStorage.getItem("carrito") as string;
      let carrito = JSON.parse(carritoStorage);
      let index = -1;
      for(let i = 0; i < carrito.length; i++){
        let itemC: Product = carrito[i];
        if(iCarrito.PROD_VENTA_ID === itemC.PROD_VENTA_ID){
          index = i;
          break;
        }
      }
      if(index === -1){
        carrito.push(iCarrito);
        localStorage.setItem("carrito", JSON.stringify(carrito));
      }else{
        let iCarrito: Product = carrito[index];
        iCarrito.CANTIDAD++;
        carrito[index] = iCarrito;
        localStorage.setItem("carrito", JSON.stringify(carrito));
      }
    }
  }
  formatCurrency(value: any): string {
    if (value == null) {
      return '';
    }

    if (typeof value === 'number') {
      return `$ ${value.toLocaleString('es-ES')}`;
    }

    // Convertir cadenas numéricas a número
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    if (!isNaN(numericValue)) {
      return `$ ${numericValue.toLocaleString('es-ES')}`;
    }

    // Si no es un número, devolver el valor como cadena
    return value.toString();
  }
}
