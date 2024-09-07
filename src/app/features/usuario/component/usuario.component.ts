// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service'; // Importa el servicio

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = []; // Lista de usuarios
  usuarioSeleccionado: any; // Usuario seleccionado para editar o crear
  idUsuario: number | null = null; // ID del usuario seleccionado
  title = 'Modulo de Usuario';
  isEditing = false; // Estado para saber si estamos editando
  editingUser: any = {}; // Datos del usuario que se está editando

  isModalVisible: boolean = false; // Estado para controlar la visibilidad del modal
  modalFields: any[] = []; // Campos del modal

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getData().subscribe(data => {
      this.usuarios = data; // Asigna los datos recibidos a la variable usuarios
      console.log(this.usuarios); // Muestra los datos en la consola para verificar
    });
  }

  openModal(user?: any) {
    console.log('Abrir modal con usuario:', user);
    this.isEditing = !!user; // Determina si estamos en modo de edición
    this.editingUser = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
    this.isModalVisible = true;

    // Emite los datos hacia el componente del modal
    this.modalFields = this.getFieldsForModal(); // Asigna los campos necesarios para el modal
  }

  handleClose() {
    this.isModalVisible = false;
  }

  confirm() {
    if (this.isEditing) {
      // Lógica para actualizar el usuario
      // this.updateUser(this.editingUser);
    } else {
      // Lógica para crear un nuevo usuario
      // this.createUser(this.editingUser);
    }
    this.handleClose();
  }

  onEdit(user: any) {
    console.log('Evento de edición recibido:', user);
    this.openModal(user);
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }

  getFieldsForModal() {
    return [
      { id: 'RGU_IDENTIFICACION', label: 'Identificación', type: 'number' },
      { id: 'RGU_NOMBRES', label: 'Nombres', type: 'text' },
      { id: 'RGU_APELLIDOS', label: 'Apellidos', type: 'text' },
      { id: 'RGU_GENERO', label: 'Género', type: 'select', options: [
      { value: 'masculino', label: 'Masculino' },
      { value: 'femenino', label: 'Femenino' },
      { value: 'no-binario', label: 'No Binario' }
    ]},
      { id: 'RGU_DIRECCION', label: 'Dirección', type: 'text' },
      { id: 'RGU_CORREO', label: 'Correo', type: 'email' },
      { id: 'RGU_TELEFONO', label: 'Teléfono', type: 'number' },
      { id: 'RGU_ROL', label: 'Rol', type: 'select', options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'trab', label: 'Trabajador' },
      { value: 'exclavo', label: 'Exclavo' }
    ]},
      { id: 'RGU_TP_DOC', label: 'Tipo de Documento', type: 'select', options: [
      { value: 'cc', label: 'Cedula nacional' },
      { value: 'ti', label: 'Tarjeta identidad' },
      { value: 'ce', label: 'Cedula extranjera' }
    ]},
      { id: 'RGU_PASSWORD', label: 'Contraseña', type: 'password' },
    ]
  }

  // createUser(userData: any) {
  //   // Lógica para crear un usuario
  //   this.usuarioService.createUser(userData).subscribe(
  //     response => {
  //       console.log('Usuario creado:', response);
  //       this.handleClose();
  //     },
  //     error => console.error('Error al crear usuario:', error)
  //   );
  // }

  // updateUser(userData: any) {
  //   // Lógica para actualizar un usuario
  //   this.usuarioService.updateUser(userData).subscribe(
  //     response => {
  //       console.log('Usuario actualizado:', response);
  //       this.handleClose();
  //     },
  //     error => console.error('Error al actualizar usuario:', error)
  //   );
  // }
}
