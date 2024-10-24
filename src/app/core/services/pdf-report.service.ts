import { Injectable } from '@angular/core';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';

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
 async generatePdf(title: string, headers: string[], data: any[], filename: string) {
  const doc = new jsPDF();

  // Obtener el logo desde assets y convertirlo a base64
  const logoUrl = 'assets/images/logoTerraza.png';  // Ajusta la ruta si es necesario
  this.getBase64ImageFromURL(logoUrl).then(logoBase64 => {
    // Configuración del encabezado con detalles de la empresa
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Texto en negro
    doc.text('Nombre de la Empresa', 120, 15); // Posición del nombre
    doc.text('Dirección de la Empresa', 120, 20);
    doc.text('Correo: contacto@empresa.com', 120, 25);
    doc.text('Tel: +123 456 7890', 120, 30);
    
    // Agregar el logo con dimensiones correctas (manteniendo la proporción)
    const logoWidth = 20;
    const logoHeight = 20;
    doc.addImage(logoBase64, 'PNG', 25, 5, logoWidth, logoHeight); // Logo en el encabezado

    // Agregar un número de reporte debajo del título
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro
    doc.text(`Reporte de Pedidos`, 14, 30);
    doc.setFontSize(10);

    // Diseño de la tabla
    (doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 45, // Asegura que la tabla comience debajo del encabezado
      theme: 'grid',
      headStyles: {
        fillColor: [54, 162, 235], // Azul oscuro para encabezados
        textColor: 255,            // Blanco
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'           // Centramos el texto en los encabezados
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
        halign: 'center',          // Centramos los datos también
        valign: 'middle'           // Alineación vertical centrada
      },
      alternateRowStyles: {
        fillColor: [230, 230, 230], // Color gris claro para filas alternas
      },
      styles: {
        // lineWidth: 0.1,            // Bordes finos
        // lineColor: [0, 0, 0],      // Bordes en negro
      },
      columnStyles: {
        0: { halign: 'center' },   // Alineación centrada de la primera columna
        1: { halign: 'center' },   // Alineación centrada de la segunda columna
        2: { halign: 'center' },   // Alineación centrada de la tercera columna
        3: { halign: 'left' },     // Alineación a la izquierda para el campo "Info Pedido"
        4: { halign: 'right' }     // Alineación a la derecha para el precio
      }
    });

    // Guardar el PDF con el nombre proporcionado
    doc.save(`${filename}.pdf`);
  });
}


}
