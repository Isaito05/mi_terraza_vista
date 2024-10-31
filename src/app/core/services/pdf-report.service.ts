import { Injectable } from '@angular/core';
// import 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfReportService {

  constructor(private http: HttpClient) { }

  // Método para convertir la imagen a base64
  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
  }

  // Método genérico para generar PDF con cualquier tabla
  async generatePdf(title: string, headers: string[], data: any[], filename: string, selectedItems: any[] = []) {
    const doc = new jsPDF('landscape', 'pt', 'a4'); // orientación horizontal
    const pdfData = selectedItems.length > 0 ? selectedItems : data;
  
    // Opcional: Ordena los datos (por ejemplo, por nombre)
    pdfData.sort((a, b) => a[1].localeCompare(b[1]));
  
    const logoUrl = 'assets/images/logoTerraza.png';
    this.getBase64ImageFromURL(logoUrl).then(logoBase64 => {
      // Información de la empresa
      const companyInfo = [
        'Nombre de la Empresa',
        'Dirección de la Empresa',
        'Correo: contacto@empresa.com',
        'Tel: +123 456 7890'
      ];
  
      // Configuración de la posición
      let yPosition = 25;
  
      // Agregar logo
      const logoWidth = 50;
      const logoHeight = 50;
      doc.addImage(logoBase64, 'PNG', 25, 15, logoWidth, logoHeight);
  
      // Información de la empresa
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      companyInfo.forEach((info, index) => {
        doc.text(info, 100, yPosition + (index * 15));
      });
  
      // Título del reporte
      doc.setFontSize(14);
      doc.text(title, doc.internal.pageSize.getWidth() / 2, yPosition + 80, { align: 'center' });
      doc.setFontSize(10);
  
      // Diseño de la tabla
      autoTable(doc, {
        head: [headers],
        body: pdfData,
        startY: yPosition + 90, // Comienza debajo del encabezado
        theme: 'grid',
        headStyles: {
          fillColor: [54, 162, 235], // Color de fondo azul para el encabezado
          textColor: 255,             // Texto blanco
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          fontSize: 10,
          halign: 'center',
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [230, 230, 230], // Color de fondo gris claro para filas alternas
        },
        columnStyles: {
          0: { halign: 'left' },      // Alineación para columna "Task"
          1: { halign: 'center' },    // Alineación para columna "Status"
          2: { halign: 'center' },    // Alineación para columna "Timeline"
          3: { halign: 'center' },    // Alineación para "Planned effort"
          4: { halign: 'center' },    // Alineación para "Effort spent"
          5: { halign: 'center' },    // Alineación para "Completion date"
        }
      });
  
      // Agregar total de registros en la esquina inferior izquierda
      doc.text(`Total de registros: ${pdfData.length}`, 40, doc.internal.pageSize.getHeight() - 40);
  
      // Mover la fecha de generación a la esquina inferior derecha
      const date = new Date();
      const formattedDate = date.toLocaleString();
      doc.text(`Fecha de Generación: ${formattedDate}`, doc.internal.pageSize.getWidth() - 240, doc.internal.pageSize.getHeight() - 40);
  
      // Guardar el PDF
      doc.save(`${filename}.pdf`);
    });
  }
}