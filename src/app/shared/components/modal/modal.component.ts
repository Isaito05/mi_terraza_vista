import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { PagoService } from 'src/app/features/pago/service/pago.service';
import { BodegaService } from 'src/app/features/bodega/service/bodega.service';
import { ProveedorService } from 'src/app/features/proveedor/service/proveedor.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageUploadService } from 'src/app/core/services/image-upload.service';
import Swal from 'sweetalert2';
import { ProprovService } from 'src/app/features/proprov/service/proprov.service';
import { PedidoService } from 'src/app/features/pedido/service/pedido.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent {
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Input() title: string = ''; // Título del modal
  @Input() fields: { id: string; label: string; type: string; options?: { value: string; label: string }[]; accept?: string; }[] = []; // Campos del formulario
  @Input() data: { [key: string]: any } = {}; // Define el tipo aquí// 

  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() save = new EventEmitter<any>(); // Evento para guardar cambios
  @Input() isEditing = false; // Asegúrate de declarar isEditing
  @Input() isViewingDetails: boolean = false;

  @Output() onRegisterSuccess = new EventEmitter<any>();
  @Output() confirmAction = new EventEmitter<void>();

  pedidos: any[] = [];
  result: any[] = [];
  acc: any[] = [];

  form: FormGroup;
  private serviceMap: { [key: string]: any } = {}

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private imageUploadService: ImageUploadService,
    private prodventaService: ProdventaService,
    private pagoService: PagoService,
    private bodegaService: BodegaService,
    private proveedorService: ProveedorService,
    private proprovService: ProprovService,
    private pedidoService: PedidoService
  ) {
    this.serviceMap = {
      'Usuario': this.usuarioService,
      'ProductoV': this.prodventaService,
      'Pago': this.pagoService,
      'Bodega': this.bodegaService,
      'Proveedor': this.proveedorService,
      'Proprov': this.proprovService,
    }
    this.form = this.fb.group({});
  }

  ngOnInit() {
    // Crear un formulario con controles para cada campo
    this.form = this.fb.group(
      this.fields.reduce((acc, field) => {
        acc[field.id] = [this.data[field.id] || ''];
        return acc;
      }, {} as { [key: string]: any }) // Asegúrate de proporcionar el tipo aquí
    );

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue && changes['data'] && this.title === 'Detalles del pedido') {
      // Crear un formulario con controles para cada campo basado en los datos actuales
      this.form = this.fb.group(
        this.fields.reduce((acc, field) => {
          acc[field.id] = [this.data[field.id] || ''];
          this.Tablapedido(this.data['PED_ID']);
          console.log(this.data['PED_ID']); // Inicializar con el valor correspondiente
          return acc;

        }, {} as { [key: string]: any })
      );

    }
  }

  formatCurrency(value: any): string {
    if (value == null) {
      return '';
    }
  
    if (typeof value === 'number') {
      return `${value.toLocaleString('es-ES')}`;
    }
  
    // Convertir cadenas numéricas a número
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    if (!isNaN(numericValue)) {
      return `${numericValue.toLocaleString('es-ES')}`;
    }
  
    // Si no es un número, devolver el valor como cadena
    return value.toString();
  }

  closeModal() {
    this.close.emit();
  }

  confirm() {

    const formData = this.data;
    const service = this.getServiceBasedOnContext();

    if (service) {

      // Si está en modo de edición
      if (this.isEditing) {
        console.log(formData, 'yei');
        service.updateData(formData).subscribe(
          (response: any) => {
            this.closeModal();
            this.data = [];

            // Mostrar alerta de éxito
            Swal.fire({
              title: 'Éxito',
              text: 'Registro editado satisfactoriamente',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.save.emit(response);
              location.reload();
            });
          },
          (error: any) => {
            console.error('Error al editar los datos:', error);

            // Mostrar alerta de error
            Swal.fire({
              title: 'Error',
              text: 'No se pudo editar el registro',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
      // Si no está en modo de edición (es un registro nuevo)
      else {
        service.saveData(formData).subscribe(
          (response: any) => {
            this.closeModal();
            this.data = [];

            // Mostrar alerta de éxito
            Swal.fire({
              title: 'Éxito',
              text: 'Registro guardado satisfactoriamente',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.save.emit(response);
              location.reload();
            });
          },
          (error: any) => {
            console.error('Error al guardar los datos:', error);

            // Mostrar alerta de error
            Swal.fire({
              title: 'Error',
              text: 'No se pudo guardar el registro',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    } else {
      console.error('No se encontró un servicio adecuado para el contexto.');
    }
  }


  private getServiceBasedOnContext() {
    if (this.title.includes('Registrar usuario')) {
      return this.serviceMap['Usuario'];
    } else if (this.title.includes('Registrar Producto en venta')) {
      return this.serviceMap['ProductoV'];
    } else if (this.title.includes('Registrar pago')) {
      return this.serviceMap['Pago'];
    } else if (this.title.includes('Registrar pago')) {
      return this.serviceMap['Pago'];
    } else if (this.title.includes('Registrar bodega')) {
      return this.serviceMap['Bodega'];
    } else if (this.title.includes('Registrar proveedor')) {
      return this.serviceMap['Proveedor'];
    } else if (this.title.includes('Registrar producto proveedor')) {
      return this.serviceMap['Proprov'];
    } else if (this.title.includes('Editar usuario')) {
      return this.serviceMap['Usuario'];
    } else if (this.title.includes('Editar pago')) {
      return this.serviceMap['Pago'];
    } else if (this.title.includes('Editar bodega')) {
      return this.serviceMap['Bodega'];
    } else if (this.title.includes('Editar producto de proveedor')) {
      return this.serviceMap['Proprov'];
    } else if (this.title.includes('Editar proveedor')) {
      return this.serviceMap['Proveedor'];
    }
    console.error('Contexto no encontrado para el título:', this.title);
    return null;
  }

  handleFieldChange(fieldId: string, value: any) {
    if (this.form) {
      this.form.get(fieldId)?.setValue(value); // Actualizamos el valor en el formulario
    }
  }

  // Método para manejar el cambio de input de archivo (imagen)
  handleFileInputChange(event: any, fieldId: string) {
    // const file = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      this.imageUploadService.uploadImage(file).subscribe(
        (response: any) => {
          // Suponiendo que la respuesta contiene la URL de la imagen guardada
          this.data[fieldId] = response.imageUrl;
          console.log('URL de la imagen:', this.data[fieldId]); // Verificar la URL de la imagen
        },
        (error: any) => {
          console.error('Error al subir la imagen:', error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar la imagen',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }


  Tablapedido(pedId: any) {
    this.pedidoService.getData().subscribe(data => {
      console.log(pedId, 'idiota');
      const pedidosFiltrados = data.filter((pedido: { PED_ID: number; }) => pedido.PED_ID === pedId);
  
      const productosMap = new Map<string, number>(); // Para evitar duplicados
  
      pedidosFiltrados.forEach((pedido: { PED_INFO: string | any[]; }) => {
        if (typeof pedido.PED_INFO === 'string') {
          try {
            const pedInfoArray = JSON.parse(pedido.PED_INFO);
            pedInfoArray.forEach((info: { id: string; cantidad: number; }) => {
              const id = info.id;
              const cantidad = info.cantidad;
              if (productosMap.has(id)) {
                productosMap.set(id, productosMap.get(id)! + cantidad); // Sumar la cantidad si ya existe
              } else {
                productosMap.set(id, cantidad); // Agregar nuevo producto
              }
            });
          } catch (error) {
            console.error('Error parsing PED_INFO JSON', error);
          }
        }
      });
  
      // Convertir el Map a un array de promesas para obtener los detalles de los productos
      const productPromises = Array.from(productosMap.keys()).map(id =>
        this.prodventaService.getProVenById(id).toPromise().then(data => ({
          nombre: data.PROD_VENTA_NOMBRE,
          precio: data.PROD_VENTA_PRECIO,
          descripcion:data.PROD_VENTA_DESCRIPCION,
          cantidad: productosMap.get(id)!,
          subtotal: data.PROD_VENTA_PRECIO * productosMap.get(id)!
        })).catch(error => {
          console.error('Error al obtener los datos:', error);
          return null; // Manejar el error
        })
      );
  
      // Esperar a que todas las promesas se resuelvan
      Promise.all(productPromises).then(results => {
        this.pedidos = results.filter(result => result !== null); // Filtrar resultados nulos en caso de error
      });
    });
  }

  getTotal(): number {
    return this.pedidos.reduce((acc, item) => acc + item.subtotal, 0);
  }


}
