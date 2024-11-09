import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

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
  selector: 'app-carrito-listar',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './carrito-listar.component.html',
  styleUrl: './carrito-listar.component.css'
})
export class CarritoListarComponent {
  listaItemsCarrito: Product[] | undefined;

  ngOnInit(): void {
    let carritoStorage = localStorage.getItem("carrito") as string;
    let carrito = JSON.parse(carritoStorage);
    this.listaItemsCarrito = carrito;
  }

  vaciarCarrito() {
    localStorage.clear();
    this.listaItemsCarrito = [];
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

  increaseQuantity(item: any): void {
    item.CANTIDAD = Math.min(item.CANTIDAD + 1, 100); 
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
    }// Límite máximo de 5
  }

  decreaseQuantity(item: any): void {
    item.CANTIDAD = Math.max(item.CANTIDAD - 1, 1);
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
        iCarrito.CANTIDAD--;
        carrito[index] = iCarrito;
        localStorage.setItem("carrito", JSON.stringify(carrito));
      }
    } // Límite mínimo de 1
  }

  calculateTotal(): number {
    return this.listaItemsCarrito!.reduce((acc, item) => acc + (item.PROD_VENTA_PRECIO * item.CANTIDAD), 0);
  }

  removeItem(item: any): void {
    const index = this.listaItemsCarrito!.indexOf(item);
    if (index > -1) {
        this.listaItemsCarrito!.splice(index, 1);

        // Actualizar el localStorage después de eliminar el elemento
        localStorage.setItem("carrito", JSON.stringify(this.listaItemsCarrito));
    }
}
}
