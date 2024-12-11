import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { DatosService } from 'src/app/core/services/datos.service';

import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { EditarDireccionComponent } from '../editar-direccion/editar-direccion.component';

import * as bootstrap from 'bootstrap';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { PedidoService } from 'src/app/features/pedido/service/pedido.service';
import { id } from '@swimlane/ngx-datatable';
import { SharedModule } from "../../shared.module";
import { Product } from 'src/app/features/usuario/models/product.interface';
import { CarritoEditModalComponent } from '../carrito-edit-modal/carrito-edit-modal.component';
import { Ingredient } from 'src/app/features/usuario/models/product.interface';

// export interface Product {
//   productKey: any;
//   isExpanded: any;
//   PROD_VENTA_ID: number;
//   PROD_VENTA_NOMBRE: string;
//   PROD_VENTA_PRECIO: number;
//   PROD_VENTA_DESCRIPCION: string;
//   PROD_VENTA_IMAGEN: string;
//   PROD_VENTA_ESTADO: number;
//   CANTIDAD: number
//   selectedSize: string; // Nuevo campo
//   extraIngredients: any[];
//   specialInstructions?: string;
//   priceWithCustomization?: number;
//   salsa: any[];
//   nuevaDireccion?: string
// }

// export interface Ingredient {
//   name: string;
//   price: number;
//   selected: boolean;
// }

@Component({
  selector: 'app-carrito-listar',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule, MatTooltipModule, RouterModule, MatRadioModule, SharedModule],
  templateUrl: './carrito-listar.component.html',
  styleUrl: './carrito-listar.component.css'
})
export class CarritoListarComponent {
  @ViewChild('customModal') modalComponent!: CarritoEditModalComponent;
  listaItemsCarrito: Product[] = [];
  // cartCount: number = 0;
  currentDate: Date = new Date();
  deliveryOption: string = '';
  showQrCode: boolean = false;
  deliveryOption_e: string = 'Entrega_inmediata'; // Valor inicial
  estimatedDeliveryTime: string = '30-45 minutos';
  selectedQuantity: number = 0;
  specialInstructions?: string = '';
  // imagen: any;
  // CANTIDAD: number = 0;
  productToEdit: Product | null = null;
  isEditing: boolean = false;
  // basePrice = 0;
  // totalExtras = 0;
  direccion_u: string = '';
  id_u: number = 0;
  // sizes = ['Pequeño', 'Mediano', 'Grande']; // Ejemplo de tamaños disponibles
  // sauces = [
  //   { name: 'Ketchup', selected: false },
  //   { name: 'Mostaza', selected: false },
  //   { name: 'Mayonesa', selected: false },
  // ];
  extraIngredients = [
    { name: 'Queso extra', price: 2000, selected: false },
    { name: 'Pepperoni', price: 2500, selected: false },
    { name: 'Champiñones', price: 1500, selected: false }
  ]; 
  
  // selectedItem: Product = {
  //   isExpanded: false,
  //   PROD_VENTA_ID: 0,
  //   PROD_VENTA_NOMBRE: '',
  //   PROD_VENTA_PRECIO: 0,
  //   PROD_VENTA_DESCRIPCION: '',
  //   PROD_VENTA_IMAGEN: '',
  //   PROD_VENTA_ESTADO: 1,
  //   CANTIDAD: 1,
  //   selectedSize: '',
  //   extraIngredients: [],
  //   specialInstructions: '',
  //   productKey: undefined,
  //   salsa: []
  // };

  constructor(
    private datoService: DatosService,
    private bottomSheet: MatBottomSheet,
    private pedidoService: PedidoService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.cargarCarritoDesdeLocalStorage();
    this.listaItemsCarrito = this.listaItemsCarrito.map(item => ({ ...item, isExpanded: false }));
    // console.log(this.listaItemsCarrito, 'a')
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token)
      this.direccion_u = decodedToken.direccion;
      this.id_u = decodedToken.id
    }
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
    this.showQrCode = this.deliveryOption === 'Entrega_inmediata';
  }

  confirmOrder() {
    this.direccion_u // Reemplázalo con la dirección del usuario.
    // const direccionActual = "Calle 123 #45-67, Ciudad"; // Reemplázalo con la dirección del usuario.
    console.log(this.listaItemsCarrito, 'B')
      Swal.fire({
      title: 'Confirma tu dirección',
      html: `
        <p>Esta es la dirección registrada para el envío:</p>
        <strong>${this.direccion_u}</strong>
        <p>¿Es correcta?</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Editar dirección',
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarPedido(); // Llama a tu función para procesar el pedido
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.editarDireccion(); // Llama a la función para editar la dirección
      }
    });
  }

  editarDireccion() {
    const bottomSheetRef = this.bottomSheet.open(EditarDireccionComponent);
  
    bottomSheetRef.afterDismissed().subscribe((nuevaDireccion) => {
      if (nuevaDireccion) {
        // Asignar la nueva dirección a un producto específico
        this.listaItemsCarrito.forEach((producto: Product) => {
          producto.nuevaDireccion = nuevaDireccion; // Asignar al campo nuevaDireccion
        });
  
        this.direccion_u = nuevaDireccion; // Actualizar la dirección general del usuario
        console.log('Nueva dirección:', nuevaDireccion);
        this.confirmOrder(); // Llama a tu método para confirmar el pedido
      } else {
        console.log('El usuario canceló la edición');
      }
    });
  }
  
  procesarPedido(){
    // Verificar si el usuario está autenticado
    const token = sessionStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Inicia sesión para continuar',
        text: 'Debes iniciar sesión para realizar un pedido y disfrutar de todas las funcionalidades de nuestra plataforma.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirigir a la página de inicio de sesión si el usuario confirma
          this.router.navigate(['/login']);
        } else {
          // Mensaje adicional si el usuario decide no iniciar sesión
          Swal.fire(
            'Pedido no procesado',
            'Por favor, inicia sesión para completar tu compra.',
            'info'
          );
        }
      });
      return;
    }
    
    const fechaRegistro = new Date();
    const offset = fechaRegistro.getTimezoneOffset();
    fechaRegistro.setMinutes(fechaRegistro.getMinutes() - offset)
    const pedido = {
      PED_RGU_ID: this.id_u, // ID del usuario
      PED_FECHA: fechaRegistro.toISOString(), // Fecha y hora actual en formato ISO
      PED_ESTADO: 'Pendiente', // Estado inicial del pedido
      PED_DESCRIPCION:this.listaItemsCarrito
      .map((producto: Product) => producto.specialInstructions)
      .join(', '), // Une las descripciones en una sola cadena separada por comas
      PED_PRECIO_TOTAL: this.calculateTotal(), // Calcula el precio total
      PED_MET_PAGO: this.deliveryOption, // Método de pago (entrega inmediata o contraentrega)
      PED_INFO: JSON.stringify(this.listaItemsCarrito.map((producto: Product) => ({
        id: producto.PROD_VENTA_ID,
        cantidad: producto.CANTIDAD,
        tamano: producto.selectedSize,
        ingredientesAdicionales: producto.extraIngredients
          .filter((ing: any) => ing.selected)
          .map((ing: any) => ({ nombre: ing.name, precio: ing.price })),
        direccion_new: producto.nuevaDireccion
        }))),
      PED_CANCELADO: 'No se especificó un motivo.'
    };
    console.log('Pedido a enviar:', pedido);
    this.pedidoService.saveData(pedido).subscribe(
      (response) => {
        console.log('Pedido procesado con éxito:', response);
        Swal.fire('Éxito', 'Tu pedido ha sido procesado.', 'success');
        this.pedidoService.activarNotificacion(); 

        // Mostrar el Toast
        this.mostrarToast();
      },
      (error) => {
        console.error('Error al procesar el pedido:', error);
        Swal.fire('Error', 'Hubo un problema al procesar tu pedido.', 'error');
      }
    );
  }

  mostrarToast() {
    const toastElement = document.getElementById('pedidoToast');
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }

  actualizarDireccion(nuevaDireccion: string) {
    // Aquí puedes guardar la nueva dirección en tu backend o estado de la aplicación
    console.log('Dirección actualizada:', nuevaDireccion);
    Swal.fire({
      title: 'Dirección actualizada',
      text: `Tu nueva dirección es: ${nuevaDireccion}`,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }
  
  getIngredientList(ingredients: any[]): string {
    console.log('Producto seleccionadoentro a:', ingredients);
    return ingredients && ingredients.length > 0 ? 
    ingredients.filter((i: any)=> i.selected).map((i: any) => `${i.name} (${this.formatCurrency(i.price)})`).join(', ')
    : 'Sin adicionales';
  }

  getIngredientListFac(ingredients: any[]): string {
    console.log('Producto seleccionado salieno b:', ingredients);
    if (!ingredients || ingredients.length === 0) {
        return 'Sin adicionales';
    }
    const ingredientList = ingredients.filter((i:any)=> i.selected).map((i:any) => i.name).join(', ');
        console.log('Producto seleccionado final:', ingredientList);
    return `${ingredientList}.`;
  }

  calcularTotalAdicionales(ingredients: any[], cantidad: any): string {
    console.log(cantidad,"cantidad")
    const total = ingredients.filter((i:any)=> i.selected).reduce((sum, ing) => sum + ing.price*cantidad , 0) || 0;
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
  // calculateTotalPrice() {
  //   return this.basePrice + this.calculateExtras(this.extraIngredients);
  // }

  // Método para abrir el modal de edición
  // openEditModal(item: Product) {
  //   // Copiamos los datos del producto para no modificar el original
  //   this.selectedItem = { ...item };
  //   this.imagen = this.selectedItem.PROD_VENTA_IMAGEN
    
  //   // Asegurarnos de que los ingredientes adicionales estén correctamente inicializados
  //   this.selectedItem.extraIngredients = this.selectedItem.extraIngredients || [];
  //   this.selectedItem.salsa = this.selectedItem.salsa || [];
  //   this.selectedQuantity = item.CANTIDAD;
  //   this.specialInstructions = item.specialInstructions
    
  //   // Guardamos el precio base y calculamos el costo de los extras
  //   this.basePrice = item.PROD_VENTA_PRECIO;
  //   this.totalExtras = this.calculateExtras(this.selectedItem.extraIngredients);
  
  //   // Actualizamos el estado de los ingredientes adicionales seleccionados en el modal
  //   this.extraIngredients.forEach(ingredient => {
  //     // Marca si el ingrediente está seleccionado en el producto
  //     const isSelected = this.selectedItem.extraIngredients.some(
  //       (selected: any) => selected.name === ingredient.name && selected.selected
  //     );
  //     ingredient.selected = isSelected; // Marcar como seleccionado o no
  //   });

  //   this.sauces.forEach(ingredient => {
  //     // Marca si el ingrediente está seleccionado en el producto
  //     const isSelected = this.selectedItem.salsa.some(
  //       (selected: any) => selected.name === ingredient.name && selected.selected
  //     );
  //     ingredient.selected = isSelected; // Marcar como seleccionado o no
  //   });
  
  //   // Mostrar el modal
  //   const customizationModal = new bootstrap.Modal(document.getElementById('customizationModal')!);
  //   customizationModal.show();
  // }
  
 // Método para actualizar el item en el carrito en el modal
  // updateItem() {
  // this.cargarCarritoDesdeLocalStorage();
  // if (this.selectedItem) {

  //   if (!this.selectedItem.extraIngredients) { this.selectedItem.extraIngredients = [];}
  //   if (!this.selectedItem.salsa) { this.selectedItem.salsa = [];}

  //   const selectedIngredients = this.extraIngredients.filter(ingredient => ingredient.selected);
  //   const selectedSalsa = this.sauces.filter(ingredient => ingredient.selected);
  //   const updatedItem = { ...this.selectedItem, 
  //     extraIngredients: [...selectedIngredients],
  //     salsa: [...selectedSalsa],
  //     specialInstructions:this.specialInstructions,
  //     CANTIDAD: this.selectedQuantity
  //   };
  
  //   const index = this.listaItemsCarrito.findIndex(item => item.productKey === this.selectedItem.productKey);

  //   if (index !== -1) {
  //     const newProductKey = this.datoService.generateProductKey(updatedItem);
  //     this.listaItemsCarrito[index] = { ...updatedItem, productKey: newProductKey, };
  //     this.guardarCarritoEnLocalStorage();
  //   }

  //   const customizationModal = bootstrap.Modal.getInstance(document.getElementById('customizationModal')!);
  //   customizationModal?.hide();
  // }
  // }

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

  // updateQuantity(quantity: number) {
  //   if (quantity > 0) {
  //     this.selectedQuantity = quantity;
  //     console.log("Carrito cargado desde localStorage:", this.listaItemsCarrito);

  //   }
  // }

  // Función para seleccionar/deseleccionar salsas
  // toggleSauce(sauce: any): void {
  //   sauce.selected = !sauce.selected;
  //   console.log(`Salsa ${sauce.name} seleccionada: ${sauce.selected}`);
  // }

  productoaEditar(product: Product) {
    console.log('--- Editando producto ---');
    console.log('Producto seleccionado:', product);
    this.isEditing = true; // Indicar que está en modo edición
    this.productToEdit = { ...product }; // Seleccionamos el producto para editar
    
    // Mezclar los ingzredientes seleccionados con la lista completa
    this.productToEdit.extraIngredients = this.mezclarIngredientes(product.extraIngredients || []);
  
    console.log('Ingredientes mezclados:', this.productToEdit.extraIngredients);
    
    const modal = new bootstrap.Modal(document.getElementById('customizationModal') as HTMLElement);
    modal.show();
  }
  
  // actualizarProducto(updatedProduct: Product) {
  //   console.log('Actualizando producto', updatedProduct);
    
  //   const index = this.listaItemsCarrito.findIndex((item) => item.PROD_VENTA_ID === updatedProduct.PROD_VENTA_ID);
  //   if (index !== -1) {
  //     this.listaItemsCarrito[index] = {
  //       ...updatedProduct,
  //       productKey: updatedProduct.productKey || this.listaItemsCarrito[index].productKey,
  //       isExpanded: updatedProduct.isExpanded !== undefined ? updatedProduct.isExpanded : false,
  //     };

  //      // Guardar el carrito actualizado en localStorage
  //      this.guardarCarritoEnLocalStorage();

  //     console.log('Producto actualizado en el carrito:', this.listaItemsCarrito[index]);
  //   }
  //    // Cerramos el modal después de la actualización
  //    const customizationModal = bootstrap.Modal.getInstance(document.getElementById('customizationModal')!);
  //    customizationModal?.hide();
  // }

  actualizarProducto(updatedProduct: Product) {
    console.log('--- INICIANDO ACTUALIZACIÓN ---');
    console.log('Actualizando producto', updatedProduct);
  
    // Buscar el índice usando una combinación de `PROD_VENTA_ID` y `productKey`
    const index = this.listaItemsCarrito.findIndex(
      (item) => 
        item.PROD_VENTA_ID === updatedProduct.PROD_VENTA_ID &&
        item.productKey === updatedProduct.productKey
    );
  
    if (index !== -1) {

      console.log('Índice del producto encontrado:', index);
      console.log('Estado del carrito antes de la actualización:', JSON.parse(JSON.stringify(this.listaItemsCarrito)));
      // Generar un nuevo `productKey` si es necesario
      console.log('Actualixa producto', updatedProduct);
      const newProductKey = this.datoService.generateProductKey(updatedProduct);
      console.log('LLave de mierdaa', newProductKey);
  
      // Actualizar el producto en el carrito
      this.listaItemsCarrito[index] = {
        ...updatedProduct,
        productKey: newProductKey, // Usar el nuevo `productKey`
        isExpanded: updatedProduct.isExpanded !== undefined ? updatedProduct.isExpanded : false,
      };
      console.log('Producto después de la actualización:', this.listaItemsCarrito[index]);
      console.log('Estado del carrito después de la actualización:', JSON.parse(JSON.stringify(this.listaItemsCarrito)));
      // Guardar el carrito actualizado en localStorage
      this.guardarCarritoEnLocalStorage();
  
      console.log('Producto actualizado en el carrito:', this.listaItemsCarrito[index]);
    } else {
      console.warn('No se encontró el producto para actualizar.');
    }
  
    // Cerrar el modal después de la actualización
    const customizationModal = bootstrap.Modal.getInstance(document.getElementById('customizationModal')!);
    customizationModal?.hide();
  }
  
 // Mezclar ingredientes seleccionados con la lista completa
 private mezclarIngredientes(selectedIngredients: Ingredient[]): Ingredient[] {
  const allIngredients = [
    { name: 'Queso extra', price: 2000, selected: false },
    { name: 'Pepperoni', price: 2500, selected: false },
    { name: 'Champiñones', price: 1500, selected: false },
  ];

  if (!selectedIngredients || selectedIngredients.length === 0) {
    console.warn('Lista de ingredientes seleccionados vacía o no definida:', selectedIngredients);
    return allIngredients.map(ingredient => ({ ...ingredient, selected: false }));
  }

  // Mezclar los ingredientes seleccionados con los generales
  return allIngredients.map((ingredient) => {
    const matchingIngredient = selectedIngredients.find(
      (selected) => selected.name === ingredient.name && selected.selected
    );
    return { ...ingredient, selected: !!matchingIngredient };
  });
}

}
