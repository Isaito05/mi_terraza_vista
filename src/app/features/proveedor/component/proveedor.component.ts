import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProveedorService } from '../service/proveedor.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  proveedor: any[] = [];

  constructor(private http: HttpClient, 
    private provService: ProveedorService
    ) { }

  ngOnInit(): void {
    this.provService.getdata().subscribe(data => {
      this.proveedor = data; // Asigna los datos recibidos a la variable pagos
      console.log(this.proveedor); // Muestra los datos en la consola para verificar
    });
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
