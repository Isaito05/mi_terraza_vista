export interface Factura {
    nombreUsuario: string;
    FACTURA_FECHA: Date;
    FACTURA_TOTAL: number;
    FACTURA_METODO_PAGO: string;
    FACTURA_ESTADO: string;
    FACTURA_DESCRIPCION: string;
    FACTURA_FCH_REGISTRO: Date;
    FACTURA_FECHA_CANCELACION: Date;
    FACTURA_CANCELADA: string;
  }