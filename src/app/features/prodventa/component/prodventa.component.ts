import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ProdVenta } from '../models/prodventa.interface';

import { ProdventaService } from '../services/prodventa.service';
import { environment } from 'src/environments/environment';
import { DatosService } from 'src/app/core/services/datos.service';
import { ExcelReportService } from 'src/app/core/services/excel-report.service';
import { PdfReportService } from 'src/app/core/services/pdf-report.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-prodventa',
  templateUrl: './prodventa.component.html',
  styleUrls: ['./prodventa.component.css']
})

export class ProdventaComponent implements OnInit {
  prodventa: any[] = [];
  modalFields: any [] = [];
  productData = {
    PROD_VENTA_NOMBRE: '',
    PROD_VENTA_DESCRIPCION: '',
    PROD_VENTA_PRECIO: '',
    PROD_VENTA_IMAGEN: null as File | null
  };
  isEditing = false; // Estado para saber si estamos editando
  isViewingDetails = false;
  editingprodventa: any = {};
  isModalVisible: boolean = false;
  title = 'Modulo de Producto en venta';
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    public prodventaService: ProdventaService,
    private datosCompartidos: DatosService,
    private excelReportService: ExcelReportService,
    private pdfReportService: PdfReportService
  ) {this.camposProdVenta() }

  ngOnInit(): void {
    this.prodventaService.getData().subscribe({
      next: (data) => {
        //Filtra los datos para incluir solo aquellos con RGU_ESTADO igual a 1
        this.prodventa = data.filter((item: { PROD_VENTA_ESTADO: number; }) => item.PROD_VENTA_ESTADO === 1);
        console.log(this.prodventa); // Muestra los datos en la consola para verificar
        this.loading = false;
      },
      error: (error) => {
        console.error(error)
        this.loading = false;
        Swal.fire({
          title: error.error.message || 'Ocurrió un error en el modulo de productos en venta.',
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

  getProdventa(): void {
    this.http.get<any[]>(`${environment.apiUrlHttp}/prodventa`).subscribe(data => {
      this.prodventa = data;
    })
  }

  openModal(user?: any) {
    console.log('Abrir modal con usuario:', user);
    this.isEditing = !!user; // Determina si estamos en modo de edición
    this.isViewingDetails = false;
    this.editingprodventa = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
    this.isModalVisible = true;
    this.camposProdVenta()
  }

  handleClose() {
    this.isModalVisible = false;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
        this.productData.PROD_VENTA_IMAGEN = event.target.files[0];
    } else {
        this.productData.PROD_VENTA_IMAGEN = null; // Manejar el caso en que no se selecciona ningún archivo
    }
  }

  onEdit(user: any) {
    console.log('Evento de edición recibido:', user);
    this.openModal(user);
  }

  onDetail(user: any) {
    console.log('Evento de detalle recibido:', user);
    this.viewDetails(user);
  }

  viewDetails(user: any) {
    this.isViewingDetails = true; // Activa el modo de visualización de detalles
    this.isEditing = false;
    this.editingprodventa = { ...user }; // Carga los datos del usuario en modo solo lectura
    this.isModalVisible = true;
  }

  onDelete(user: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás el producto: ${user.PROD_VENTA_NOMBRE}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(user.PROD_VENTA_NOMBRE, 'eta vaina tiene '),
        this.prodventaService.deleteData(user.PROD_VENTA_ID).subscribe(
          (response) => {
            Swal.fire('Eliminado!', 'El producto en venta ha sido eliminado.', 'success').then(() => {
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

  handleConfirm() { 
    const formData = new FormData();
    // Agregar datos del producto
    formData.append('PROD_VENTA_NOMBRE', this.productData.PROD_VENTA_NOMBRE);
    formData.append('PROD_VENTA_DESCRIPCION', this.productData.PROD_VENTA_DESCRIPCION);
    formData.append('PROD_VENTA_PRECIO', this.productData.PROD_VENTA_PRECIO.toString());
  
  }

  camposProdVenta() {
    this.modalFields = [
      { id: 'PROD_VENTA_NOMBRE', label: 'Nombre', type: 'text'},
      { id: 'PROD_VENTA_DESCRIPCION', label: 'Descripcion', type: 'text'},
      { id: 'PROD_VENTA_PRECIO', label: 'Precio', type: 'number'},
      { id: 'PROD_VENTA_IMAGEN', label: 'Imagen', type: 'file'}
    ]
    if(this.isEditing) {
      // this.modalFields.push({ id: 'RGU_IMG_PROFILE', label: 'Foto de perfil', type: 'file' }),
      this.modalFields.push({ id: 'PROD_VENTA_ID', label: 'ID', type: 'number' });
    }
  }

  generateProdVentaPdf() {
    const headers = ['Nombre del producto','Descripcion del producto','Precio del producto','Imagen del producto'];
    const selectedItems = this.datosCompartidos.getSelectedItems();

    const data = (selectedItems.length > 0 ? selectedItems : this.prodventa).map(prodventa => [
      String(prodventa.PROD_VENTA_NOMBRE),
      String(prodventa.PROD_VENTA_DESCRIPCION),
      String(prodventa.PROD_VENTA_PRECIO),
      String(prodventa.PROD_VENTA_IMAGEN)
    ]);

    this.pdfReportService.generatePdf('Reporte de Productos en Venta', headers, data, 'reporte_prodventa');
  }

  generateProdVentaExcel() {
    const columns: (keyof ProdVenta | string)[] = ['Nombre del producto','Descripcion del producto','Precio del producto','Imagen del producto'];
    const title: any = 'Reporte de Productos en Venta'
    // Mapeo de claves para los encabezados
    const keyMapping: { [key: string]: keyof ProdVenta | string } = {
      'Nombre del producto': 'PROD_VENTA_NOMBRE',
      'Descripcion del producto': 'PROD_VENTA_DESCRIPCION',
      'Precio del producto': 'PROD_VENTA_PRECIO',
      'Imagen del producto': 'PROD_VENTA_IMAGEN'
    };
    const selectedItems = this.datosCompartidos.getSelectedItems();
    console.log(columns)
    // Asegúrate de que el método espera un arreglo de claves
    this.excelReportService.generateExcel<ProdVenta>(this.prodventa, columns, 'Prodventa_reporte', keyMapping, undefined, selectedItems, title);
  }

}


