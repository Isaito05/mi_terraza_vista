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

  public cartSubject = new BehaviorSubject<any[]>(JSON.parse(localStorage.getItem('carrito') || '[]'));
  cart$ = this.cartSubject.asObservable();
  
  setSelectedItems(items: any[]) {
    console.log('Elementos almacenados en SharedDataService:', this.ItemsSeleccionados); // Log para verificar almacenamiento
    this.ItemsSeleccionados = items;
  }

  getSelectedItems() {
    return this.ItemsSeleccionados;
  }

  // // Agregar producto al carrito
  // addProduct(cart: Product[]) {
  //   this.cartSubject.next(cart); // Emitimos el carrito actualizado
  // }

  generateProductKey(product: any): string {
    const size = product.selectedSize || '';
    // const ingredients = product.extraIngredients ? product.extraIngredients.map((i: any) => i.name).join(',') : '';
    const selectedIngredients = product.extraIngredients ? product.extraIngredients.filter((i: any) => i.selected).map((i: any) => i.name).join(','): '';
    const descripcion = product.specialInstructions || ''
    // Generar una clave que incluya tamaño, ingredientes y otros detalles de personalización
    const key = `${product.PROD_VENTA_ID}-${size}-${selectedIngredients}-${descripcion}`;
    
    console.log('Generated ingrediente key:', selectedIngredients); // Verifica la nueva clave generada
    console.log('Generated product key:', key); // Verifica la nueva clave ge
    return key;
  }

  


  addProduct(product: any, customizations: any) {
    console.log('Detalles de producto:', product);
    console.log('Detalles de customizacon:', customizations);
    const customizedProduct = {
      ...product,
      // ...customizations,
    };
   console.log(customizedProduct,"esta vina trae lo siguinete ")
    // Generar la clave única para el producto personalizado
    const productKey = this.generateProductKey(customizedProduct);
  
    const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
  
    const existingProduct = cart.find((item: any) => this.generateProductKey(item) === productKey);
  
    if (existingProduct) {
      existingProduct.CANTIDAD += customizedProduct.CANTIDAD || 1;
    } else {
      // productKey = productKey + timestamp + randomNumber
      cart.push({ ...customizedProduct, productKey });
    }
    localStorage.setItem('carrito', JSON.stringify(cart));
    this.cartSubject.next(cart);
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
