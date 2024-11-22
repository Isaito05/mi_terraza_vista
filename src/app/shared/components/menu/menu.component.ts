import { Component, Input, OnInit } from '@angular/core';
import { DatosService } from 'src/app/core/services/datos.service';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { environment } from 'src/environments/environment';
declare var bootstrap: any;

export interface Product {
  PROD_VENTA_ID: number;
  PROD_VENTA_NOMBRE: string;
  PROD_VENTA_PRECIO: number;
  PROD_VENTA_DESCRIPCION: string;
  PROD_VENTA_IMAGEN: string;
  PROD_VENTA_ESTADO: number;
  CANTIDAD: number;
  selectedSize: string; // Nuevo campo
  extraIngredients: any[]; // Ingredientes adicionales seleccionados
  specialInstructions?: string;
  priceWithCustomization?: number;
  salsa: any[];
}
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
  sizes = ['Pequeño', 'Mediano', 'Grande']; // Lista de tamaños
  specialInstructions: string = '';
  imagen: string = '';
  nombreproducto: string = '';
  totalExtras: number = 0;
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

  // loadMenuItems(): void {
  //   this.prodventaService.getData().subscribe((items: Product[]) => {
  //     this.menuItems = items.filter(
  //       (item: Product) => item.PROD_VENTA_ESTADO === 1
  //     );
  
  //     this.menuItems.forEach((item) => {
  //       item.PROD_VENTA_IMAGEN = `${environment.apiUrlHttp}${item.PROD_VENTA_IMAGEN}`;
  //     });
  
  //     if (this.productLimit > 0) {
  //       this.menuItems = this.menuItems.slice(0, this.productLimit);
  //     }
  
  //     console.log(this.menuItems.map(item => item.PROD_VENTA_IMAGEN)); // Verifica URLs
  //   });
  // }

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
  

  // Llamada cada vez que una imagen termina de cargar
  onImageLoad(): void {
    this.loadedImagesCount++;
    console.log(`Imagen cargada: ${this.loadedImagesCount}/${this.menuItems.length}`);
    
    // Verifica si todas las imágenes se han cargado
    if (this.loadedImagesCount === this.menuItems.length) {
      this.isLoading = false;
    }
  }
  
  

  openCustomizationModal(product: Product): void {
    console.log('Producto seleccionado para personalizar:', product);
    // Inicializa el producto seleccionado y restablece los valores de personalización
    this.nombreproducto = product.PROD_VENTA_NOMBRE
    this.imagen = product.PROD_VENTA_IMAGEN
    this.selectedProduct = product;
    this.selectedSize = this.sizes[0]; // Tamaño por defecto
    this.basePrice = product.PROD_VENTA_PRECIO;
    this.totalExtras = 0; // Iniciar con extras en 0
    this.selectedQuantity = 1; // la cantiadd
    this.specialInstructions = ''; // la decripcion
    this.extraIngredients.forEach(
      (ingredient) => (ingredient.selected = false)
    ); // Restablece los ingredientes
    this.sauces.forEach((sauce) => (sauce.selected = false)); // Resetear salsas seleccionadas

    // Definir un tiempo de preparación específico según el producto o cantidad
    this.estimatedPreparationTime = this.calculatePreparationTime();

    // Verificar que el producto se haya cargado correctamente
    console.log(
      'Producto seleccionado para personalización:',
      this.selectedProduct
    );

    // Mostrar el modal de personalización
    const modal = new bootstrap.Modal(
      document.getElementById('customizationModal') as HTMLElement
    );
    modal.show();
  }

  // Agregar el producto al carrito con las personalizaciones
  productoPersonalizado(): void {
    // Calcular el costo adicional de ingredientes seleccionados
    const additionalCost = this.extraIngredients
      .filter((ingredient) => ingredient.selected)
      .reduce((acc, ingredient) => acc + ingredient.price, 0);

    // Crear el producto personalizado con opciones seleccionadas
    const customizedProduct: Product = {
      ...this.selectedProduct,
      CANTIDAD: this.selectedQuantity,
      priceWithCustomization: this.selectedProduct.PROD_VENTA_PRECIO + additionalCost,
      specialInstructions: this.specialInstructions,
      salsa: this.sauces, 
      selectedSize: this.selectedSize,
      extraIngredients: this.extraIngredients.filter(
        (ingredient) => ingredient.selected
      ),
    };

    // Llama a `adProduct` del servicio para añadir el producto al carrito
    this.datoService.addProduct(customizedProduct, {
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

  // Actualizar la cantidad seleccionada
  updateQuantity(quantity: number) {
    if (quantity > 0) {
      this.selectedQuantity = quantity;
    }
  }

  // Calcular el costo total de los ingredientes adicionales
  calculateTotalExtras(): number {
    return this.extraIngredients
      .filter((ingredient) => ingredient.selected)
      .reduce((acc, ingredient) => acc + ingredient.price, 0);
  }

  // Calcular el precio total incluyendo la cantidad y extras
  calculateTotalPrice(): number {
    const extrasCost = this.calculateTotalExtras();
    this.totalExtras = extrasCost;
    return (this.basePrice + extrasCost) * this.selectedQuantity;
  }

  // Función para seleccionar/deseleccionar salsas
  toggleSauce(sauce: any): void {
    sauce.selected = !sauce.selected;
    console.log(`Salsa ${sauce.name} seleccionada: ${sauce.selected}`);
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

  calculatePreparationTime(): number {
    // Puedes personalizar esta lógica; aquí se usa un valor fijo como ejemplo
    return this.selectedProduct ? 15 : 10;
  }

  generateUniqueId(product: Product): string {
    const timestamp = new Date().getTime(); // Obtener la marca de tiempo
    const randomNumber = Math.floor(Math.random() * 1000); // Generar un número aleatorio
    return `${product.PROD_VENTA_ID || 'product'}-${timestamp}-${randomNumber}`;
  }

  hasSelectedIngredients(): boolean {
    return this.extraIngredients.some(ingredient => ingredient.selected);
  }
  


 // agregarCarrito(item: Product) {
  //   let iCarrito: Product = {
  //     PROD_VENTA_ID: item.PROD_VENTA_ID,
  //     PROD_VENTA_NOMBRE: item.PROD_VENTA_NOMBRE,
  //     PROD_VENTA_PRECIO: item.PROD_VENTA_PRECIO,
  //     PROD_VENTA_DESCRIPCION: item.PROD_VENTA_DESCRIPCION,
  //     PROD_VENTA_IMAGEN: item.PROD_VENTA_IMAGEN,
  //     PROD_VENTA_ESTADO: item.PROD_VENTA_ESTADO,
  //     CANTIDAD: 1,
  //     selectedSize: '',
  //     extraIngredients: [],
  //   };

  //   if (localStorage.getItem('carrito') === null) {
  //     let carrito: Product[] = [];
  //     carrito.push(iCarrito);
  //     localStorage.setItem('carrito', JSON.stringify(carrito));
  //   } else {
  //     let carritoStorage = localStorage.getItem('carrito') as string;
  //     let carrito = JSON.parse(carritoStorage);
  //     let index = -1;
  //     for (let i = 0; i < carrito.length; i++) {
  //       let itemC: Product = carrito[i];
  //       if (iCarrito.PROD_VENTA_ID === itemC.PROD_VENTA_ID) {
  //         index = i;
  //         break;
  //       }
  //     }
  //     if (index === -1) {
  //       carrito.push(iCarrito);
  //       localStorage.setItem('carrito', JSON.stringify(carrito));
  //     } else {
  //       let iCarrito: Product = carrito[index];
  //       iCarrito.CANTIDAD++;
  //       carrito[index] = iCarrito;
  //       localStorage.setItem('carrito', JSON.stringify(carrito));
  //     }

  //     // Actualizamos el carrito en localStorage
  //     localStorage.setItem('carrito', JSON.stringify(carrito));

  //     // Emitimos el carrito completo a través de `cartSubject` en el servicio `DatosService`
  //     // this.datoService.addProduct(carrito);
  //   }
  // }


  // Método para agregar el producto personalizado al carrito
  // addProductToCart(): void {
  //   const customProductWithExtras: Product = {
  //     ...this.customizedProduct, // Producto con opciones personalizadas
  //     CANTIDAD: 0, // La cantidad por defecto
  //     selectedSize: this.customizedProduct.selectedSize, // Incluir el tamaño seleccionado
  //     extraIngredients: this.customizedProduct.extraIngredients, // Incluir ingredientes seleccionados
  //     specialInstructions: this.specialInstructions,
  //     uniqueId: this.generateUniqueId(this.customizedProduct), // Generar identificador único
  //   };

  //   // Asegúrate de pasar las personalizaciones
  //   this.datoService.addProduct(customProductWithExtras, {
  //     selectedSize: this.customizedProduct.selectedSize,
  //     extraIngredients: this.customizedProduct.extraIngredients,
  //   });
  //   console.log('Producto agregado al carrito:', customProductWithExtras);
  // }


}
