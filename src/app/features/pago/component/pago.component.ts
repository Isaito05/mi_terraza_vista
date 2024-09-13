import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { PagoService } from '../service/pago.service';
import { UsuarioService } from '../../usuario/service/usuario.service';
import Swal from 'sweetalert2';

export interface Usuario {
  RGU_ID: number;
  RGU_NOMBRES: string;
  RGU_APELLIDOS: string;
  RGU_ROL: string;
}

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pagos: any[] = []; // Variable para almacenar la lista de pagos
  pagoSeleccionado: any; // Variable para almacenar el pago seleccionadso por ID
  idpago: number | null = null; // Inicializa idpago como null
  usuario: any[] = [];
  title = 'Modulo de Pagos';
  usuarioMap: { [key: number]: string } = {}; // Mapa para relacionar ID con nombre
  usuarioOptions: { value: string; label: string }[] = [];
  isEditing = false; // Estado para saber si estamos editando
  isViewingDetails = false;
  editingUser: any = {};
  isModalVisible: boolean = false;

  constructor(
    private pagoService: PagoService,
    private http: HttpClient,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.pagoService.getData().subscribe(data => {
      this.pagos = data.filter((item: { PAGO_ESTADO: number; }) => item.PAGO_ESTADO === 1); // Asigna los datos recibidos a la variable pagos
      console.log(this.pagos); // Muestra los datos en la consola para verificar
    });
  }

  // Actualiza el método para aceptar un parámetro ID
  buscarpagoPorId(id: number): void {
    this.pagoService.getPagoById(id).subscribe(data => {
      this.pagoSeleccionado = data; // Asigna el pago seleccionado
      console.log(this.pagoSeleccionado); // Muestra el pago en la consola para verificar
    });
  }

  openModal(user?: any, isDetailView: boolean = false) {
    this.usuarioService.getUsuarios().subscribe((usuarios: Usuario[]) => {
      // this.usuarios = usuarios.filter((item: { RGU_ROL: string; }) => item.RGU_ROL === 'Trabajador');
      console.log();
      const trabajadores = usuarios.filter((item: { RGU_ROL: string; }) => item.RGU_ROL === 'Trabajador');
      this.usuarioOptions = trabajadores.map((usuario: Usuario) => ({
        
        value: usuario.RGU_ID.toString(), // Convierte el id a string
        label: `${usuario.RGU_NOMBRES} ${usuario.RGU_APELLIDOS}` // Combina nombres y apellidos para la etiqueta
      }));

        // Determina el modo de operación
      if (isDetailView) {
        this.isViewingDetails = true;  // Modo de visualización de detalles
        this.isEditing = false;
      } else {
        this.isEditing = !!user; // Modo edición
        this.isViewingDetails = false; // Desactiva el modo de visualización de detalles
      }
      this.editingUser = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
      this.isModalVisible = true;
    });
  }

  viewDetails(user: any) {
    this.openModal(user, true);
  }

  handleClose() {
    this.isModalVisible = false;
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
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
      text: `Eliminarás el pago de: ${user.rguUsuario.RGU_NOMBRES}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(user.rguUsuario.RGU_NOMBRES, 'eta vaina tiene '),
        this.pagoService.deleteData(user.PAGO_ID).subscribe(
          (response) => {
            Swal.fire('Eliminado!', 'El pago ha sido eliminado.', 'success').then(() => {
              // Recarga la página solo después de que el usuario haga clic en el botón OK del mensaje
              location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el pago.', 'error');
          }
        );
      }
    });
  }
}