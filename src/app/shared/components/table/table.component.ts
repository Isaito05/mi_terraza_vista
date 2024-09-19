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
  itemsPerPage: number = 5; // Número de ítems por página
  itemsPerPageOptions: number[] = [5, 10, 15, 20];
  isModalVisible: boolean = false;
  filteredData: any[] = [...this.data];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.filteredData = [...this.data];

    // Establecer la columna por defecto para ordenamiento, por ejemplo, la primera columna
    if (this.columns.length > 0) {
      this.sortColumn = this.columns[0].key;  // Ordenar por la primera columna
      this.sortData(this.sortColumn);  // Llamar al método de ordenamiento para aplicar la ordenación inicial
    }
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase(); // Obtener el valor del input
    this.filteredData = this.data.filter((item) => {
      // const nombre = item.RGU_NOMBRES ? item.RGU_NOMBRES.toString().toLowerCase() : '';
      // const iden = item.RGU_IDENTIFICACION ? item.RGU_IDENTIFICACION.toString().toLowerCase() : '';
      // const match = nombre.includes(val) || iden.includes(val);
      // return match;
      return Object.values(item).some((field: any) => 
        field.toString().toLowerCase().includes(val) // Verificar si algún valor del objeto incluye el término de búsqueda
      );
    });
  }

  sortData(columnKey: string) {
    console.log(columnKey)
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn = columnKey;
    this.filteredData.sort((a, b) => {
      const valueA = this.getPropertyValue(a, columnKey);
      const valueB = this.getPropertyValue(b, columnKey);

      if (columnKey === 'RGU_IDENTIFICACION') { // Ajusta 'ID' al nombre correcto del campo de identificación
        // Ordenar numéricamente
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (columnKey === 'RGU_NOMBRES') { // Ajusta 'NAME' al nombre correcto del campo de nombre
        // Ordenar alfabéticamente
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      } else {
        // No ordenar otros campos
        return 0;
      }
    });
  }

  ngOnChanges() {
    // Asegurarse de que los datos filtrados se actualicen cuando cambie el input `data`
    this.filteredData = [...this.data];
  }

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
    return value;
  }
  
  isArray(value: any): boolean {
    return Array.isArray(value);
  } 

  onPageChange(page: number) {
    this.p = page;
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = +event.target.value;
    this.p = 1; // Restablecer a la primera página cuando se cambie el número de ítems por página
  }
}
