import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
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
  constructor(private fb: FormBuilder, private apiService: UsuarioService) {}

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
    console.log(formData);
    this.apiService.saveData(formData).subscribe(
      response => {
        console.log('Datos guardados:', response);
        this.save.emit(response);
        this.closeModal();
      },
      error => {
        console.error('Error al guardar los datos:', error);
      }
    );
  }
}
