import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string, type?: any }[] = [];
  @Input() noDataMessage: string = 'No hay datos disponibles.';
  @Input() title: string = '';
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  
  
  p: number = 1;
  
  isModalVisible: boolean = false;

  onEdit(item: any) {
    console.log('Editar usuario:', item);
    this.edit.emit(item);
  }

  onDelete(item: any) {
    console.log('usuario a elimianr:', item);
    this.delete.emit(item);
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
    
    // Verifica si es una URL de imagen completa
    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
      return value; 
    }

    // Retorna el valor original para otros casos
    return value;
  }
  
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  

}
