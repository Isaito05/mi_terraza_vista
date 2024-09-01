import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { PagoService } from 'src/app/features/pago/service/pago.service';
import Swal from 'sweetalert2';
import { BodegaService } from 'src/app/features/bodega/service/bodega.service';
import { ProveedorService } from 'src/app/features/proveedor/service/proveedor.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Input() title: string = ''; // Título del modal
  @Input() fields: {
    id: string;
    label: string;
    type: string;
    options?: { value: string; label: string }[];
    accept?: string; // Añadido para especificar tipos de archivos permitidos para imágenes
  }[] = []; // Campos del formulario
  @Input() data: { [key: string]: any } = {}; // Define el tipo aquí// 
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() save = new EventEmitter<any>(); // Evento para guardar cambios

  @Output() onRegisterSuccess = new EventEmitter<any>();

  form: FormGroup | undefined;
  private serviceMap: { [key: string]: any } = {}



  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private prodventaService: ProdventaService,
    private pagoService: PagoService,
    private bodegaService: BodegaService,
    private proveedorService: ProveedorService
    
  ) {
    this.serviceMap = {
      'Usuario': this.usuarioService,
      'ProductoV': this.prodventaService,
      'Pago': this.pagoService,
      'Bodega': this.bodegaService,
      'Proveedor': this.proveedorService
    }
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

  closeModal() {
    this.close.emit();
  }

  confirm() {
    const formData = this.data;
    const service = this.getServiceBasedOnContext();
    if (service) {
      service.saveData(formData).subscribe(
        
        (response: any) => {
          this.closeModal()
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
            ;
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
    } else if (this.title.includes('Registrar bodega')) {
      return this.serviceMap['Bodega'];
    }else if (this.title.includes('Registrar proveedor')) {
      return this.serviceMap['Proveedor'];
    }

    console.error('Contexto no encontrado para el título:', this.title);
    return null;
  }

  handleFieldChange(fieldId: string, value: any) {
    this.data[fieldId] = value; // Actualizamos los datos del formulario con el nuevo valor del campo
  }

  // Método para manejar el cambio de input de archivo (imagen)
  handleFileInputChange(event: any, fieldId: string) {
    const file = event.target.files[0];
    if (file) {
      // Opcional: Convertir el archivo a una URL de objeto para vista previa
      this.data[fieldId] = file;
      console.log(`Archivo seleccionado para ${fieldId}:`, file);
    }
  }
  
}
