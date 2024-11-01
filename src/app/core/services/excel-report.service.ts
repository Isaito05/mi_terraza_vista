import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface Pedido {
  PED_CANCELADO: boolean;
  PED_DESCRIPCION: string;
  PED_ESTADO: string;
  PED_ESTADOE: string;
  PED_FECHA: Date;
  PED_ID: number;
  PED_INFO: string; // Suponiendo que contiene ID y cantidad de productos
  PED_MET_PAGO: string;
  PED_NOTIFICACION: string;
  PED_PRECIO_TOTAL: number;
  PED_RGU_ID: number;
  rguUsuario: {
    RGU_ID: number;
    RGU_IDENTIFICACION: string;
    RGU_NOMBRES: string;
    RGU_APELLIDOS: string;
    RGU_GENERO: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ExcelReportService {
  constructor() {}

  async generateExcel<T extends { [key: string]: any }>(
    data: T[],
    columns: (keyof T | string)[],
    fileName: string,
    keyMapping: { [key: string]: keyof T | string },
    colorMapping?: { [key: string]: string }
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    // Definir la fila de título
    worksheet.mergeCells('A1:H1'); // Ajusta el rango según el número de columnas
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Reporte de pedido';
    titleCell.font = { bold: true, size: 22, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' },
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 33;

    // Definir encabezados
    const headerRow = worksheet.addRow(columns.map(col => col));

    // Aplica filtro automático en los encabezados
    worksheet.autoFilter = {
      from: 'A2',
      to: `${String.fromCharCode(64 + columns.length)}2`, // Asegúrate de que el número de columnas sea correcto
    };

    // Estilos del encabezado
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Fijar la primera fila y la primera columna
    worksheet.views = [
      {
        state: 'frozen',
        xSplit: 1,
        ySplit: 1,
        topLeftCell: 'B2',
        activeCell: 'B2',
      },
    ];

    // Agregar datos y ajustar ancho dinámico
    data.forEach((item, index) => {
      const rowValues = columns.map((col) => {
        const mappingKey = keyMapping[col as keyof typeof keyMapping];

        if (typeof mappingKey === 'string' && mappingKey.includes('.')) {
          const keys = mappingKey.split('.');
          return keys.reduce((prev: any, key: string) => prev?.[key], item);
        }

        // Formatear el precio total
        if (col === 'Precio Total') {
          return item[mappingKey as keyof T]
            ? parseFloat(item[mappingKey as keyof T]).toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP', // Moneda en pesos colombianos
                minimumFractionDigits: 0, // Para no mostrar decimales si no los necesitas
              })
            : '';
        }

        return item[mappingKey as keyof T];
      });

      const row = worksheet.addRow(rowValues);

      // Alinear la columna "Precio Total" a la derecha
      const precioTotalIndex = columns.indexOf('Precio Total') + 1; // +1 porque el índice de getCell es 1-based
      if (precioTotalIndex > 0) {
        row.getCell(precioTotalIndex).alignment = { horizontal: 'right' };
      }

      // Aplicar color de fondo alterno
      if (index % 2 === 0) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFEF' },
          };
        });
      }

      // Aplicar color según el estado
      if (colorMapping && item['PED_ESTADO']) { // Asegúrate de que 'PED_ESTADO' sea la clave correcta
        const estado = item['PED_ESTADO'];
        const color = colorMapping[estado];
        if (color) {
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber === columns.indexOf('Estado') + 1) { // +1 porque `addRow` es 1-indexed
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: color },
              };
            }
          });
        }
      }
    });

    // Ajustar ancho de cada columna automáticamente después de agregar los datos
    worksheet.columns.forEach((column) => {
      if (column && column.eachCell) {
        let maxLength = 10;

        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });

        column.width = maxLength + 2; 
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
