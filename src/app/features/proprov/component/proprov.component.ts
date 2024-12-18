import { Component, OnInit } from '@angular/core';

import { ProProv } from '../models/proprov.interface';
import { Proveedor } from '../../proveedor/models/proveedor.interface';

import { ProprovService } from '../service/proprov.service';
import { ProveedorService } from '../../proveedor/service/proveedor.service';
import { DatosService } from 'src/app/core/services/datos.service';
import { ExcelReportService } from 'src/app/core/services/excel-report.service';
import { PdfReportService } from 'src/app/core/services/pdf-report.service';

import Swal from 'sweetalert2';

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
  loading: boolean = true;

  constructor(
    private ProprovService: ProprovService, 
    private proveedorService: ProveedorService,
    private datosCompartidos: DatosService,
    private excelReportService: ExcelReportService,
    private pdfReportService: PdfReportService,
  ) { }

  ngOnInit(): void {
    this.ProprovService.getData().subscribe({
      next: (data) => {
        this.proprovs = data.filter((item: { PROPROV_ESTADO: number; }) => item.PROPROV_ESTADO === 1); // Asigna los datos recibidos a la variable pagos
        console.log(this.proprovs); // Muestra los datos en la consola para verificar
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          title: error.error.message || 'Ocurrió un error en el modulo de productos de proveedor.',
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
      text: `Eliminarás el producto del proveedor: ${user.proveedor.PROV_NOMBRE}`,
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

  generateProProvPdf() {
    const headers = ['Nombre del producto','Cantidad del producto','Fecha de ingreso del producto','Precio unitario','Descripcion del producto','Provedor del producto'];
    const selectedItems = this.datosCompartidos.getSelectedItems();

    const data = (selectedItems.length > 0 ? selectedItems : this.proprovs).map(proprov => [
      String(proprov.PROPROV_NOMBRE),
      String(proprov.PROPROV_CANTIDAD),
      String(proprov.PROPROV_FCH_INGRESO),
      String(proprov.PROPROV_PRECIO_UNITARIO),
      String(proprov.PROPROV_DESCRIPCION),
      String(proprov.proveedor.PROV_NOMBRE)
    ]);

    this.pdfReportService.generatePdf('Reporte de Productos de Proveedor', headers, data, 'reporte_proprov');
  }

  generateProProvExcel() {
    const columns: (keyof ProProv | string)[] = ['Nombre del producto','Cantidad del producto','Fecha de ingreso del producto','Precio unitario','Descripcion del producto','Provedor del producto'];
    const title: any = 'Reporte de Productos por Proveedor'
    // Mapeo de claves para los encabezados
    const keyMapping: { [key: string]: keyof ProProv | string } = {
      'Nombre del producto': 'PROPROV_NOMBRE',
      'Cantidad del producto': 'PROPROV_CANTIDAD',
      'Fecha de ingreso del producto': 'PROPROV_FCH_INGRESO',
      'Precio unitario': 'PROPROV_PRECIO_UNITARIO',
      'Descripcion del producto': 'PROPROV_DESCRIPCION',
      'Provedor del producto': 'proveedor.PROV_NOMBRE'
    };
    const selectedItems = this.datosCompartidos.getSelectedItems();
    console.log(columns)
    // Asegúrate de que el método espera un arreglo de claves
    this.excelReportService.generateExcel<ProProv>(this.proprovs, columns, 'ProProv_reporte', keyMapping, undefined, selectedItems, title);
  }
}

