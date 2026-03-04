// src/modules/clientes_fiscales/types/usos_cfdi.types.ts

export type UsoCfdi = {
  id_uso_cfdi: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
};

export type UsoCfdiCreate = {
  codigo: string;
  descripcion: string;
  activo: boolean;
};

export type UsoCfdiUpdate = {
  codigo: string;
  descripcion: string;
  activo: boolean;
};

export type UsosCfdiQuery = {
  solo_activos?: boolean; // default true en swagger
};