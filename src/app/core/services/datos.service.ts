import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private ItemsSeleccionados: any[] = [];
  setSelectedItems(items: any[]) {
    console.log('Elementos almacenados en SharedDataService:', this.ItemsSeleccionados); // Log para verificar almacenamiento
    this.ItemsSeleccionados = items;
  }

  getSelectedItems() {
    return this.ItemsSeleccionados;
  }
}
