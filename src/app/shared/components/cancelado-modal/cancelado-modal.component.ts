import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancelado-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, CommonModule],
  templateUrl: './cancelado-modal.component.html',
  styleUrl: './cancelado-modal.component.css'
})
export class CanceladoModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CanceladoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  contactarSoporte() {
    // Acción para contactar al soporte
    console.log('Contactando soporte para el pedido', this.data.PED_ID);
  }

  explorarProductos() {
    this.dialogRef.close(); // Cierra el modal
    this.router.navigate(['/productos']); // Redirige a la página de productos
  }
  
}
