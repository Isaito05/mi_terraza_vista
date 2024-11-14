import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { DatosService } from 'src/app/core/services/datos.service';
import { FormsModule } from '@angular/forms';

export interface Product {
  PROD_VENTA_ID: number;
  PROD_VENTA_NOMBRE: string;
  PROD_VENTA_PRECIO: number;
  PROD_VENTA_DESCRIPCION: string;
  PROD_VENTA_IMAGEN: string;
  PROD_VENTA_ESTADO: number;
  CANTIDAD: number
}

@Component({
  selector: 'app-carrito-listar',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './carrito-listar.component.html',
  styleUrl: './carrito-listar.component.css'
})
export class CarritoListarComponent {
  listaItemsCarrito: Product[] | undefined;
  cartCount: number = 0;
  currentDate: Date = new Date();
  deliveryOption: string = '';
  showQrCode: boolean = false;

  constructor(
    private datoService: DatosService
  ){}

  ngOnInit(): void {
    let carritoStorage = localStorage.getItem("carrito") as string;
    let carrito = carritoStorage ? JSON.parse(carritoStorage) : [];
    this.cartCount = carrito.reduce((total: any, item: any) => total + item.CANTIDAD, 0);
    this.listaItemsCarrito = carrito;

    this.datoService.cart$.subscribe(cart => {
      this.listaItemsCarrito = cart;
      this.cartCount = cart.length > 0 ? cart.reduce((total, item) => total + item.CANTIDAD, 0) : 0;
    });
  }

  calculateSubtotal(): number {
    return this.listaItemsCarrito!.reduce((total, item) => total + (item.PROD_VENTA_PRECIO * item.CANTIDAD), 0);
  }
  
  calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const shipping = 20; // o la lógica que desees usar para el costo de envío
    return subtotal + shipping;
  }

  onDeliveryOptionChange() {
    this.showQrCode = this.deliveryOption === 'immediate';
  }

  confirmOrder() {
    if (this.deliveryOption === 'immediate' && !this.showQrCode) {
      alert('Please scan the QR code to complete your payment.');
      return;
    }
    
    const confirmed = confirm('Please verify your information and address before placing the order. Do you want to continue?');
    if (confirmed) {
      // Lógica para finalizar el pedido
      alert('Order placed successfully!');
    }
  }
  

  vaciarCarrito() {
    localStorage.clear();
    this.listaItemsCarrito = [];
    // this.cartCount = 0;
    this.datoService.clearCart();
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

  increaseQuantity(item: Product): void {
    // Obtener el carrito actual del localStorage
    let carrito: Product[] = JSON.parse(localStorage.getItem("carrito") || '[]');
    
    // Encontrar el producto en el carrito y aumentar la cantidad
    const index = carrito.findIndex((product) => product.PROD_VENTA_ID === item.PROD_VENTA_ID);
    if (index > -1) {
      item.CANTIDAD = carrito[index].CANTIDAD = Math.min(carrito[index].CANTIDAD + 1, 100); // Limitar la cantidad a 100
    } else {
      // Si el producto no existe en el carrito, lo agregamos
      item.CANTIDAD = 1;
      carrito.push(item);
    }
  
    // Actualizar el carrito en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Emitir el carrito actualizado al servicio para actualizar el contador
    this.datoService.addProduct(carrito);
  }
  
  decreaseQuantity(item: Product): void {
    // Obtener el carrito actual del localStorage
    let carrito: Product[] = JSON.parse(localStorage.getItem("carrito") || '[]');
    
    // Encontrar el producto en el carrito y reducir la cantidad
    const index = carrito.findIndex((product) => product.PROD_VENTA_ID === item.PROD_VENTA_ID);
    if (index > -1) {
      item.CANTIDAD = carrito[index].CANTIDAD = Math.max(carrito[index].CANTIDAD - 1, 1); // Limitar la cantidad mínima a 1
    }
  
    // Actualizar el carrito en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Emitir el carrito actualizado al servicio para actualizar el contador
    this.datoService.addProduct(carrito);
  }
  
  removeItem(item: any): void {
    // Buscar el índice del elemento en la lista del carrito
    const index = this.listaItemsCarrito!.indexOf(item);
    if (index > -1) {
      this.listaItemsCarrito?.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(this.listaItemsCarrito));
      this.datoService.updateCart(this.listaItemsCarrito!); // Actualizar el servicio
    }
  }

  getTruncatedText(text: string): string {
    if (!text) return ''; // Maneja casos donde el texto sea nulo o indefinido
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  }
  
  // calculateTotal(): number {
  //   return this.listaItemsCarrito!.reduce((acc, item) => acc + (item.PROD_VENTA_PRECIO * item.CANTIDAD), 0);
  // }
}
