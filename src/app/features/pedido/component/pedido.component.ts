import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../pedido/service/pedido.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../usuario/service/usuario.service';

export interface Usuario {
  RGU_ID: number;
  RGU_NOMBRES: string;
  RGU_APELLIDOS: string;
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  pedidos: any[] = []; // Array para almacenar la lista de pedidos
  title = 'Modulo de Pedido';
  usuarioOptions: { value: string; label: string }[] = [];
  isEditing = false; // Estado para saber si estamos editando
  isViewingDetails = false;
  editingPed: any = {};
  isModalVisible: boolean = false;
  loading: boolean = true;
  constructor(private pedidoservice: PedidoService, private usuarioService: UsuarioService ) { }

  ngOnInit(): void {
    this.pedidoservice.getData().subscribe({
      next: (data) => {
        this.pedidos = data.filter((item: { PED_ESTADOE: number; }) => item.PED_ESTADOE === 1)
        console.log(this.pedidos);
        console.log(this.pedidos[0].rguUsuario.RGU_ID); // Muestra los datos en la consola para verificar
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          title: error.error.message || 'Ocurrió un error en el modulo de pedidos.',
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
  
  openModal(user?: any,isDetailView: boolean = false) {
    this.usuarioService.getUsuarios().subscribe((usuarios: Usuario[]) => {
      this.usuarioOptions = usuarios.map((usuario: Usuario) => ({
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
        this.editingPed = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
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
      text: `Eliminarás el pedido de: ${user.rguUsuario.RGU_NOMBRES}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed){
        console.log(user.rguUsuario.RGU_NOMBRES, 'eta vaina tiene '),
        console.log('eta vaina tiene ', user.PED_ID),
        this.pedidoservice.deleteData(user.PED_ID).subscribe(
          (response) => {
            Swal.fire('Eliminado!', 'El pedido ha sido eliminado.', 'success').then(() => {
              // Recarga la página solo después de que el usuario haga clic en el botón OK del mensaje
              location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el pedido.', 'error');
          }
        );
      }
    });
  }
}
