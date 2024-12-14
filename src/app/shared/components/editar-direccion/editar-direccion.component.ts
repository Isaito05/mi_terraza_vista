import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from "../../shared.module";

@Component({
  selector: 'app-editar-direccion',
  standalone: true,
  imports: [MatBottomSheetModule, MatButtonModule, FormsModule, MatInputModule, MatFormFieldModule, SharedModule],
  template: `
    <!-- <h2 class="text-center">Editar Dirección De Envio</h2> -->
    <!-- <p class="text-center mb-3 fw-t text-dark font-title" style="margin-bottom: 0 !important;">Edita o actualiza tu dirección aquí.</p>
    <div class="d-flex align-items-center justify-content-center">
      <hr class="flex-grow-1 me-2 text-dark" />
      <span class="text-dark font-title">●</span>
      <hr class="flex-grow-1 ms-2 text-dark" /> -->
    <!-- </div> -->
    <app-location (direccionEmitida)="actualizarDireccion($event)"></app-location>
    <div class="d-flex align-items-start flex-column position-relative mt-3">
      <input [(ngModel)]="direccion" type="text" id="email" name="email" aria-describedby="emailHelp"
        class="form-control p-ci" placeholder="Ingresa tu direccion.." >
      <i class="fa-solid fa-map-pin p-icon position-absolute"></i>
    </div>
    <small id="email" class="form-text font-title">La dirección solo se actualizará para el envío. Si deseas cambiarla permanentemente, dirígete a tu <a href="/profile">perfil</a>.</small>
    <div style="margin-top: 16px; text-align: right;">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()">Guardar</button>
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

  actualizarDireccion(nuevaDireccion: string) {
    this.direccion = nuevaDireccion; // Actualiza el campo de texto con la dirección recibida
  }
}
