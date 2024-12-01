import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { DatosService } from 'src/app/core/services/datos.service';
import { Product } from 'src/app/features/usuario/models/product.interface';
import { Ingredient } from 'src/app/features/usuario/models/product.interface';
import { Sauce } from 'src/app/features/usuario/models/product.interface';

// export interface Product {
//   PROD_VENTA_ID: number;
//   PROD_VENTA_NOMBRE: string;
//   PROD_VENTA_PRECIO: number;
//   PROD_VENTA_DESCRIPCION: string;
//   PROD_VENTA_IMAGEN: string;
//   PROD_VENTA_ESTADO: number;
//   CANTIDAD: number;
//   selectedSize: string; // Nuevo campo
//   extraIngredients: any[]; // Ingredientes adicionales seleccionados
//   specialInstructions?: string;
//   priceWithCustomization?: number;
//   salsa: any[];
// }

@Component({
  selector: 'app-carrito-edit-modal',
  // standalone: true,
  // imports: [],
  templateUrl: './carrito-edit-modal.component.html',
  styleUrl: './carrito-edit-modal.component.css'
})
export class CarritoEditModalComponent {
  @Input() productLimit: number = 0; // Propiedad que definirá el límite de productos a mostrar
  @Input() selectedProduct: Product | null = null;
  @Input() isEditing: boolean = false; // Determina si el modal está en modo edición
  
  @Output() customizationConfirmed = new EventEmitter<any>();
  @Output() saveChanges = new EventEmitter<Product>();
  

  // selectedProduct!: Product; // Producto seleccionado para personalizar
  basePrice: number = 0;
  cartCount: number = 0;
  customizedProduct: any = {}; // Aquí guardas las opciones personalizadas
  estimatedPreparationTime: number = 15; // Tiempo estimado de preparación Ejemplo: 15 minutos
  favoriteProducts: any;
  imagen: string = '';
  isLoading = true; // Muestra el spinner por defecto
  loadedImagesCount = 0; // Contador de imágenes cargadas
  menuItems: Product[] = [];
  nombreproducto: string = '';
  selectedQuantity: number = 1;
  selectedSize: string = ''; // Tamaño seleccionado
  sizes = ['Pequeño', 'Mediano', 'Grande']; // Lista de tamaños
  specialInstructions: string = '';
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
    // private prodventaService: ProdventaService,
    private datoService: DatosService
  ) {}

  
  ngOnChanges() {
    console.log('--- ngOnChanges disparado ---');
    console.log('Producto recibido:', this.selectedProduct);
  
    if (this.selectedProduct) {
      this.basePrice = this.selectedProduct?.PROD_VENTA_PRECIO;
      this.imagen = this.selectedProduct.PROD_VENTA_IMAGEN;
      this.selectedSize = this.selectedProduct.selectedSize || 'Pequeño';
      this.selectedQuantity = this.selectedProduct.CANTIDAD || 1;
  
      // Validar y asignar ingredientes
      console.log('Ingredientes extra antes de mezclar:', this.selectedProduct.extraIngredients);
      this.extraIngredients = this.mezclarIngredientes(this.selectedProduct.extraIngredients || []);
      console.log('Ingredientes después de mezclar:', this.extraIngredients);
  
      // Salsas
      this.sauces = this.mezclarSalsas(this.selectedProduct.salsa || []); // Mezcla las salsas correctamente
      console.log('Salsas inicializadas:', this.sauces);
  
      this.specialInstructions = this.selectedProduct.specialInstructions || '';
      this.selectedProduct.productKey = this.selectedProduct.productKey || null;
      this.selectedProduct.isExpanded = this.selectedProduct.isExpanded || false;
    }
  }
  
  
  
  valoresIniciales(product: Product): void {
    this.nombreproducto = product.PROD_VENTA_NOMBRE;
    this.imagen = product.PROD_VENTA_IMAGEN;
    this.basePrice = product.PROD_VENTA_PRECIO;
    this.totalExtras = 0;
    this.selectedQuantity = 1;
    this.specialInstructions = '';
    this.extraIngredients.forEach((ingredient) => (ingredient.selected = false));
    this.sauces.forEach((sauce) => (sauce.selected = false));
    this.estimatedPreparationTime = this.calculatePreparationTime();

    // Reinicia los ingredientes y marca los seleccionados previamente
    this.extraIngredients.forEach((ingredient) => {
      ingredient.selected = product.extraIngredients?.some(
        (extra) => extra.name === ingredient.name
      ) || false;
    });

    // Reinicia las salsas y marca las seleccionadas previamente
    this.sauces.forEach((sauce) => {
      sauce.selected = product.salsa?.some(
        (s) => s.name === sauce.name && s.selected
      ) || false;
    });

    this.specialInstructions = product.specialInstructions || '';
    this.selectedSize = product.selectedSize || 'Pequeño'; // Usa el tamaño seleccionado previamente
    this.estimatedPreparationTime = this.calculatePreparationTime(); // Recalcula el tiempo estimado
  }

  calculatePreparationTime(): number {
    // Implementa aquí tu lógica para calcular el tiempo
    return 15; // Ejemplo: tiempo fijo de 15 minutos
  }

  agregarProducto(): void {

    // Calcular el costo adicional de ingredientes seleccionados
    const additionalCost = this.extraIngredients
    .filter((ingredient) => ingredient.selected)
    .reduce((acc, ingredient) => acc + ingredient.price, 0);


    // Emitir los datos personalizados al componente principal
    const customizationDetails = {
      ...this.selectedProduct,
      CANTIDAD: this.selectedQuantity,
      priceWithCustomization: this.selectedProduct!.PROD_VENTA_PRECIO + additionalCost,
      specialInstructions: this.specialInstructions,
      salsa: this.sauces, 
      selectedSize: this.selectedSize,
      extraIngredients: this.extraIngredients.filter( (ingredient) => ingredient.selected ),
    };
    this.customizationConfirmed.emit(customizationDetails);
    this.valoresIniciales(this.selectedProduct!);
    
  }

  // Actualizar la cantidad seleccionada
  updateQuantity(quantity: number) {
    if (quantity > 0) {
      this.selectedQuantity = quantity;
    }
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

  // Función para seleccionar/deseleccionar salsas
  toggleSauce(sauce: any): void {
    sauce.selected = !sauce.selected;
    console.log(`Salsa ${sauce.name} seleccionada: ${sauce.selected}`);
  }

  // Calcular el precio total incluyendo la cantidad y extras
  calculateTotalPrice(): number {
    const extrasCost = this.calculateTotalExtras();
    this.totalExtras = extrasCost;
    return (this.basePrice + extrasCost) * this.selectedQuantity;
  }

  // Agregar el producto al carrito con las personalizaciones
  productoPersonalizado(): void {
    // Calcular el costo adicional de ingredientes seleccionados
    const additionalCost = this.extraIngredients
      .filter((ingredient) => ingredient.selected)
      .reduce((acc, ingredient) => acc + ingredient.price, 0);

    // Crear el producto personalizado con opciones seleccionadas
    const customizedProduct: Product = {
      ...this.selectedProduct!,
      CANTIDAD: this.selectedQuantity,
      priceWithCustomization: this.selectedProduct!.PROD_VENTA_PRECIO + additionalCost,
      specialInstructions: this.specialInstructions,
      salsa: this.sauces, 
      selectedSize: this.selectedSize,
      extraIngredients: this.extraIngredients.filter( (ingredient) => ingredient.selected ),
    };

    // Llama a `adProduct` del servicio para añadir el producto al carrito
    this.datoService.addProduct(customizedProduct, {
      selectedSize: this.selectedSize,
      extraIngredients: this.extraIngredients.filter(
        (ingredient) => ingredient.selected
      ),
    });

    // Cerrar el modal
    bootstrap.Modal.getInstance(document.getElementById('customizationModal')!)?.hide();
    
    // Actualizar el contador del carrito
    this.updateCartCount();
  }
  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.cartCount = cart.length; // Número de productos en el carrito
  }

  // Calcular el costo total de los ingredientes adicionales
  calculateTotalExtras(): number {
    return this.extraIngredients
      .filter((ingredient) => ingredient.selected)
      .reduce((acc, ingredient) => acc + ingredient.price, 0);
  }

  hasSelectedIngredients(): boolean {
    return this.extraIngredients.some(ingredient => ingredient.selected);
  }

  calculateExtras(): number {
    return this.extraIngredients
      .filter((ingredient) => ingredient.selected)
      .reduce((total, ingredient) => total + ingredient.price, 0);
  }

  saveCustomization() {
    console.log('--- Guardando personalización ---');
    console.log('Ingredientes seleccionados antes de guardar:', this.extraIngredients);
  
    const customizedProduct: Product = {
      ...this.selectedProduct!,
      CANTIDAD: this.selectedQuantity,
      selectedSize: this.selectedSize,
      extraIngredients: this.extraIngredients,
      specialInstructions: this.specialInstructions,
      priceWithCustomization: this.selectedProduct!.PROD_VENTA_PRECIO * this.selectedQuantity + this.totalExtras,
      salsa: this.sauces,
      productKey: this.selectedProduct?.productKey || null,
      isExpanded: this.selectedProduct?.isExpanded || false,
    };
  
    console.log('Producto actualizado a enviar:', customizedProduct);
    this.saveChanges.emit(customizedProduct);
  } 

  closeModal() {
    bootstrap.Modal.getInstance(document.getElementById('customizationModal')!)?.hide();
    this.valoresIniciales(this.selectedProduct!);

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
  
  private mezclarSalsas(selectedSalsas: Sauce[]): Sauce[] {
    const allSalsas = [
      { name: 'Ketchup', price: 0, selected: false },
      { name: 'Mayonesa', price: 0, selected: false },
      { name: 'Mostaza', price: 0, selected: false },
    ];
  
    if (!selectedSalsas || selectedSalsas.length === 0) {
      console.warn('Lista de salsas seleccionadas vacía o no definida:', selectedSalsas);
      return allSalsas.map(salsa => ({ ...salsa, selected: false }));
    }
  
    return allSalsas.map((salsa) => {
      const matchingSalsa = selectedSalsas.find(
        (selected) => selected.name === salsa.name && selected.selected
      );
      return { ...salsa, selected: !!matchingSalsa };
    });
  }
  
  
  
}
