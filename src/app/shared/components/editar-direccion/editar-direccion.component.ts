import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-editar-direccion',
  standalone: true,
  imports: [MatBottomSheetModule, MatButtonModule, FormsModule, MatInputModule, MatFormFieldModule],
  template: `
    <h2>Editar Dirección</h2>
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Nueva dirección</mat-label>
      <input matInput [(ngModel)]="direccion">
    </mat-form-field>
    <div style="margin-top: 16px; text-align: right;">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="warning" (click)="guardar()">Guardar</button>
    </div>
  `,
  // templateUrl: './editar-direccion.component.html',
  styleUrl: './editar-direccion.component.css'
})
export class EditarDireccionComponent {
  direccion: string = '';

  constructor( 
    private bottomSheetRef: MatBottomSheetRef<EditarDireccionComponent>
  ) {}

  cancelar() {
    this.bottomSheetRef.dismiss(); // Cierra sin guardar
  }

  guardar() {
    this.bottomSheetRef.dismiss(this.direccion); // Devuelve la nueva dirección al cerrar
  }
}
