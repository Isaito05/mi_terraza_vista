import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { ProdventaService } from 'src/app/features/prodventa/services/prodventa.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Input() title: string = ''; // Título del modal
  @Input() fields: { id: string, label: string, type: string }[] = []; // Campos del formulario
  @Input() data: { [key: string]: any } = {}; // Define el tipo aquí// 
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() save = new EventEmitter<any>(); // Evento para guardar cambios

  form: FormGroup | undefined;
  private serviceMap:{[key: string]: any} = {}
  
  

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService, 
    private prodventaService: ProdventaService
  ) {
    this.serviceMap ={
      'Usuario': this.usuarioService,
      'Producto': this.prodventaService
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
    const formData =  this.data;
    console.log(formData);
  
    const service = this.getServiceBasedOnContext();
    if (service) {
      service.saveData(formData).subscribe(
        ( response: any) => {
          console.log('Datos guardados:', response);
          this.save.emit(response);
          this.closeModal();
        },
        ( error: any) => {
          console.error('Error al guardar los datos:', error);
        }
      );
    } else {
      console.error('No se encontró un servicio adecuado para el contexto.');
    }
  }

  private getServiceBasedOnContext() {
    console.log('Title del modal:', this.title);

    if (this.title.includes('Registrar usuario')) {
      console.log('Devolviendo UsuarioService');
      return this.serviceMap['Usuario'];
    } else if (this.title.includes('Registrar Producto')) {
      console.log('Devolviendo ProdventaService');
      return this.serviceMap['Producto'];
    }

    console.error('Contexto no encontrado para el título:', this.title);
    return null;
  }
}
