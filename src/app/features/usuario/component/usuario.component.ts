// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service'; // Importa el servicio
import Swal from 'sweetalert2';

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
  isViewingDetails = false;
  editingUser: any = {}; // Datos del usuario que se está editando

  isModalVisible: boolean = false; // Estado para controlar la visibilidad del modal
  modalFields: any[] = []; // Campos del modal

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getData().subscribe(data => {
      //Filtra los datos para incluir solo aquellos con RGU_ESTADO igual a 1
      this.usuarios = data.filter((item: { RGU_ESTADO: number; }) => item.RGU_ESTADO === 1);
      console.log(this.usuarios); // Muestra los datos en la consola para verificar
    });
  }

  openModal(user?: any) {
    console.log('Abrir modal con usuario:', user);
    this.isEditing = !!user; // Determina si estamos en modo de edición
    this.isViewingDetails = false;
    this.editingUser = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
    this.isModalVisible = true;
  }

  viewDetails(user: any) {
    this.isViewingDetails = true; // Activa el modo de visualización de detalles
    this.isEditing = false;
    this.editingUser = { ...user }; // Carga los datos del usuario en modo solo lectura
    this.isModalVisible = true;
  }

  handleClose() {
    this.isModalVisible = false;
  }

  confirm() {
    if (this.isEditing) {
    } else {
    }
    this.handleClose();
  }

  onEdit(user: any) {
    console.log('Evento de edición recibido:', user);
    this.openModal(user);
  }
  
  onDetail(user: any) {
    console.log('Evento de detalle recibido:', user);
    this.viewDetails(user);
  }

  onDelete(user: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás al usuario: ${user.RGU_NOMBRES}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteData(user.RGU_ID).subscribe(
          (response) => {
            Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success').then(() => {
              // Recarga la página solo después de que el usuario haga clic en el botón OK del mensaje
              location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
          }
        );
      }
    });
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }
}
