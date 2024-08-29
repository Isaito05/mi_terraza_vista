import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string }[] = [];
  @Input() noDataMessage: string = 'No hay datos disponibles.';
  @Input() title: string = '';

  getPropertyValue(item: any, key: string): any {
    const value = key.split('.').reduce((object, property) => object ? object[property] : '', item);
    return value;
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  p: number = 1;
}
