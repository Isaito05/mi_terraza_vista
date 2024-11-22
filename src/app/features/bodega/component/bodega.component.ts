import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Bodega } from '../models/bodega.interface';
import { ProProv } from '../../proprov/models/proprov.interface';

import { BodegaService } from '../service/bodega.service';
import { ProprovService } from '../../proprov/service/proprov.service';
import { DatosService } from 'src/app/core/services/datos.service';
import { ExcelReportService } from 'src/app/core/services/excel-report.service';
import { PdfReportService } from 'src/app/core/services/pdf-report.service';

import Swal from 'sweetalert2';

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
    private bodegaService: BodegaService,
    private datosCompartidos: DatosService, 
    private excelReportService: ExcelReportService,
    private pdfReportService: PdfReportService,  
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

  generateBodegaPdf() {
    const headers = ['Estado de Producto','Stock en bodega','Nombre del Producto'];
    const selectedItems = this.datosCompartidos.getSelectedItems();

    const data = (selectedItems.length > 0 ? selectedItems : this.bodegas).map(bodega => [
      String(bodega.BOD_ESTADO),
      String(bodega.BOD_STOCK_MINIMO),
      String(bodega.proprov.PROPROV_NOMBRE)
    ]);

    this.pdfReportService.generatePdf('Reporte de Bodega', headers, data, 'reporte_bodega');
  }

  enableBodyScroll() {
    document.body.style.overflow = 'auto'; // Reactiva el scroll de la página
  }

  generateBodegaExcel() {
    const columns: (keyof Bodega | string)[] = ['Estado de Producto','Stock en bodega','Nombre del Producto'];
    const title: any = 'Reporte de Bodega'
    // Mapeo de claves para los encabezados
    const keyMapping: { [key: string]: keyof Bodega | string } = {
      'Estado de Producto': 'BOD_ESTADO',
      'Stock en bodega': 'BOD_STOCK_MINIMO',
      'Nombre del Producto': 'proprov.PROPROV_NOMBRE'
    };
    const selectedItems = this.datosCompartidos.getSelectedItems();
    console.log(columns)
    // Asegúrate de que el método espera un arreglo de claves
    this.excelReportService.generateExcel<Bodega>(this.bodegas, columns, 'Bodega_reporte', keyMapping, undefined, selectedItems, title);
  }
}
