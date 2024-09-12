import { Component, OnInit } from '@angular/core';
import { ProprovService } from '../service/proprov.service';
import { ProveedorService } from '../../proveedor/service/proveedor.service';
import Swal from 'sweetalert2';

export interface Proveedor {
  PROV_ID: number;
  PROV_NOMBRE: string;
}

@Component({
  selector: 'app-proprov',
  templateUrl: './proprov.component.html',
  styleUrls: ['./proprov.component.css']
})

export class ProprovComponent implements OnInit {
  proprovs: any[] = []; // Variable para almacenar la lista de proprovs
  proveedoresOptions: { value: string; label: string }[] = [];
  isEditing = false; // Estado para saber si estamos editando
  isViewingDetails = false;
  editingProprov: any = {};
  isModalVisible: boolean = false;
  title = 'Modulo de Proprov';

  constructor(private ProprovService: ProprovService, private proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.ProprovService.getData().subscribe(data => {
      this.proprovs = data.filter((item: { PROPROV_ESTADO: number; }) => item.PROPROV_ESTADO === 1); // Asigna los datos recibidos a la variable pagos
      console.log(this.proprovs); // Muestra los datos en la consola para verificar
    });
  }

  openModal(user?: any, isDetailView: boolean = false) {
    this.proveedorService.getProveedor().subscribe((proveedor: Proveedor[]) => {
      this.proveedoresOptions = proveedor.map((proveedor: Proveedor) => ({
        value: proveedor.PROV_ID.toString(), // Convierte el id a string
        label: `${proveedor.PROV_NOMBRE}` // Combina nombres y apellidos para la etiqueta
      }));
        // Determina el modo de operación
        if (isDetailView) {
          this.isViewingDetails = true;  // Modo de visualización de detalles
          this.isEditing = false;
        } else {
          this.isEditing = !!user; // Modo edición
          this.isViewingDetails = false; // Desactiva el modo de visualización de detalles
        }
        this.editingProprov = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
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
      text: `Eliminarás al usuario: ${user.proveedor.PROV_NOMBRE}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(user.proveedor.PROV_NOMBRE, 'eta vaina tiene '),
        this.ProprovService.deleteData(user.PROPROV_ID).subscribe(
          (response) => {
            Swal.fire('Eliminado!', 'El producto del proveedor ha sido eliminado.', 'success').then(() => {
              location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el producto del proveedor.', 'error');
          }
        );
      }
    });
  }
}

