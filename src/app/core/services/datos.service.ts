import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  addProduct(product: any) {
    const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existingProduct = cart.find((item: any) => item.PROD_VENTA_ID === product.PROD_VENTA_ID);
    if (existingProduct) {
      existingProduct.CANTIDAD += product.CANTIDAD;
    } else {
      cart.push(product);
    }
    localStorage.setItem('carrito', JSON.stringify(cart));
    this.cartSubject.next(cart);  // Emitir el nuevo carrito
  }

  // Obtener la cantidad total de productos en el carrito
  getCartCount() {
    const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
    return cart.reduce((total: any, producto: any) => total + producto.CANTIDAD, 0);
  }
}
