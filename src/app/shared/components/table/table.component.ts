import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string, type?: any, format?: string }[] = [];
  @Input() noDataMessage: string = 'No hay datos disponibles.';
  @Input() title: string = '';
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() detail = new EventEmitter<any>();
  // Definir un arreglo de claves para truncar
  fieldsToTruncate: string[] = ['PROD_VENTA_DESCRIPCION', 'PAGO_DESCRIPCION', 'PROPROV_DESCRIPCION']; // Ajusta las claves según tus necesidades

  
  
  p: number = 1;

  formatCurrency(value: any): string {
    if (value == null) {
      return '';
    }
  
    if (typeof value === 'number') {
      return `$ ${value.toLocaleString('es-ES')}`;
    }
  
    // Convertir cadenas numéricas a número
    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
    if (!isNaN(numericValue)) {
      return `$ ${numericValue.toLocaleString('es-ES')}`;
    }
  
    // Si no es un número, devolver el valor como cadena
    return value.toString();
  }
  

  
  isModalVisible: boolean = false;

  ngAfterViewInit() {
    // Asegúrate de que los tooltips se inicialicen solo cuando el DOM esté completamente cargado
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  getTruncatedText(text: string, maxLength: number): string {
    if (!text) return ''; // Maneja casos donde el texto sea nulo o indefinido
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  

  onEdit(item: any) {
    console.log('Editar usuario:', item);
    this.edit.emit(item);
  }

  onDelete(item: any) {
    console.log('usuario a elimianr:', item);
    this.delete.emit(item);
  }

  onDetail(item: any) {
    console.log('usuario detalle:', item);
    this.detail.emit(item);
  }
  
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

 
  
  // Obtiene el valor de la propiedad de un objeto dinámicamente
  getPropertyValue(item: any, key: string): any {
    const value = key.split('.').reduce((object, property) => object ? object[property] : '', item);
    // console.log('Valor obtenido:', value);
    // Verifica si es una URL de imagen completa
    // if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
    //   return value; 
    // }

    // Retorna el valor original para otros casos
    return value;
  }
  
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  

}
