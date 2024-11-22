export interface Bodega {
    BOD_ID: number;
    BOD_STOCK_MINIMO: number;
    BOD_ESTADO: string;
    BOD_PROPROV_ID: string;
    proprov: {
      PROPROV_CANTIDAD: number,
      PROPROV_DESCRIPCION: string;
      PROPROV_ESTADO: number;
      PROPROV_FCH_INGRESO: Date;
      PROPROV_ID: number
      PROPROV_NOMBRE: string;
      PROPROV_PRECIO_UNITARIO: number;
      PROPROV_PROV_ID: number;
    }
  }