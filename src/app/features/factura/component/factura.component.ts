import { Component } from '@angular/core';
import { SharedModule } from "../../../shared/shared.module";
import { FacturaService } from '../service/factura.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../usuario/service/usuario.service';
import { Usuario } from '../../usuario/models/usuario.interface';
import { DatosService } from 'src/app/core/services/datos.service';
import { PdfReportService } from 'src/app/core/services/pdf-report.service';
import { ExcelReportService } from 'src/app/core/services/excel-report.service';
import { Factura } from '../models/factura.interface';

@Component({
  selector: 'app-factura',
   standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css' 
})
export class FacturaComponent {
  facturas: any[] = []; 
  facturaSeleccionado: any; // Variable para almacenar el pago seleccionadso por ID
  idfactura: number | null = null; // Inicializa idpago como null
  usuario: any[] = [];
  title = 'Modulo de Factura';
  usuarioMap: { [key: number]: string } = {}; // Mapa para relacionar ID con nombre
  usuarioOptions: { value: string; label: string }[] = [];
  isEditing = false; // Estado para saber si estamos editando
  isViewingDetails = false;
  editingUser: any = {};
  isModalVisible: boolean = false;
  loading: boolean = true;
  modalFields: any[] = []; // Campos del modal
  nombreUsuario: string = "";
  editingPed: any = {};

constructor(public facturaService : FacturaService, private usuarioService: UsuarioService, 
  private datosCompartidos: DatosService, private pdfReportService: PdfReportService,  private excelReportService : ExcelReportService  ){  this.camposFactura()}

  ngOnInit(): void {  
    this.facturaService.getData().subscribe({
      next: (data: any[]) => {
        console.log(data); 
        const usuid = data[0].FACTURA_RGU_ID; 
      
        this.usuarioService.getUsuarioById(usuid).subscribe(
          (usuario) => {
            
            const facturasConUsuarios = data.map((factura) => {
              this.usuarioService.getUsuarioById(factura.FACTURA_RGU_ID).subscribe(
                (usuario) => {
                  factura.nombreUsuario = usuario.RGU_NOMBRES + ' ' + usuario.RGU_APELLIDOS;
                },
                (error) => {
                  console.error('Error al obtener el usuario:', error);
                  factura.nombreUsuario = 'Desconocido'; 
                }
              );
              return factura;
            });
          }
        );

        // Filtrar las facturas con FACTURA_ESTADOE === 1
        this.facturas = data.filter((item: { FACTURA_ESTADOE: number }) => item.FACTURA_ESTADOE === 1);
        console.log(this.facturas);
        
        this.loading = false
      },
      error: (error) => {
        console.error(error);
        this.loading = false
        Swal.fire({
          title: error.error.message || 'Ocurrió un error en el modulo de facturas.',
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
    console.log(user,"locooo tu crees que uno que",user.FACTURA_CANCELADA)
    this.usuarioService.getUsuarios().subscribe((usuarios: Usuario[]) => {
      // this.usuarios = usuarios.filter((item: { RGU_ROL: string; }) => item.RGU_ROL === 'Trabajador');
      const trabajadores = usuarios.filter((item: { RGU_ROL: string; }) => item.RGU_ROL === 'Trabajador');
      this.usuarioOptions = trabajadores.map((usuario: Usuario) => ({
        value: usuario.RGU_ID.toString(), // Convierte el id a string
        label: `${usuario.RGU_NOMBRES} ${usuario.RGU_APELLIDOS} - ${usuario.RGU_IDENTIFICACION}` // Combina nombres y apellidos para la etiqueta
      }));

        // Determina el modo de operación
        if (isDetailView) {
          this.isViewingDetails = true;  // Modo de visualización de detalles
          this.isEditing = false;
        } 
        // else {
        //   this.isEditing = !!user; // Modo edición
        //   this.isViewingDetails = false; // Desactiva el modo de visualización de detalles
        // }
        this.editingUser = user ? { ...user } : {};
        console.log(this.editingUser) // Llena el formulario con los datos del usuario o lo inicializa vacío
        this.isModalVisible = true;
      this.camposFactura()
    });
  }

  // onEdit(user: any) {
  //   console.log('Evento de edición recibido:', user);
  //   this.openModal(user);
  // }

  // onDelete(factura: any) {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: `Eliminarás la factura de: ${factura.nombreUsuario}`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, eliminar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       console.log(factura, 'eta vaina tiene'),
  //       this.facturaService.deleteData(factura.FACTURA_ID).subscribe(
  //         (response) => {
  //           Swal.fire('Eliminado!', 'La factura ha sido eliminado.', 'success').then(() => {
  //             location.reload();
  //           });
  //         },
  //         (error) => {
  //           console.error('Error al eliminar:', error);
  //           Swal.fire('Error', 'Hubo un problema al eliminar la factura', 'error');
  //         }
  //       );
  //     }
  //   });
  // }

  onDetail(user: any) {
    console.log('Evento de detalle recibido:', user);
    this.viewDetails(user);
  }

  viewDetails(user: any) {
    this.openModal(user, true);
  }
  
  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }

  handleClose() {
    this.isModalVisible = false;
  }

  camposFactura() {
    this.modalFields = [      
      { id: 'nombreUsuario', label: 'Nombre del usuario', type: 'text' },
      { id: 'FACTURA_FECHA', label: 'Fecha de registro', type: 'date' },
      { id: 'FACTURA_TOTAL', label: 'Monto', type: 'number' },
      { id: 'FACTURA_METODO_PAGO', label: 'Metodo de pago', type: 'text' },
      { id: 'FACTURA_ESTADO', label: 'Estado', type: 'text' },
      { id: 'FACTURA_DESCRIPCION', label: 'Descripcion', type: 'text' },
      { id: 'FACTURA_FCH_REGISTRO', label: 'Fecha de registro', type: 'date' },
      { id: 'FACTURA_FECHA_CANCELACION', label: 'Fecha de cancelacion', type: 'date' },
      { id: 'FACTURA_CANCELADA', label: 'Factura cancelada', type: 'text' },
    ];
  }

  generateFacturaPdf() {
    const headers = ['Nombre del cliente','Fecha de emisión','Fecha de registro','Monto pagado','Metodo de pago','Estado de factura'
    ,'Descripcion de la factura','Fecha de cancelacion'];
    const selectedItems = this.datosCompartidos.getSelectedItems();

    const data = (selectedItems.length > 0 ? selectedItems : this.facturas).map(factura => [
      String(factura.nombreUsuario),
      String(factura.FACTURA_FECHA),
      String(factura.FACTURA_FCH_REGISTRO),
      String(factura.FACTURA_TOTAL),
      String(factura.FACTURA_METODO_PAGO),
      String(factura.FACTURA_ESTADO),
      String(factura.FACTURA_DESCRIPCION),
      String(factura.FACTURA_FECHA_CANCELACION),
      
    ]);

    this.pdfReportService.generatePdf('Reporte de Factura', headers, data, 'reporte_factura');
  }

  generateFacturaExcel() {
    const columns: (keyof Factura | string)[] = ['Nombre del cliente','Fecha de emisión','Fecha de registro','Monto pagado','Metodo de pago','Estado de factura','Descripcion de la factura','Fecha de cancelacion',];
    const title: any = 'Reporte de Facturas'
    // Mapeo de claves para los encabezados
    const keyMapping: { [key: string]: keyof Factura | string } = {
      'Nombre del cliente':  'nombreUsuario',
      'Fecha de emisión':  'FACTURA_FECHA',
      'Fecha de registro':  'FACTURA_FCH_REGISTRO',
      'Monto pagado':  'FACTURA_TOTAL',
      'Metodo de pago':  'FACTURA_METODO_PAGO',
      'Estado de factura':  'FACTURA_ESTADO',
      'Descripcion de la factura':  'FACTURA_DESCRIPCION',
      'Fecha de cancelacion':  'FACTURA_FECHA_CANCELACION',
    };
    const selectedItems = this.datosCompartidos.getSelectedItems();
    console.log(columns)
    // Asegúrate de que el método espera un arreglo de claves
    this.excelReportService.generateExcel<Factura>(this.facturas, columns, 'Factura', keyMapping, undefined, selectedItems, title);
  }

}
