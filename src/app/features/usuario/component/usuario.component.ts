// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../service/usuario.service'; // Importa el servicio
import { PdfReportService } from 'src/app/core/services/pdf-report.service';
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
  loading: boolean = true;

  constructor(
    private usuarioService: UsuarioService, private pdfReportService: PdfReportService
    
  ) {
    this.camposUsuario();
  }

  ngOnInit(): void {
    this.usuarioService.getData().subscribe({
      next: (data) => {
        this.usuarios = data.filter((item: { RGU_ESTADO: number }) => item.RGU_ESTADO === 1);
        this.loading = false
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          title: error.error.message || 'Ocurrió un error en el modulo de usuarios.',
          text: "Contacte al Administrador!",
          icon: 'error',
          timer: 2000,
          showConfirmButton: false,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
      }
    });
  }

  openModal(user?: any) {
    console.log('Abrir modal con usuario:', user);
    this.isEditing = !!user; // Determina si estamos en modo de edición
    this.isViewingDetails = false;
    this.editingUser = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
    this.isModalVisible = true;
    this.camposUsuario();
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

  camposUsuario() {
    this.modalFields = [      
      { id: 'RGU_NOMBRES', label: 'Nombres', type: 'text' },
      { id: 'RGU_APELLIDOS', label: 'Apellidos', type: 'text' },
      { id: 'RGU_GENERO', label: 'Género', type: 'select', options: [
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Femenino', label: 'Femenino' },
        { value: 'No_binario', label: 'No Binario' }
      ]},
      { id: 'RGU_DIRECCION', label: 'Dirección', type: 'text' },
      { id: 'RGU_CORREO', label: 'Correo', type: 'email' },
      { id: 'RGU_TELEFONO', label: 'Telefono', type: 'number' },
      { id: 'RGU_ROL', label: 'Rol', type: 'select', options: [
        { value: 'Administrador', label: 'Administrador' },
        { value: 'Trabajador', label: 'Trabajador' },
        { value: 'Cliente', label: 'Cliente' }
      ]},
      { id: 'RGU_TP_DOC', label: 'Tipo de identificación', type: 'select', options: [
        { value: 'Cedula', label: 'Cédula nacional' },
        { value: 'Tarjeta_Identidad', label: 'Tarjeta de identidad' },
        { value: 'ce', label: 'Cédula extranjera' }
      ]},
      { id: 'RGU_IDENTIFICACION', label: 'Nro. de identificación', type: 'number' },
    ];
    
    // Solo agregar el campo de contraseña si no se está editando ni visualizando detalles
    if (!this.isEditing && !this.isViewingDetails) {
      this.modalFields.push({ id: 'RGU_PASSWORD', label: 'Contraseña', type: 'password' });
    }
    
    if(this.isEditing) {
      this.modalFields.push({ id: 'RGU_IMG_PROFILE', label: 'Foto de perfil', type: 'file' }),
      this.modalFields.push({ id: 'RGU_ID', label: 'ID', type: 'number' });
    }
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }

  // Método para generar PDF de usuarios
  generateUsuarioPdf() {
    const headers = ['ID', 'Nombre', 'Apellido', 'Correo', 'Teléfono'];
    const data = this.usuarios.map(usuario => [
      usuario.RGU_ID,
      usuario.RGU_NOMBRES,
      usuario.RGU_APELLIDOS,
      usuario.RGU_CORREO,
      usuario.RGU_TELEFONO
    ]);

    this.pdfReportService.generatePdf('Reporte de Usuarios', headers, data, 'reporte_usuarios');
  }
}
