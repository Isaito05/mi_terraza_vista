import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatosService } from 'src/app/core/services/datos.service';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/features/usuario/models/product.interface';
import { CarritoEditModalComponent } from '../carrito-edit-modal/carrito-edit-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-menu',
  // standalone: true,
  // imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  @Input() productLimit: number = 0; // Propiedad que definirá el límite de productos a mostrar
  isLoading = true; // Muestra el spinner por defecto
  loadedImagesCount = 0; // Contador de imágenes cargadas
  menuItems: Product[] = [];
  cartCount: number = 0;
  basePrice: number = 0;
  customizedProduct: any = {}; // Aquí guardas las opciones personalizadas
  estimatedPreparationTime: number = 15; // Tiempo estimado de preparación Ejemplo: 15 minutos
  favoriteProducts: any;
  selectedProduct!: Product; // Producto seleccionado para personalizar
  selectedQuantity: number = 1; // Función para actualizar la cantidad seleccionada
  selectedSize: string = ''; // Tamaño seleccionado
  specialInstructions: string = '';
  imagen: string = '';
  nombreproducto: string = '';
  currentProduct: any; 
  isEditing: boolean = false;
  totalExtras: number = 0;
  sizes = ['Pequeño', 'Mediano', 'Grande']; // Lista de tamaños
  extraIngredients = [
    { name: 'Queso extra', price: 2000, selected: false },
    { name: 'Pepperoni', price: 2500, selected: false },
    { name: 'Champiñones', price: 1500, selected: false },
  ];
  sauces = [
    { name: 'Ketchup', selected: false },
    { name: 'Mostaza', selected: false },
    { name: 'Mayonesa', selected: false },
  ];

  @ViewChild('customModal') modalComponent!: CarritoEditModalComponent;

  constructor(
    private prodventaService: ProdventaService,
    private datoService: DatosService
  ) {}

  ngOnInit(): void {
    console.time('MenuComponent Load Time');
    this.loadMenuItems();
    // this.datoService.cart$.subscribe(cart => {
      //   console.log('Contenido actualizado del carrito:', cart);
      //   this.cartCount = cart.reduce((total, producto) => total + producto.CANTIDAD, 0); // Actualizar el contador con la cantidad total
      // })
      console.timeEnd('MenuComponent Load Time');
      
  }

  loadMenuItems(): void {
    this.prodventaService.getData().subscribe((items: Product[]) => {
      this.menuItems = items.filter(item => item.PROD_VENTA_ESTADO === 1);
  
      this.menuItems.forEach(item => {
        item.PROD_VENTA_IMAGEN = `${environment.apiUrlHttp}${item.PROD_VENTA_IMAGEN}`;
      });

      if (this.productLimit > 0) {
              this.menuItems = this.menuItems.slice(0, this.productLimit);
            }
        
  
      console.log(this.menuItems); // Verifica que las URLs sean correctas
      this.loadedImagesCount = 0; // Reinicia el contador
    });
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
  
  abrirModal(product: Product): void {
    console.log('Producto seleccionado para personalizar:', product);
    this.isEditing = false;
    // Actualiza el producto seleccionado
    this.selectedProduct = product;
  
    // Obtén el modal del DOM y muéstralo
    const modalElement = document.getElementById('customizationModal') as HTMLElement;
    if (modalElement) {
      
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  personalizarProducto(details: any): void {
    console.log('Detalles de personalización confirmados:', details);
    // Agregar al carrito o realizar otras acciones con los detalles personalizado

      // Llama a `adProduct` del servicio para añadir el producto al carrito
      this.datoService.addProduct(details, {
        selectedSize: this.selectedSize,
        extraIngredients: this.extraIngredients.filter(
          (ingredient) => ingredient.selected
        ),
      });
  
      // Cerrar el modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('customizationModal')
      );
      modal.hide();
  
      // Actualizar el contador del carrito
      this.updateCartCount();

  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.cartCount = cart.length; // Número de productos en el carrito
  }

}