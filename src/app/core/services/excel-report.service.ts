import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelReportService {
  constructor() {}

  async generateExcel<T>(
    data: T[],
    columns: (keyof T | string)[], // Cambiado para incluir `string` como tipo
    fileName: string,
    keyMapping: { [key: string]: keyof T | string, }
    // selectedItems: any[] = [] // Acepta string para claves anidadas
  ) {
    console.log(data, 'esto es lo llega ');
    // const excelData = selectedItems.length > 0 ? selectedItems : data;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    // Definir encabezados y ancho dinámico de las columnas
    worksheet.columns = columns.map((col) => ({
      header: col.toString(),
      key: keyMapping[col as keyof typeof keyMapping] as string, // Conversión a string
      width: 20, // Valor inicial para el ancho de columna
    }));

    // Aplica filtro automático en los encabezados
    worksheet.autoFilter = {
      from: 'A1',
      to: `${String.fromCharCode(64 + columns.length)}1`, // Ajuste para rango dinámico basado en columnas
    };

    // Aplica estilos al encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Fijar la primera fila (encabezados) y la primera columna
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 1, // Fija la primera columna
        ySplit: 1, // Fija la primera fila
        topLeftCell: 'B2', // La celda visible en la esquina superior izquierda
        activeCell: 'B2', // La celda activa inicialmente
      },
    ];

    // Agregar datos y ajustar ancho dinámico
    console.log(data);
    data.forEach((item, index) => {
      const rowValues = columns.map((col) => {
        const mappingKey = keyMapping[col as keyof typeof keyMapping];

        if (typeof mappingKey === 'string' && mappingKey.includes('.')) {
          const keys = mappingKey.split('.');
          return keys.reduce((prev: any, key: string) => prev?.[key], item);
        }

        return item[mappingKey as keyof T];
      });

      console.log('Valores de fila a agregar:', rowValues); // Verifica qué valores se están agregando
      const row = worksheet.addRow(rowValues);

      // Aplicar color de fondo alterno
      if (index % 2 === 0) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFEF' }, // Color de fondo gris claro para filas pares
          };
        });
      }
    });

    // Ajustar ancho de cada columna automáticamente después de agregar los datos
    worksheet.columns.forEach((column) => {
      if (column && column.eachCell) {
        // Verificar que `column` y `eachCell` estén definidos
        let maxLength = 10; // Ancho mínimo en caso de datos vacíos

        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });

        column.width = maxLength + 2; // Añadir un margen de 2 para mayor legibilidad
      }
    });

    // Exportar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${fileName}.xlsx`);
  }
}
