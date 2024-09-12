import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Observable } from 'rxjs';
import { BodegaService } from '../service/bodega.service';
import { ProprovService } from '../../proprov/service/proprov.service';
import Swal from 'sweetalert2';

export interface ProProv {
  PROPROV_ID: number;
  PROPROV_NOMBRE: string;
}

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent implements OnInit {
  bodegas: any[] = [];
  proprov: any[] = [];
  title = 'Modulo de Bodega';
  proprovMap: { [key: number]: string } = {}; // Mapa para relacionar ID con nombre
  productosoOptions: { value: string; label: string }[] = [];
  isEditing = false; // Estado para saber si estamos editando
  isViewingDetails = false;
  editingBodega: any = {};

  constructor(private http: HttpClient,
    private proporvService: ProprovService,
    private bodegaService: BodegaService
    ) { }

  ngOnInit(): void {
    this.bodegaService.getData().subscribe(data => {
      this.bodegas = data.filter((item: { BOD_ESTADOE: number; }) => item.BOD_ESTADOE === 1); // Asigna los datos recibidos a la variable pagos
      console.log(this.bodegas); // Muestra los datos en la consola para verificar
    });
  }

  getBodegas(): void {
    this.http.get<any[]>('http://localhost:3000/bodega').subscribe(data => {
      this.bodegas = data;
    });
  }

  isModalVisible: boolean = false;


  openModal(user?: any) {
    this.proporvService.getProprov().subscribe((productos: ProProv[]) => {
      this.productosoOptions = productos.map((producto: ProProv) => ({
        value: producto.PROPROV_ID.toString(), // Convierte el id a string
        label: `${producto.PROPROV_NOMBRE}` // Combina nombres y apellidos para la etiqueta
      }));
      console.log(productos);
      this.isEditing = !!user; // Determina si estamos en modo de edición
      this.isViewingDetails = false;
      this.editingBodega = user ? { ...user } : {};
      this.isModalVisible = true;
    });
  }

  viewDetails(user: any) {
    this.isViewingDetails = true; // Activa el modo de visualización de detalles
    this.isEditing = false;
    this.editingBodega = { ...user }; // Carga los datos del usuario en modo solo lectura
    this.isModalVisible = true;
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
      text: `Eliminarás al usuario: ${user.proprov.PROPROV_NOMBRE}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(user.proprov.PROPROV_NOMBRE, 'eta vaina tiene '),
        this.bodegaService.deleteData(user.BOD_ID).subscribe(
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
}
