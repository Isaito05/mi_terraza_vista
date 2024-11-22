export interface ProProv {
    PROPROV_ID: number
    PROPROV_CANTIDAD?: number;
    PROPROV_DESCRIPCION?: string;
    PROPROV_FCH_INGRESO?: Date;
    PROPROV_NOMBRE?: string;
    PROPROV_PRECIO_UNITARIO?: number;
    PROPROV_PROV_ID?: number;
    proveedor?: {
      PROV_NOMBRE?: string;
    };
  }