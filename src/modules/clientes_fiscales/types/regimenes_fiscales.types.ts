// src/modules/clientes_fiscales/types/regimenes_fiscales.types.ts

export type RegimenFiscal = {
  id_regimen_fiscal: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
};

export type RegimenFiscalCreate = {
  codigo: string;
  descripcion: string;
  activo: boolean;
};

export type RegimenFiscalUpdate = {
  codigo: string;
  descripcion: string;
  activo: boolean;
};

export type RegimenesFiscalesQuery = {
  solo_activos?: boolean; // default true en swagger
};