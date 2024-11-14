import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  PROD_VENTA_ID: number;
  PROD_VENTA_NOMBRE: string;
  PROD_VENTA_PRECIO: number;
  PROD_VENTA_DESCRIPCION: string;
  PROD_VENTA_IMAGEN: string;
  PROD_VENTA_ESTADO: number;
  CANTIDAD: number
}
@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private ItemsSeleccionados: any[] = [];

  private cartSubject = new BehaviorSubject<any[]>(JSON.parse(localStorage.getItem('carrito') || '[]'));
  cart$ = this.cartSubject.asObservable();
  
  setSelectedItems(items: any[]) {
    console.log('Elementos almacenados en SharedDataService:', this.ItemsSeleccionados); // Log para verificar almacenamiento
    this.ItemsSeleccionados = items;
  }

  getSelectedItems() {
    return this.ItemsSeleccionados;
  }

  // Agregar producto al carrito
  addProduct(cart: Product[]) {
    this.cartSubject.next(cart); // Emitimos el carrito actualizado
  }

  updateCart(cart: Product[]): void {
    this.cartSubject.next(cart);
  }
  // Método para vaciar el carrito
  clearCart(): void {
    this.cartSubject.next([]); // Emite un carrito vacío
  }
  

  // Obtener la cantidad total de productos en el carrito
  getCartCount() {
    const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
    return cart.reduce((total: any, producto: any) => total + producto.CANTIDAD, 0);
  }
}
