import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProveedorService } from '../service/proveedor.service';
import Swal from 'sweetalert2';
import { DatosService } from 'src/app/core/services/datos.service';
import { ExcelReportService } from 'src/app/core/services/excel-report.service';
import { PdfReportService } from 'src/app/core/services/pdf-report.service';

export interface Proveedor {
  PROV_NOMBRE: string;
  PROV_CORREO: string;
  PROV_DIRECCION: string;
  PROV_NIT: number;
  PROV_TELEFONO: number;
}
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})

export class ProveedorComponent implements OnInit {
  proveedor: any[] = [];
  isEditing = false; // Estado para saber si estamos editando
  isViewingDetails = false;
  editingProv: any = {};
  isModalVisible: boolean = false;
  title = 'Modulo de Proveedor';
  loading: boolean = true;

  constructor(
    private http: HttpClient, 
    private provService: ProveedorService,
    private datosCompartidos: DatosService,
    private excelReportService: ExcelReportService,
    private pdfReportService: PdfReportService,  
    ) { }

  ngOnInit(): void {
    this.provService.getdata().subscribe({
      next: (data) => {
        this.proveedor = data.filter((item: { PROV_ESTADO: number; }) => item.PROV_ESTADO === 1); 
        console.log(this.proveedor);
        this.loading = false; 
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          title: error.error.message || 'Ocurrió un error en el modulo de proveedor.',
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
    this.editingProv = user ? { ...user } : {};
    this.isModalVisible = true;
  }

  handleClose() {
    this.isModalVisible = false;
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }

  viewDetails(user: any) {
    this.isViewingDetails = true; // Activa el modo de visualización de detalles
    this.isEditing = false;
    this.editingProv = { ...user }; // Carga los datos del usuario en modo solo lectura
    this.isModalVisible = true;
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
      text: `Eliminarás al proveedor: ${user.PROV_NOMBRE}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(user.PROV_NOMBRE, 'eta vaina tiene '),
        this.provService.deleteData(user.PROV_ID).subscribe(
          (response) => {
            Swal.fire('Eliminado!', 'El proveedor ha sido eliminado.', 'success').then(() => {
              // Recarga la página solo después de que el usuario haga clic en el botón OK del mensaje
              location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'Hubo un problema al eliminar el proveedor.', 'error');
          }
        );
      }
    });
  }

  generateProveedorPdf() {
    const headers = ['Nombre del proveedor', 'Correo del proveedor', 'Telefono del proveedor', 'Direccion del proveedor', 'Nit del proveedor'];
    const selectedItems = this.datosCompartidos.getSelectedItems();

    const data = (selectedItems.length > 0 ? selectedItems : this.proveedor).map(proveedor => [
      String(proveedor.PROV_NOMBRE),
      String(proveedor.PROV_CORREO),
      String(proveedor.PROV_TELEFONO),
      String(proveedor.PROV_DIRECCION),
      String(proveedor.PROV_NIT)
    ]);

    try {
        this.pdfReportService.generatePdf('Reporte de Proveedor', headers, data, 'reporte_proveedor');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
    }
  }


  generateProveedorExcel() {
    const columns: (keyof Proveedor | string)[] = ['Nombre del proveedor','Correo del proveedor','Telefono del proveedor','Direccion del proveedor','Nit del proveedor'];
    const title: any = 'Reporte de Proveedores'
    // Mapeo de claves para los encabezados
    const keyMapping: { [key: string]: keyof Proveedor | string } = {
      'Nombre del proveedor': 'PROV_NOMBRE',
      'Correo del proveedor': 'PROV_CORREO',
      'Telefono del proveedor': 'PROV_TELEFONO',
      'Direccion del proveedor': 'PROV_DIRECCION',
      'Nit del proveedor': 'PROV_NIT'
    };
    const selectedItems = this.datosCompartidos.getSelectedItems();
    console.log(columns)
    // Asegúrate de que el método espera un arreglo de claves
    this.excelReportService.generateExcel<Proveedor>(this.proveedor, columns, 'Proveedor_reporte', keyMapping, undefined, selectedItems, title);
  }

}
