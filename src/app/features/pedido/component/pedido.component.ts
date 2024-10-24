import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../pedido/service/pedido.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../usuario/service/usuario.service';
import { PdfReportService } from 'src/app/core/services/pdf-report.service';
import { ProdventaService } from '../../prodventa/services/prodventa.service';

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
  filteredPedidos: any[] = [];
  clientesUnicos: string[] = [];
  productos: string[] = [];
  todo: boolean = false;
  selectedEstado: string = '';
  filtersApplied: boolean = false; // Para mostrar si los filtros han sido aplicados

  constructor(private pedidoservice: PedidoService, private usuarioService: UsuarioService, private prodventaService: ProdventaService, private pdfReportService: PdfReportService) { }

  selectedFields: any = {
    pedidoId: false,
    fecha: false,
    estado: false,
    infoPedido: false,
    precioTotal: false,
    descripcion: false,
    cancelado: false,
    nombreUsuario: false

  };

  ngOnInit(): void {
    this.pedidoservice.getData().subscribe({
      next: (data) => {
        this.pedidos = data.filter((item: { PED_ESTADOE: number; }) => item.PED_ESTADOE === 1)
        console.log(this.pedidos);
        console.log(this.pedidos[0].rguUsuario.RGU_ID); // Muestra los datos en la consola para verificar
        const clientes = this.pedidos.map(pedido => pedido.rguUsuario.RGU_NOMBRES);
        this.clientesUnicos = [...new Set(clientes)];

        // Extraer productos únicos de los pedidos
        const productosPromises: Promise<void>[] = [];
        const productosSet = new Set<string>();

        this.pedidos.forEach(pedido => {
          const pedInfoArray = JSON.parse(pedido.PED_INFO);  // Convertir el campo PED_INFO a array de productos
          pedInfoArray.forEach((producto: { id: number; cantidad: number }) => {
            const productoPromise = this.prodventaService.getProVenById(producto.id).toPromise().then(productoDetails => {
              productosSet.add(productoDetails.PROD_VENTA_NOMBRE);  // Agregar el nombre del producto al Set
            });
            productosPromises.push(productoPromise);
          });
        });

        // Después de que todas las promesas se resuelvan, llenar el array de productos
        Promise.all(productosPromises).then(() => {
          this.productos = Array.from(productosSet);  // Convertir el Set a un Array
        });

        this.filteredPedidos = data;
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

  openModal(user?: any, isDetailView: boolean = false) {
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
      if (result.isConfirmed) {
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
  disableBodyScroll() {
    document.body.style.overflow = 'hidden';  // Desactiva el scroll de la página
  }

  enableBodyScroll() {
    document.body.style.overflow = 'auto';  // Reactiva el scroll de la página
  }


  filters = {
    dateRange: { startDate: null, endDate: null },
    status: "",  // 'Cancelado', 'Enviado', 'Pendiente'
    nombreCliente: "",
    selectedProduct: "",
    minPrecioTotal: null,  // Precio mínimo
    maxPrecioTotal: null
  };



  applyFilters(): any[] {
    const filteredPedidos = this.pedidos.filter(pedido => {
      const pedidoFecha = new Date(pedido.PED_FECHA);
      const { startDate, endDate } = this.filters.dateRange;

      // Reiniciar matches a true al inicio
      let matches = true;

      if (startDate && pedidoFecha < new Date(startDate)) matches = false; // Cambiar <= a <
      if (endDate && pedidoFecha > new Date(endDate)) matches = false;

      // Filtro por estado
      if (this.filters.status && pedido.PED_ESTADO !== this.filters.status) {
        matches = false;
      }

      // Filtro por nombre de cliente
      if (this.filters.nombreCliente && pedido.rguUsuario.RGU_NOMBRES !== this.filters.nombreCliente) {
        matches = false;
      }

      // Filtro por producto
      if (this.filters.selectedProduct) {
        const pedInfoArray = JSON.parse(pedido.PED_INFO);
        const hasSelectedProduct = pedInfoArray.some((producto: { id: number; cantidad: number }) => {
          return this.prodventaService.getProVenById(producto.id).toPromise().then(productoDetails => {
            return productoDetails.PROD_VENTA_NOMBRE === this.filters.selectedProduct;
          });
        });

        if (!hasSelectedProduct) matches = false;
      }

      // Filtro por precio total
      const precioTotal = pedido.PED_PRECIO_TOTAL;
      if (this.filters.minPrecioTotal && precioTotal < this.filters.minPrecioTotal) {
        matches = false;
      }
      if (this.filters.maxPrecioTotal && precioTotal > this.filters.maxPrecioTotal) {
        matches = false;
      }

      return matches;
    });

    this.filtersApplied = true;
    setTimeout(() => {
      this.filtersApplied = false;
    }, 2000);

    return filteredPedidos;
  }





  generatePedidoPdf(): void {
    // Verificar si al menos un campo está seleccionado
    const anyFieldSelected = Object.values(this.selectedFields).some(value => value);
    console.log(anyFieldSelected, 'samuel');

    if (!anyFieldSelected) {
      Swal.fire({
        title: 'Campos no seleccionados',
        text: 'Debes seleccionar al menos un campo para generar el PDF.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return; // Salir de la función si no hay campos seleccionados
    }

    const headers: string[] = [];
    // Definir encabezados según los campos seleccionados
    if (this.selectedFields.nombreUsuario) headers.push('Cliente');
    if (this.selectedFields.fecha) headers.push('Fecha');
    if (this.selectedFields.estado) headers.push('Estado');
    if (this.selectedFields.infoPedido) headers.push('Info Pedido');
    if (this.selectedFields.descripcion) headers.push('Descripcion');
    if (this.selectedFields.cancelado) headers.push('Cancelado');
    if (this.selectedFields.precioTotal) headers.push('Precio Total');

    this.pedidoservice.getData().subscribe(data => {
      // Aplicar filtros
      this.pedidos = data; // Asegúrate de tener tus pedidos aquí
      const filteredData = this.applyFilters(); // Ahora esto debería ser un array filtrado

      // Verificar si hay datos filtrados
      if (filteredData.length === 0) {
        Swal.fire({
          title: 'Sin datos',
          text: 'No hay datos disponibles para generar el PDF.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return; // Salir de la función si no hay datos
      }

      const rows: any[][] = [];
      const productNamesPromises: any[] = [];

      filteredData.forEach((pedido: any) => {
        const row: any[] = [];
        const pedInfoArray = JSON.parse(pedido.PED_INFO);
        const productosInfoPromises: Promise<string>[] = [];

        if (this.selectedFields.nombreUsuario) row.push(pedido.rguUsuario.RGU_NOMBRES);
        if (this.selectedFields.fecha) {
          const fecha = new Date(pedido.PED_FECHA);
          const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          row.push(fechaFormateada);
        }
        if (this.selectedFields.estado) row.push(pedido.PED_ESTADO);
        if (this.selectedFields.descripcion) row.push(pedido.PED_DESCRIPCION);
        if (this.selectedFields.cancelado) row.push(pedido.PED_CANCELADO);

        if (this.selectedFields.infoPedido) {
          pedInfoArray.forEach((producto: { id: number; cantidad: number }) => {
            const productoPromise = this.prodventaService.getProVenById(producto.id).toPromise().then(productoDetails => {
              return `${productoDetails.PROD_VENTA_NOMBRE} (Cantidad: ${producto.cantidad})`;
            });
            productosInfoPromises.push(productoPromise);
          });
        }

        if (this.selectedFields.precioTotal) {
          const precioFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(pedido.PED_PRECIO_TOTAL);
          row.push(precioFormateado);
        }

        const productInfoPromise = Promise.all(productosInfoPromises).then(productInfoArray => {
          const productosInfo = productInfoArray.join(',\n');
          if (this.selectedFields.infoPedido) {
            row.splice(headers.indexOf('Info Pedido'), 0, productosInfo);
          }
          rows.push(row);
        });

        productNamesPromises.push(productInfoPromise);
      });

      // Esperar a que se completen las promesas y luego generar el PDF
      Promise.all(productNamesPromises).then(() => {
        this.loading = false; // Finaliza el estado de carga
        this.pdfReportService.generatePdf('Reporte de Pedidos', headers, rows, 'reporte_pedidos');
      }).catch(() => {
        this.loading = false; // Asegúrate de finalizar el estado de carga incluso si hay un error
      });
    });
  }



  seleccionarTodo(): void {
    if (!this.todo) {
      this.selectedFields = {
        pedidoId: true,
        fecha: true,
        estado: true,
        infoPedido: true,
        precioTotal: true,
        descripcion: true,
        cancelado: true,
        nombreUsuario: true
      };
    } else {
      this.selectedFields = {
        pedidoId: false,
        fecha: false,
        estado: false,
        infoPedido: false,
        precioTotal: false,
        descripcion: false,
        cancelado: false,
        nombreUsuario: false
      };
    }
  }
}
