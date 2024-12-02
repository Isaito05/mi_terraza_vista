import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { NavbarComponent } from '../../navbar/navbar.component';

import { UsuarioService } from 'src/app/features/usuario/service/usuario.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PedidoService } from 'src/app/features/pedido/service/pedido.service';

import { environment } from 'src/environments/environment';

import { jwtDecode } from 'jwt-decode';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { FacturaModalComponent } from '../../factura-modal/factura-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WebsocketService } from 'src/app/core/services/websocket.service';

declare var $: any;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ 
    ReactiveFormsModule, 
    RouterModule, 
    NavbarComponent, 
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent extends MatPaginatorIntl implements OnInit, AfterViewInit {
  private hoverListeners: Array<() => void> = [];  // Para almacenar los listeners de hover
  private paginator!: MatPaginator;
  private sort!: MatSort;
  editForm!: FormGroup;
  userId!: number;
  usuario: any = {}
  imangenPerfil: string = '';
  i_perfil: string = '';
  historialPedidos: any[] = [];
  hayNotificacion: boolean = false;

  displayedColumns: string[] = ['PED_ID', 'PED_MET_PAGO', 'PED_FECHA', 'PED_ESTADO', 'icono'];
  
  estadoPedidos = [
    { PED_ID: 127, PED_FECHA: new Date(), PED_ESTADO: 'Pendiente' },
    { PED_ID: 128, PED_FECHA: new Date(), PED_ESTADO: 'Completado' },
  ];
  
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if(mp != undefined) {
      this.paginator = mp
      this.setDataSourceAttributes();
    } 
  };
  @ViewChild(MatSort) set matSort(ms: MatSort){
    if(ms != undefined){
      this.sort = ms
      this.setDataSourceAttributes();
    }
  };
  dataSource!: MatTableDataSource<any>;

  override itemsPerPageLabel = 'Items por página'; // Cambiar "Items per page"
  override nextPageLabel = 'Siguiente página';     // Cambiar "Next page"
  override previousPageLabel = 'Página anterior'; // Cambiar "Previous page"
  override lastPageLabel = 'Última página'; 

  constructor(
    private renderer: Renderer2,
    private usuarioService:UsuarioService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private pedidoService: PedidoService, private cdref: ChangeDetectorRef,
    private webSocketService: WebsocketService
  ) {
    super()
   }

  setDataSourceAttributes() {    
    // this.dataSource = new MatTableDataSource( this.listOfApplications['data']);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;    
    this.paginator._intl.itemsPerPageLabel = "Por pagina"
    this.paginator._intl.firstPageLabel = "Primera pagina"
    this.paginator._intl.lastPageLabel = "Ultima pagina"
    this.paginator._intl.nextPageLabel = "Siguiente pagina"
    this.paginator._intl.previousPageLabel = "Pagina anterior"
    this.cdref.detectChanges();
  }

  openFactura(pedido: any): void {
    const dialogRef = this.dialog.open(FacturaModalComponent, {
        width: '400px', // Ajusta el tamaño del modal
        data: pedido, // Envía los datos del pedido al modal
        panelClass: 'scrollable-modal'
      });
      console.log(pedido)

    dialogRef.afterClosed().subscribe(result => {
        console.log('El modal se cerró:', result);
    });
}

  ngAfterViewInit(): void {
    // console.log('Paginator', this.dataSource.paginator);
    // this.dataSource.paginator = this.paginator;
    this.initializeScrollToTop(); // Inicializar el botón "back to top"
    this.initializeSpinner();

    // Iniciar el comportamiento del dropdown con el tamaño actual de la ventana
    this.initializeDropdownHover(window.innerWidth);
  }

  ngOnInit(): void {
    
    this.hayNotificacion = this.pedidoService.getEstadoNotificacion()
    this.pedidoService.notificacion$.subscribe((estado) => {
      this.hayNotificacion = estado;
    });
    const token = sessionStorage.getItem('token'); 
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.id;
      this.i_perfil = decodedToken.i_perfil;
    }
      this.usuarioService.getUsuarioById(this.userId).subscribe(
        (data) => {
          this.usuario = data;
          // console.log('Usuario obtenido:', this.usuario);
      
          // Inicializa el formulario con los valores del usuario (nombre y apellidos)
          this.editForm = this.fb.group({
            RGU_NOMBRES: [this.usuario?.RGU_NOMBRES || '', Validators.required],
            RGU_APELLIDOS: [this.usuario?.RGU_APELLIDOS || '', Validators.required],
            RGU_CORREO: [this.usuario?.RGU_CORREO || '', Validators.required],
            RGU_TELEFONO: [this.usuario?.RGU_TELEFONO || '', Validators.required],
            RGU_IDENTIFICACION: [this.usuario?.RGU_IDENTIFICACION || '', Validators.required],
            RGU_DIRECCION: [this.usuario?.RGU_DIRECCION || '', Validators.required],
            // RGU_GENERO: [this.usuario?.RGU_CORREO || '', Validators.required],
          });
          // console.log(this.editForm);
        },
        (error) => {
          console.error('Error al obtener los datos del usuario', error);
        }
      );      
    // }
    this.imangenPerfil = this.getImagenUsuario();
    this.usuarioService.$usuario.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        this.imangenPerfil = this.getImagenUsuario();
        console.log(this.imangenPerfil, ':imagen perfil después de la actualización');
      }
    });
    this.cargarPedidos(this.userId)
     // Escuchar eventos de WebSocket
     this.webSocketService.on('pedidoActualizado').subscribe((pedidoActualizado) => {
      console.log('Pedido actualizado recibido:', pedidoActualizado);

      // Actualizar la tabla al recibir el evento
      const index = this.historialPedidos.findIndex(
        (pedido) => pedido.PED_ID === pedidoActualizado.PED_ID
      );

      if (index !== -1) {
        this.historialPedidos[index] = pedidoActualizado; // Actualiza el pedido existente
      } else {
        this.historialPedidos.unshift(pedidoActualizado); // Agrega el pedido si es nuevo
      }

      // Refrescar el dataSource
      this.dataSource = new MatTableDataSource(this.historialPedidos);
      this.dataSource.paginator = this.paginator;
    });
  }

  cargarPedidos(id: number): void {
    this.pedidoService.getPedidoByUsuId(id).subscribe({
      next: (pedidos) => {
        this.historialPedidos = pedidos;
        console.log('Pedidos cargados:', pedidos);

        this.dataSource = new MatTableDataSource(pedidos);
        this.dataSource.paginator = this.paginator;

        // Solo cambiar notificación si no existe en localStorage
        if (!localStorage.getItem('hayNotificacion')) {
          this.hayNotificacion = pedidos.length > 0;
          localStorage.setItem('hayNotificacion', JSON.stringify(this.hayNotificacion));
        }
  
        this.pedidoService.actualizarPedidos(pedidos); // Notifica cambios globalmente
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
      },
    });
  }

  eliminarBadge(pedido: any) {
    this.pedidoService.eliminarBadgePedido(pedido.PED_ID).subscribe({
      next: () => {
        pedido.isNew = false;
      },
      error: (err) => {
        console.error('Error al actualizar el estado del pedido', err);
      },
    })
  }

  marcarPedidosRevisados(): void {
    // Marcar los pedidos como revisados
    localStorage.setItem('hayNotificacion', JSON.stringify(true));
    // Opcionalmente, realizar alguna acción adicional
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  onSubmit() {
    if (this.editForm.valid) {
      console.log(this.editForm," loos demons")
      const updatedData = {
        ...this.usuario,  // Mantener los demás datos del usuario
        RGU_NOMBRES: this.editForm.value.RGU_NOMBRES,
        RGU_APELLIDOS: this.editForm.value.RGU_APELLIDOS,
        RGU_CORREO: this.editForm.value.RGU_CORREO,
        RGU_TELEFONO: this.editForm.value.RGU_TELEFONO,
        RGU_IDENTIFICACION: this.editForm.value.RGU_IDENTIFICACION,
        RGU_DIRECCION: this.editForm.value.RGU_DIRECCION,
      };
      // console.log(updatedData," loos demons")
      // const dataToUpdate = { ...updatedData };
      // console.log(dataToUpdate)
      // delete dataToUpdate.RGU_PASSWORD; 
      // console.log(updatedData, 'se va a enviar')
      this.usuarioService.updateData(updatedData).subscribe(
        (response) => {
          console.log('Usuario actualizado con éxito:', response);
          // SweetAlert2 para mostrar un mensaje de éxito
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false, // Evita que se cierre al hacer clic fuera de la alerta
          }).then((result) => {
            if (result.isConfirmed) {
             // Cerrar cualquier modal activo
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
              const bootstrapModal = bootstrap.Modal.getInstance(modal);
              if (bootstrapModal) {
                bootstrapModal.hide();  // Cerrar cada modal activo
              }
            });
              // Recargar la página
              window.location.reload();
            }
          });
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          // Muestra una alerta de error si ocurre algo
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al actualizar el usuario.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      console.log('El formulario es inválido');
    }
  }

  getImagenUsuario(): string {
    // console.log(this.i_perfil)
    const imagen = this.usuario ? this.usuario.RGU_IMG_PROFILE: 'no hay imagen'
    // console.log(imagen)
    if (imagen !== undefined) {
      return `${environment.apiUrlHttp}${imagen}?t=${new Date().getTime()}`;
    }
    // console.log(`${environment.apiUrlHttp}${this.i_perfil}?t=${new Date().getTime()}`)
    return `${environment.apiUrlHttp}${this.i_perfil}?t=${new Date().getTime()}`; // Ruta de la imagen por defecto
  }

  // Detectar cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.initializeDropdownHover(event.target.innerWidth);
  }

  // Función para inicializar el spinner
  private initializeSpinner(): void {
    setTimeout(() => {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  }

  // Función para inicializar el botón "back to top"
  private initializeScrollToTop(): void {
    $(window).scroll(() => {
      // Usamos $(window) en lugar de $(this) para evitar problemas de contexto
      if ($(window).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
      } else {
        $('.back-to-top').fadeOut('slow');
      }
    });
  
    $('.back-to-top').click(function () {
      $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
      return false;
    });
  }

  // Método que se ejecuta cuando se cierra la sesión
  logOut() {
    // this.loading = true
    // document.body.style.overflow = 'hidde';
    setTimeout(() => {
      // this.loading = false
      // document.body.style.overflow = 'auto';
      this.authService.logout();
    },1000);
  }
  
  getSaludo(): string {
    const hora = new Date().getHours();
    // console.log(hora)
    if (hora < 12) {
      return '¡Buenos días';
    } else if (hora < 18) {
      return '¡Buenas tardes';
    } else {
      return '¡Buenas noches';
    }
  }
  
  // Dropdown hover functionality
  private initializeDropdownHover(windowWidth: number): void {
    const dropdowns = document.querySelectorAll('.dropdown');
    const showClass = 'show';

    // Limpiar los listeners anteriores para evitar duplicados
    this.cleanHoverListeners();

    if (windowWidth >= 992) {
      dropdowns.forEach(dropdown => {
        const mouseEnterListener = this.renderer.listen(dropdown, 'mouseenter', () => {
          this.renderer.addClass(dropdown, showClass);
          const toggle = dropdown.querySelector('.dropdown-toggle');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (toggle && menu) {
            this.renderer.setAttribute(toggle, 'aria-expanded', 'true');
            this.renderer.addClass(menu, showClass);
          }
        });

        const mouseLeaveListener = this.renderer.listen(dropdown, 'mouseleave', () => {
          this.renderer.removeClass(dropdown, showClass);
          const toggle = dropdown.querySelector('.dropdown-toggle');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (toggle && menu) {
            this.renderer.setAttribute(toggle, 'aria-expanded', 'false');
            this.renderer.removeClass(menu, showClass);
          }
        });

        // Almacenar los listeners para poder limpiarlos más tarde
        this.hoverListeners.push(mouseEnterListener, mouseLeaveListener);
      });
    }
  }

  // Limpiar los listeners de hover
  private cleanHoverListeners(): void {
    this.hoverListeners.forEach(unlisten => unlisten());  // Eliminar los listeners previos
    this.hoverListeners = [];  // Vaciar el array
  }
}
