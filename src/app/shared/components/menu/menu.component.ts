import { Component, Input, OnInit } from '@angular/core';
import { DatosService } from 'src/app/core/services/datos.service';
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


  constructor(private prodventaService: ProdventaService,  private datoService: DatosService) { }

  ngOnInit(): void {
    this.loadMenuItems();
    // this.datoService.cart$.subscribe(cart => {
    //   console.log('Contenido actualizado del carrito:', cart);
    //   this.cartCount = cart.reduce((total, producto) => total + producto.CANTIDAD, 0); // Actualizar el contador con la cantidad total
    // })
   
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
    // Crear el producto para el carrito, inicializando CANTIDAD en 1
    let iCarrito: Product = {
      PROD_VENTA_ID: item.PROD_VENTA_ID,
      PROD_VENTA_NOMBRE: item.PROD_VENTA_NOMBRE,
      PROD_VENTA_PRECIO: item.PROD_VENTA_PRECIO,
      PROD_VENTA_DESCRIPCION: item.PROD_VENTA_DESCRIPCION,
      PROD_VENTA_IMAGEN: item.PROD_VENTA_IMAGEN,
      PROD_VENTA_ESTADO: item.PROD_VENTA_ESTADO,
      CANTIDAD: 1,
    };
  
    let carrito: Product[] = JSON.parse(localStorage.getItem("carrito") || '[]');
  
    // Buscar si el producto ya existe en el carrito
    const existingProductIndex = carrito.findIndex((p) => p.PROD_VENTA_ID === iCarrito.PROD_VENTA_ID);
  
    if (existingProductIndex === -1) {
      // Si el producto no está en el carrito, lo agregamos
      carrito.push(iCarrito);
    } else {
      // Si el producto ya está, incrementamos la cantidad
      carrito[existingProductIndex].CANTIDAD += 1;
    }
  
    // Actualizamos el carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
  
    // Emitimos el carrito completo a través de `cartSubject` en el servicio `DatosService`
    this.datoService.addProduct(carrito);
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
