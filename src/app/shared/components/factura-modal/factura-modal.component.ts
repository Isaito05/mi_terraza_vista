import { CommonModule } from '@angular/common';
import { Component, Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';


@Component({
  selector: 'app-factura-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura-modal.component.html',
  styleUrl: './factura-modal.component.css'
})
export class FacturaModalComponent {
  currentDate: Date = new Date();
  productos: any[] = []; // Aquí almacenaremos los productos procesados
  dir_nueva: string = ''
  constructor(
    public dialogRef: MatDialogRef<FacturaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prodVentaService: ProdventaService
  ) {
    this.procesarProductos();
  }

  /**
   * Procesa los datos de PED_INFO para obtener los productos y sus detalles.
   */
  procesarProductos(): void {
    console.log(this.data)
    try {
      // Parsear el campo PED_INFO
      const productosRaw = JSON.parse(this.data.PED_INFO);
    
      // Extraer los IDs de los productos
      const ids = productosRaw.map((producto: any) => producto.id);
      console.log('IDs obtenidos de PED_INFO:', ids);
    
      // Llamar al servicio para obtener todos los productos
      this.prodVentaService.getData().subscribe({
        next: (todosLosProductos) => {
          console.log('Todos los productos obtenidos:', todosLosProductos); // Verifica que contenga la lista completa
    
          // Filtrar los productos que coincidan con los IDs obtenidos de PED_INFO
          const detallesProductos = todosLosProductos.filter((producto: any) =>
            ids.includes(producto.PROD_VENTA_ID)
          );
          console.log('Productos filtrados por IDs:', detallesProductos);
    
          // Construir el array de productos con la información necesaria
          if (detallesProductos && detallesProductos.length > 0) {
            this.productos = productosRaw.map((producto: any) => {
              // Busca el detalle del producto correspondiente en detallesProductos usando el ID
              const detalle = detallesProductos.find(
                (d: any) => d.PROD_VENTA_ID === producto.id
              );
              this.dir_nueva = producto.direccion_new;
              console.log(this.dir_nueva, 'new')
              // Devuelve un nuevo objeto con la información del producto
              return {
                nombre: detalle?.PROD_VENTA_NOMBRE || 'Producto desconocido', // Nombre del producto
                prec_unitario: detalle?.PROD_VENTA_PRECIO || 0, // Precio unitario
                cantidad: producto.cantidad, // Cantidad del producto
                tamano: producto.tamano, // Tamaño del producto (si está disponible)
                adicionales: producto.ingredientesAdicionales.length // Verifica si hay ingredientes adicionales
                  ? producto.ingredientesAdicionales
                      .map((adicional: any) => adicional.nombre)
                      .join(', ') // Los ingredientes adicionales, separados por coma
                  : 'Ninguno', // Si no hay adicionales, muestra 'Ninguno'
              };
            });
          } else {
            console.error('No se encontraron productos con los IDs especificados.');
          }
        },
        error: (err) => {
          console.error('Error al obtener todos los productos:', err); // Maneja el error si falla la llamada a getData
        },
      });
    } catch (error) {
      console.error('Error al procesar los productos:', error);
      // this.loading = false;
    }
    
  }

  formatCurrency(value: any): string {
    if (typeof value === 'number') {
      return `$ ${value.toLocaleString('es-ES')}`;
    }
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    return isNaN(numericValue) ? value.toString() : `$ ${numericValue.toLocaleString('es-ES')}`;
  }

  
  cerrarModal(): void {
    this.dialogRef.close();
  }
}
// "[
//   {
//     "id":72,"cantidad":4,
//     "tamaño":"Mediano",
//     "ingredientesAdicionales":[
//       {
//         "nombre":"Pepperoni",
//         "precio":2500
//       }
//     ]
//   },
//   {
//     "id":71,"
//     cantidad":2,
//     "tamaño":"Mediano",
//     "ingredientesAdicionales":[
//       {
//         "nombre":"Queso extra",
//         "precio":2000
//       },
//       {
//         "nombre":"Pepperoni","precio":2500
//       },
//       {
//         "nombre":"Champiñones","precio":1500
//       }
//     ]
//   },
//   {
//     "id":74,
//     "cantidad":1,
//     "tamaño":"Pequeño",
//     "ingredientesAdicionales":[]
//   }
// ]"