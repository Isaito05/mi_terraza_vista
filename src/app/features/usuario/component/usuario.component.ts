// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service'; // Importa el servicio

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = []; // Variable para almacenar la lista de usuarios
  usuarioSeleccionado: any; // Variable para almacenar el usuario seleccionado por ID
  idUsuario: number | null = null; // Inicializa idUsuario como null
  title = 'Modulo de Usuario';
  isEditing = false; // Estado para saber si estamos editando
  editingUser: any = {}; // Datos del usuario que se está editando

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.getData().subscribe(data => {
      this.usuarios = data; // Asigna los datos recibidos a la variable usuarios
      console.log(this.usuarios); // Muestra los datos en la consola para verificar
    });
  }

  // Actualiza el método para aceptar un parámetro ID
  buscarUsuarioPorId(id: number): void {
    this.usuarioService.getUsuarioById(id).subscribe(data => {
      this.usuarioSeleccionado = data; // Asigna el usuario seleccionado
      console.log(this.usuarioSeleccionado); // Muestra el usuario en la consola para verificar
    });
  }

  // Métodos para crear y actualizar usuario
  createUser(userData: any) {
    // Lógica para crear usuario
  }

  updateUser(userData: any) {
    // Lógica para actualizar usuario
  }

  isModalVisible: boolean = false;

  openModal(user?: any) {
    console.log('Abrir modal con usuario:', user);
    this.isEditing = !!user; // Si hay un usuario, estamos en modo de edición
    this.editingUser = user || {}; // Llena el formulario con los datos del usuario
    this.isModalVisible = true;
  }

  handleClose() {
    this.isModalVisible = false;
  }

  // Lógica para confirmar (guardar o actualizar)
  confirm() {
    if (this.isEditing) {
      // Actualiza el usuario
      this.updateUser(this.usuarioSeleccionado);
    } else {
      // Crea un nuevo usuario
      this.createUser(this.usuarioSeleccionado);
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
}
