export interface Pago {
    PAGO_ID: number;
    PAGO_FECHA: Date;
    PAGO_MONTO: number;
    PAGO_DESCRIPCION: string;
    rguUsuario: {
      RGU_ID: number;
      RGU_IDENTIFICACION: string;
      RGU_NOMBRES: string;
      RGU_APELLIDOS: string;
      RGU_GENERO: string;
    };
  }