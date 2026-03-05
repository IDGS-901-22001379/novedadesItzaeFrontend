// src/modules/clientes_tipos/types/clientes.types.ts

export type ClienteTipo = {
  id_tipo_cliente: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export type ClienteTipoCreate = {
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export type ClienteTipoUpdate = {
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export type ClientesTiposQuery = {
  solo_activos?: boolean;
};