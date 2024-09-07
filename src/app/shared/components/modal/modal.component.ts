import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';
import { PagoService } from 'src/app/features/pago/service/pago.service';
import Swal from 'sweetalert2';
import { BodegaService } from 'src/app/features/bodega/service/bodega.service';
import { ProveedorService } from 'src/app/features/proveedor/service/proveedor.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageUploadService } from 'src/app/core/services/image-upload.service';

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
  @Input() isEditing = false; // Asegúrate de declarar isEditing

  @Output() onRegisterSuccess = new EventEmitter<any>();

  form: FormGroup | undefined;
  private serviceMap: { [key: string]: any } = {}



  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private imageUploadService: ImageUploadService,
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
    this.initializeForm();
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.initializeForm();
    }
  }

  private initializeForm() {
    this.form = this.fb.group(
      this.fields.reduce((acc, field) => {
        acc[field.id] = [this.data[field.id] || ''];
        return acc;
      }, {} as { [key: string]: any })
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
    if (this.form) {
      this.form.get(fieldId)?.setValue(value); // Actualizamos el valor en el formulario
    }
  }

  // Método para manejar el cambio de input de archivo (imagen)
  handleFileInputChange(event: any, fieldId: string) {
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
  
}
