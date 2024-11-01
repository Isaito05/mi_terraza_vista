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
  isModalVisible: boolean = false;
  loading: boolean = true;

  constructor(private http: HttpClient,
    private proporvService: ProprovService,
    private bodegaService: BodegaService
    ) { }

  ngOnInit(): void {
    this.bodegaService.getData().subscribe({
      next: (data) => {
        this.bodegas = data.filter((item: { BOD_ESTADOE: number; }) => item.BOD_ESTADOE === 1); // Asigna los datos recibidos a la variable pagos
        console.log(this.bodegas); // Muestra los datos en la consola para verificar
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          title: error.error.message || 'Ocurrió un error en el modulo de bodega.',
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

  getBodegas(): void {
    this.http.get<any[]>('http://localhost:3000/bodega').subscribe(data => {
      this.bodegas = data;
    });
  }

  


  openModal(user?: any, isDetailView: boolean = false) {
    this.proporvService.getProprov().subscribe((productos: ProProv[]) => {
      this.productosoOptions = productos.map((producto: ProProv) => ({
        value: producto.PROPROV_ID.toString(), // Convierte el id a string
        label: `${producto.PROPROV_NOMBRE}` // Combina nombres y apellidos para la etiqueta
      }));

      if (isDetailView) {
        this.isViewingDetails = true;  // Modo de visualización de detalles
        this.isEditing = false;
      } else {
        this.isEditing = !!user; // Modo edición
        this.isViewingDetails = false; // Desactiva el modo de visualización de detalles
      }
      this.editingBodega = user ?{ ...user } : {};
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
      text: `Eliminarás el producto en bodega: ${user.proprov.PROPROV_NOMBRE}`,
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
            Swal.fire('Eliminado!', 'El producto en bodega ha sido eliminado.', 'success').then(() => {
              // Recarga la página solo después de que el usuario haga clic en el botón OK del mensaje
              location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el producto en bodega.', 'error');
          }
        );
      }
    });
  }

  // generateUsuarioPdf() {
  //   const headers = ['ID','Nombre', 'Apellido', 'Correo', 'Teléfono','Direccion','Tp. Identificacion','Nro. Identificacion'];
  //   const selectedItems = this.datosCompartidos.getSelectedItems();

  //   const data = (selectedItems.length > 0 ? selectedItems : this.usuarios).map(usuario => [
  //     usuario.RGU_ID,
  //     usuario.RGU_NOMBRES,
  //     usuario.RGU_APELLIDOS,
  //     usuario.RGU_CORREO,
  //     usuario.RGU_TELEFONO,
  //     usuario.RGU_DIRECCION,
  //     usuario.RGU_TP_DOC,
  //     usuario.RGU_IDENTIFICACION
  //   ]);

  //   this.pdfReportService.generatePdf('Reporte de Usuarios', headers, data, 'reporte_usuarios');
  // }

  enableBodyScroll() {
    document.body.style.overflow = 'auto'; // Reactiva el scroll de la página
  }

  // generateUsuarioExcel() {
  //   const columns: (keyof Usuario | string)[] = ['Nombres', 'Apellidos', 'Correo', 'Direccion', 'Documento', 'Rol', 'Genero', 'Telefono'];
  //   // Mapeo de claves para los encabezados
  //   const keyMapping: { [key: string]: keyof Usuario | string } = {
  //     'Nombres': 'RGU_NOMBRES',
  //     'Apellidos': 'RGU_APELLIDOS',
  //     'Correo': 'RGU_CORREO',
  //     'Direccion': 'RGU_DIRECCION',
  //     'Documento': 'RGU_IDENTIFICACION', 
  //     'Rol': 'RGU_ROL', 
  //     'Genero': 'RGU_GENERO', 
  //     'Telefono': 'RGU_TELEFONO'
  //   };
    
  //   console.log(columns)
  //   // Asegúrate de que el método espera un arreglo de claves
  //   this.excelReportService.generateExcel<Usuario>(this.usuarios, columns, 'Usuarios_reporte', keyMapping);
  // }
}
