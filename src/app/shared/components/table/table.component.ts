import { HtmlParser } from '@angular/compiler';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { DatosService } from 'src/app/core/services/datos.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

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
  @Input() dataService: any;
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

  cbTrabajador: boolean = false;
  cbCliente: boolean = false;
  startDate: string | null = null;
  endDate: string | null = null;

  data_fecha: string = '';
  id: string = '';
  itemsSelected: any[] = [];
  selectedCount: number = 0;

  constructor( private compartirdatos: DatosService){}
  ngOnInit() {
    this.filteredData = [...this.data];
    // console.log(this.filteredData)
    // console.log(this.title)
    if (this.title === 'Modulo de Pagos') {
      this.data_fecha = 'PAGO_FECHA'
      this.id = 'PAGO_ID'
      // console.log(this.id);
    } else if (this.title === 'Modulo de Usuario') {
      this.data_fecha = 'RGU_FCH_REGISTRO'
      this.id = 'RGU_ID'
      // console.log(this.id);
    } else if (this.title === 'Modulo de Proprov') {
      this.data_fecha = 'PROPROV_FCH_INGRESO'
      // console.log(this.data_fecha);
    }
    else if (this.title === 'Modulo de Pedido') {
      this.data_fecha = 'PED_FECHA'
      this.id = 'PED_ID'
      // console.log(this.data_fecha);
    }
    else if (this.title === 'Modulo de Producto en venta') {
      // this.data_fecha = 'PED_FECHA'
      this.id = 'PROD_VENTA_ID'
      // console.log(this.data_fecha);
    }

    // Establecer la columna por defecto para ordenamiento, por ejemplo, la primera columna
    if (this.columns.length > 0) {
      this.sortColumn = this.columns[0].key;  // Ordenar por la primera columna
      this.sortData(this.sortColumn);  // Llamar al método de ordenamiento para aplicar la ordenación inicial
    }
  }

  getImageTooltip(item: any, key: string): string {
    const imageUrl = this.getImageUrl(this.getPropertyValue(item, key));
    return `<img src="${imageUrl}" width="110" height="95" />`;
  }

  updateFilter(event: any = null) {
    // Obtener el valor del input de búsqueda (si es un campo de texto)
    let val = '';
    if (event && event.target && event.target.type === 'text') {
      val = event.target.value.toLowerCase().trim(); // Solo procesar el valor si es un input de texto
    }

    // Variables para los filtros de checkbox
    const buscarTrabajador = this.cbTrabajador;
    const buscarCliente = this.cbCliente;

    const startDate = this.startDate ? new Date(this.startDate) : null;
    const endDate = this.endDate ? new Date(this.endDate) : null;

    console.log("Valor de búsqueda (input):", val);
    console.log("Estado cbTrabajador:", buscarTrabajador);
    console.log("Estado cbCliente:", buscarCliente);

    // Filtrado de datos
    this.filteredData = this.data.filter((item) => {
      const cumpleBusqueda = Object.values(item).some((field: any) => {
        return field && field.toString().toLowerCase().includes(val);
      });

      const esTrabajador = item.RGU_ROL ? item.RGU_ROL.toLowerCase() === 'trabajador' : false; // Asegúrate de que el campo `rol` sea el correcto
      const esCliente = item.RGU_ROL ? item.RGU_ROL.toLowerCase() === 'cliente' : false; // Asegúrate de que el campo `rol` sea el correcto

      // Verificar el filtro basado en checkboxes
      const cumpleCheckboxes =
        (buscarTrabajador && esTrabajador) ||
        (buscarCliente && esCliente) ||
        (!buscarTrabajador && !buscarCliente); // Sin checkbox marcado, mostrar todos

      const cumpleFecha = () => {
        if (!startDate && !endDate) return true; // Sin fechas seleccionadas
        
        const formatFecha = (fecha: Date) => {
          return fecha.toISOString().split('T')[0];
        }
        // const itemDate = new Date(item.PAGO_FECHA); // Ajusta 'fecha' al campo adecuado
        const itemDate = formatFecha(new Date(item[this.data_fecha])); // Ajusta 'fecha' al campo adecuado
        const startDateString = startDate ? formatFecha(startDate) : null;
        const endDateString = endDate ? formatFecha(endDate) : null;
        // Comparar fechas solo en formato 'YYYY-MM-DD'
        if (startDateString && endDateString) {
          // console.log("Comparando entre:", startDateString, "y", endDateString);
          return itemDate >= startDateString && itemDate <= endDateString;
        }
        if (startDateString) return itemDate >= startDateString;
        if (endDateString) return itemDate <= endDateString;

        return true;
      };
      console.log(cumpleFecha())
      // Retornar si cumple con la búsqueda y los checkboxes
      return cumpleBusqueda && cumpleCheckboxes && cumpleFecha();
    });

    console.log("Registros filtrados:", this.filteredData.length);
  }

  sortData(columnKey: string) {
    // console.log(columnKey)
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
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl, {
        html: true, // Permitir HTML en el tooltip
      });
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

  getImageUrl(imagePath: string): string {
    return `${environment.apiUrlHttp}${imagePath}`;
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  onPageChange(page: number) {
    this.p = page;
    // Reinicializar los tooltips después de cambiar de página
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl, {
          html: true, // Permitir HTML en el tooltip
        });
      });
    }, 0);
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = +event.target.value;
    this.p = 1; // Restablecer a la primera página cuando se cambie el número de ítems por página
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl, {
          html: true, // Permitir HTML en el tooltip
        });
      });
    }, 0);
  }

  formatDateForDatetimeLocal(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes en formato de dos dígitos
    const day = ('0' + date.getDate()).slice(-2); // Día en formato de dos dígitos

    // Convertir a formato de 12 horas
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
    hours = hours % 12;
    hours = hours ? hours : 12; // Si es 0, cambiar a 12

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }

  getFormattedDate(fieldId: any): string {
    const isoDate = this.data[fieldId] || fieldId; // Utilizar `fieldId` si `this.data[fieldId]` no está definido
    return isoDate ? this.formatDateForDatetimeLocal(isoDate) : '';
  }

  seleccionarTodos(checked: boolean ){
    // const checked = (event.target as HTMLInputElement).checked;
    // const selectedItemsAll = this.filteredData.forEach(item => item.selected = checked);
    const selectedItemsAll = this.filteredData.map(item => {
      item.selected = checked;
      return item;
    });
    this.compartirdatos.setSelectedItems(selectedItemsAll);
  }

  cmpPdf(){
    const selectedItems = this.filteredData.filter(item => item.selected);
    this.compartirdatos.setSelectedItems(selectedItems);
  }
  
  checkCambio(item: any, checked: boolean){
    // const checked = (event.target as HTMLInputElement).checked;
    // if(checked) {
    //   this.itemsSelected.push(item)
    // } else {
    //   this.itemsSelected = this.itemsSelected.filter(i => i !== item);
    // }
    // item.selected = (event.target as HTMLInputElement).checked;
    item.selected = checked
    const selectedItems = this.filteredData.filter(item => item.selected);
    this.compartirdatos.setSelectedItems(selectedItems);
    this.selectedCount = this.filteredData.filter((i: any) => i.selected).length;
  }

  eliminarSeleccionados() {
    const seleccionados = this.filteredData.filter(item => item.selected);
    const idsSeleccionados = seleccionados.map(item => item.RGU_ID);

    console.log(idsSeleccionados); // Esto mostrará un array con los IDs seleccionados
    console.log(seleccionados, 'Datos seleccionados')
    console.log(seleccionados.length, 'Numero de datos seleccionados')
    
    if (seleccionados.length === 0) {
      Swal.fire('No hay registros seleccionados', '', 'info');
      return;
    }
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminarán ${seleccionados.length} registros.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Itera sobre cada elemento seleccionado para eliminarlos uno por uno
        seleccionados.forEach(item => {
        const itemId = item[this.id];
          console.log(this.dataService, 'Servicio que se va a utilizar')
          console.log(item[this.id], 'Id de los datos seleccionados')
          this.dataService.deleteData(itemId).subscribe({
            next: () => {
              // Filtra los datos eliminados de la tabla
              this.filteredData = this.filteredData.filter(i => i[this.id] !== itemId);
            },
            error: (error: any) => {
              console.error('Error al eliminar el registro:', error);
            }
          });
        });

        Swal.fire('Eliminados', `${seleccionados.length} registros han sido eliminados.`, 'success');
      }
    });
  }
}
