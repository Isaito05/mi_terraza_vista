import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { PagoService } from '../service/pago.service';


@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pagos: any[] = []; // Variable para almacenar la lista de pagos
  pagoSeleccionado: any; // Variable para almacenar el pago seleccionadso por ID
  idpago: number | null = null; // Inicializa idpago como null
  usuario: any[] = [];
  usuarioMap: { [key: number]: string } = {}; // Mapa para relacionar ID con nombre

  constructor(private pagoService: PagoService,private http: HttpClient) { }

  ngOnInit(): void {
    this.pagoService.getData().subscribe(data => {
      this.pagos = data; // Asigna los datos recibidos a la variable pagos
      console.log(this.pagos); // Muestra los datos en la consola para verificar
    });
  }

  // Actualiza el método para aceptar un parámetro ID
  buscarpagoPorId(id: number): void {
    this.pagoService.getPagoById(id).subscribe(data => {
      this.pagoSeleccionado = data; // Asigna el pago seleccionado
      console.log(this.pagoSeleccionado); // Muestra el pago en la consola para verificar
    });
  }

  // Método para manejar la edición de un pago
  editarpago(id: number): void {
    console.log(`Editar pago con ID: ${id}`);
    // Aquí puedes agregar la lógica para redirigir a una página de edición o abrir un formulario modal
    // Por ejemplo, si quieres redirigir a una página de edición:
    // this.router.navigate(['/editar-pago', id]);
  }

  isModalVisible: boolean = false;

  openModal() {
    this.isModalVisible = true;
  }

  handleClose() {
    this.isModalVisible = false;
  }

  handleConfirm() {
    console.log('Confirmed!');
    this.isModalVisible = false;
  }

  



}

