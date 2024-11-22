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