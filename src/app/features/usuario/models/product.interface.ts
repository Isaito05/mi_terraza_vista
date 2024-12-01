export interface Product {
    productKey?: string | null;
    isExpanded: any;
    PROD_VENTA_ID: number;
    PROD_VENTA_NOMBRE: string;
    PROD_VENTA_PRECIO: number;
    PROD_VENTA_DESCRIPCION: string;
    PROD_VENTA_IMAGEN: string;
    PROD_VENTA_ESTADO: number;
    CANTIDAD: number;
    selectedSize: string; 
    nuevaDireccion?: string;
    extraIngredients: Ingredient[];
    salsa: Sauce[];
    specialInstructions?: string;
    priceWithCustomization?: number;
  }
;

export interface Ingredient {
  name: string;
  price: number;
  selected: boolean;
}

export interface Sauce {
  name: string;
  selected: boolean;
}