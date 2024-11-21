import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { DatosService } from 'src/app/core/services/datos.service';

import {MatRadioModule} from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

export interface Product {
  productKey: any;
  isExpanded: any;
  PROD_VENTA_ID: number;
  PROD_VENTA_NOMBRE: string;
  PROD_VENTA_PRECIO: number;
  PROD_VENTA_DESCRIPCION: string;
  PROD_VENTA_IMAGEN: string;
  PROD_VENTA_ESTADO: number;
  CANTIDAD: number
  selectedSize: string; // Nuevo campo
  extraIngredients: any[];
  specialInstructions?: string;
  priceWithCustomization?: number;
}

@Component({
  selector: 'app-carrito-listar',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule, MatTooltipModule, RouterModule, MatRadioModule],
  templateUrl: './carrito-listar.component.html',
  styleUrl: './carrito-listar.component.css'
})
export class CarritoListarComponent {

  // listaItemsCarrito: Product[] | undefined;
  listaItemsCarrito: Product[] = [];
  cartCount: number = 0;
  currentDate: Date = new Date();
  deliveryOption: string = '';
  showQrCode: boolean = false;
  deliveryOption_e: string = 'immediate'; // Valor inicial
  estimatedDeliveryTime: string = '30-45 minutos';

  // selectedItem: any = null;
  sizes = ['Pequeño', 'Mediano', 'Grande']; // Ejemplo de tamaños disponibles
  extraIngredients = [
    { name: 'Queso extra', price: 2000, selected: false },
    { name: 'Pepperoni', price: 2500, selected: false },
    { name: 'Champiñones', price: 1500, selected: false }
  ]; // Ejemplo de ingredientes adicionales
  basePrice = 0;
  totalExtras = 0;

  selectedItem: Product = {
    isExpanded: false,
    PROD_VENTA_ID: 0,
    PROD_VENTA_NOMBRE: '',
    PROD_VENTA_PRECIO: 0,
    PROD_VENTA_DESCRIPCION: '',
    PROD_VENTA_IMAGEN: '',
    PROD_VENTA_ESTADO: 1,
    CANTIDAD: 1,
    selectedSize: '',
    extraIngredients: [],
    specialInstructions: '',
    productKey: undefined
  };
  imagen: any;

  constructor(
    private datoService: DatosService
  ){}

  ngOnInit(): void {
    this.cargarCarritoDesdeLocalStorage();
    this.listaItemsCarrito = this.listaItemsCarrito.map(item => ({ ...item, isExpanded: false }));
    console.log(this.listaItemsCarrito, 'a')
  }

  calculateTotal(): number {
    return this.listaItemsCarrito.reduce((total, item) => {
      const extrasCost = this.calculateExtras(item.extraIngredients || []);
      return total + (item.PROD_VENTA_PRECIO + extrasCost) * item.CANTIDAD;
    }, 0);
  }

  calculateSubtotal(): number {
    // Calcula el subtotal
    return this.listaItemsCarrito.reduce((acc, item) => acc + item.CANTIDAD * item.PROD_VENTA_PRECIO, 0);
  }

  calculateIVA(): number {
    // Calcula el IVA como el 10% del subtotal
    return this.calculateSubtotal() * 0.1;
  }

  onDeliveryOptionChangeFac(): void {
    // Actualiza la estimación del tiempo de entrega según la opción seleccionada
    this.estimatedDeliveryTime = this.deliveryOption_e === 'immediate' ? '30-45 minutos' : '1-2 horas';
  }

  calculateDiscount(): number {
    // Retorna un descuento fijo (si aplica)
    return 50; // Ejemplo
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

  getIngredientList(ingredients: any[]): string {
    return ingredients && ingredients.length > 0 
    ? ingredients.map(ingredient => `${ingredient.name} (${this.formatCurrency(ingredient.price)})`).join(', ')
    : 'Sin adicionales';
  }

  getIngredientListFac(ingredients: any[]): string {
    if (!ingredients || ingredients.length === 0) {
        return 'Sin adicionales';
    }
    const ingredientList = ingredients
        .map(ingredient => `${ingredient.name}`)
        .join(', ');

    return `${ingredientList}.`;
  }

  calcularTotalAdicionales(ingredients: any[]): string {
    const total = ingredients?.reduce((sum, ing) => sum + ing.price, 0) || 0;
    return this.formatCurrency(total);
  }


  
  vaciarCarrito() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará todos los productos del carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Vaciar el carrito si se confirma
        localStorage.clear();
        this.listaItemsCarrito = [];
        this.guardarCarritoEnLocalStorage();
        Swal.fire(
          'Carrito vacío',
          'Todos los productos han sido eliminados del carrito.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Mensaje opcional si se cancela
        Swal.fire(
          'Acción cancelada',
          'No se eliminaron los productos del carrito.',
          'info'
        );
      }
    });
  }

  formatCurrency(value: any): string {
    if (typeof value === 'number') {
      return `$ ${value.toLocaleString('es-ES')}`;
    }
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    return isNaN(numericValue) ? value.toString() : `$ ${numericValue.toLocaleString('es-ES')}`;
  }

  increaseQuantity(item: Product): void {
    item.CANTIDAD += 1;
    console.log("Cantidad aumentada:", item.CANTIDAD);
    this.guardarCarritoEnLocalStorage();
  }

  decreaseQuantity(item: Product): void {
    if (item.CANTIDAD > 1) {
    item.CANTIDAD -= 1;
    console.log("Cantidad disminuida:", item.CANTIDAD);
  } else {
    // Pregunta al usuario si desea eliminar el producto
    const confirmar = confirm("¿Quieres eliminar este producto del carrito?");
    if (confirmar) {
      this.removeItem(item);
      return;
    }
  }
  this.guardarCarritoEnLocalStorage();
  }

  removeItem(item: Product): void {
    const index = this.listaItemsCarrito.indexOf(item);
    if (index > -1) {
      this.listaItemsCarrito.splice(index, 1);
      console.log("Producto eliminado:", item);
      this.guardarCarritoEnLocalStorage();
    }
}

  getTruncatedText(text: string): string {
    if (!text) return ''; // Maneja casos donde el texto sea nulo o indefinido
    return text.length > 40 ? text.substring(0, 40) + '...' : text;
  }
  
  // calculateTotal(): number {
  //   return this.listaItemsCarrito!.reduce((acc, item) => acc + (item.PROD_VENTA_PRECIO * item.CANTIDAD), 0);
  // }

  hasSelectedIngredients(): boolean {
    return this.extraIngredients.some(ingredient => ingredient.selected);
  }

  cargarCarritoDesdeLocalStorage(): void {
    const carritoStorage = localStorage.getItem("carrito");
    this.listaItemsCarrito = carritoStorage ? JSON.parse(carritoStorage) : [];
    this.listaItemsCarrito.forEach(item => {
      if (!item.productKey) {
        item.productKey = this.datoService.generateProductKey(item);
      }
    });
    console.log("Carrito cargado desde localStorage:", this.listaItemsCarrito);
  }
  
  guardarCarritoEnLocalStorage(): void {
    console.log("Guardando en localStorage:", this.listaItemsCarrito);
    localStorage.setItem("carrito", JSON.stringify(this.listaItemsCarrito));
    this.datoService.cartSubject.next(this.listaItemsCarrito);
  }

  // Calcular el precio de los ingredientes extras
  calculateExtras(extraIngredients: any[] = []): number {
    return extraIngredients.reduce((acc, ingredient) => {
      return ingredient.selected ? acc + ingredient.price : acc;
    }, 0);
  }
  
  // Calcular el precio total en el modal
  calculateTotalPrice() {
    return this.basePrice + this.calculateExtras(this.extraIngredients);
  }

  // Método para abrir el modal de edición
  openEditModal(item: Product) {
    // Copiamos los datos del producto para no modificar el original
    this.selectedItem = { ...item };
    this.imagen = this.selectedItem.PROD_VENTA_IMAGEN
    
    // Asegurarnos de que los ingredientes adicionales estén correctamente inicializados
    this.selectedItem.extraIngredients = this.selectedItem.extraIngredients || [];
  
    // Guardamos el precio base y calculamos el costo de los extras
    this.basePrice = item.PROD_VENTA_PRECIO;
    this.totalExtras = this.calculateExtras(this.selectedItem.extraIngredients);
  
    // Actualizamos el estado de los ingredientes adicionales seleccionados en el modal
    this.extraIngredients.forEach(ingredient => {
      // Marca si el ingrediente está seleccionado en el producto
      const isSelected = this.selectedItem.extraIngredients.some(
        (selected: any) => selected.name === ingredient.name && selected.selected
      );
      ingredient.selected = isSelected; // Marcar como seleccionado o no
    });
  
    // Mostrar el modal
    const customizationModal = new bootstrap.Modal(document.getElementById('customizationModal')!);
    customizationModal.show();
  }
  
 // Método para actualizar el item en el carrito en el modal
 updateItem() {
  this.cargarCarritoDesdeLocalStorage();

  if (this.selectedItem) {
    // Aseguramos que 'extraIngredients' de selectedItem sea un array independiente.
    // Si no tiene ingredientes, inicializamos el array vacío.
    if (!this.selectedItem.extraIngredients) {
      this.selectedItem.extraIngredients = [];
    }

    // Filtramos los ingredientes seleccionados y asignamos una copia profunda de los ingredientes seleccionados
    const selectedIngredients = this.extraIngredients.filter(ingredient => ingredient.selected);

    // Hacemos una copia profunda de 'selectedItem' y de sus ingredientes, para que no haya referencias compartidas
    const updatedItem = {
      ...this.selectedItem, // Copia superficial de todos los campos
      extraIngredients: [...selectedIngredients] // Los ingredientes seleccionados
    };

    // Recalcular la productKey después de la actualización (si cambió algo que influye en ella)
    // updatedItem.productKey = this.datoService.generateProductKey(updatedItem);

    // Encuentra el índice del producto en la lista de carrito
    const index = this.listaItemsCarrito.findIndex(item => item.productKey === this.selectedItem.productKey);

    // if (index !== -1) {
    //   // Reemplazamos el producto en la lista con el producto actualizado
    //   this.listaItemsCarrito[index] = updatedItem;

    //   // Guardamos el carrito actualizado en localStorage
    //   this.guardarCarritoEnLocalStorage();

    //   // Hacemos un log para verificar los cambios
    //   console.log("Item actualizado en listaItemsCarrito:", this.listaItemsCarrito[index]);
    // }

    if (index !== -1) {
      // Recalcular la clave del producto después de actualizar los detalles
      const newProductKey = this.datoService.generateProductKey(updatedItem);

      // Actualizar la clave y otros detalles del producto en el carrito
      this.listaItemsCarrito[index] = {
        ...updatedItem,
        productKey: newProductKey, // Asignar la nueva clave generada
      };

      // Guardar el carrito actualizado en localStorage
      this.guardarCarritoEnLocalStorage();

      // Debugging: Verificar la actualización
      console.log("Item actualizado en listaItemsCarrito:", this.listaItemsCarrito[index]);
    }

    // Cerramos el modal después de la actualización
    const customizationModal = bootstrap.Modal.getInstance(document.getElementById('customizationModal')!);
    customizationModal?.hide();
  }
}

// updateItem() {
//   this.cargarCarritoDesdeLocalStorage(); // Carga el carrito desde localStorage

//   if (this.selectedItem) {
//     // Aseguramos que 'extraIngredients' sea un array independiente
//     if (!this.selectedItem.extraIngredients) {
//       this.selectedItem.extraIngredients = [];
//     }

//     // Filtrar los ingredientes seleccionados
//     const selectedIngredients = this.extraIngredients.filter(
//       (ingredient) => ingredient.selected
//     );

//     // Hacer una copia profunda del producto actualizado
//     const updatedItem = {
//       ...this.selectedItem, // Copia superficial de todos los campos
//       extraIngredients: [...selectedIngredients], // Ingredientes seleccionados
//     };

//     // Encuentra el índice del producto original en el carrito
//     const index = this.listaItemsCarrito.findIndex(
//       (item) => item.productKey === this.selectedItem.productKey
//     );

//     if (index !== -1) {
//       // Recalcular la clave del producto después de actualizar los detalles
//       const newProductKey = this.datoService.generateProductKey(updatedItem);

//       // Actualizar la clave y otros detalles del producto en el carrito
//       this.listaItemsCarrito[index] = {
//         ...updatedItem,
//         productKey: newProductKey, // Asignar la nueva clave generada
//       };

//       // Guardar el carrito actualizado en localStorage
//       this.guardarCarritoEnLocalStorage();

//       // Debugging: Verificar la actualización
//       console.log("Item actualizado en listaItemsCarrito:", this.listaItemsCarrito[index]);
//     }

//     // Cerrar el modal después de la actualización
//     const customizationModal = bootstrap.Modal.getInstance(
//       document.getElementById('customizationModal')!
//     );
//     customizationModal?.hide();
//   }
// }

  
  updateCart(item: Product): void {
    const index = this.listaItemsCarrito.findIndex(product => product.PROD_VENTA_ID === item.PROD_VENTA_ID);
    if (index > -1) {
        this.listaItemsCarrito[index].CANTIDAD = item.CANTIDAD;
        console.log("Carrito actualizado:", this.listaItemsCarrito);
        this.guardarCarritoEnLocalStorage();
    }
  }

  confirmDelete(item: Product): void {
      
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeItem(item);
        Swal.fire(
          'Eliminado!',
          'El producto ha sido eliminado del carrito.',
          'success'
        );
      }
    });
  }
  
}
