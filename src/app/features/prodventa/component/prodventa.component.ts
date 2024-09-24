import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ProdventaService } from '../services/prodventa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prodventa',
  templateUrl: './prodventa.component.html',
  styleUrls: ['./prodventa.component.css']
})

export class ProdventaComponent implements OnInit {
  prodventa: any[] = [];
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

  constructor(private http: HttpClient,private prodventaService: ProdventaService) { }

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
    this.http.get<any[]>('http://localhost:3000/prodventa').subscribe(data => {
      this.prodventa = data;
    })
  }


  openModal(user?: any) {
    console.log('Abrir modal con usuario:', user);
    this.isEditing = !!user; // Determina si estamos en modo de edición
    this.isViewingDetails = false;
    this.editingprodventa = user ? { ...user } : {}; // Llena el formulario con los datos del usuario o lo inicializa vacío
    this.isModalVisible = true;
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
    text: `Eliminarás al usuario: ${user.PROD_VENTA_NOMBRE}`,
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

}


