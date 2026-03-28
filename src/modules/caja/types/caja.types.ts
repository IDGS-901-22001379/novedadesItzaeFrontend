// src/modules/caja/types/caja.types.ts
// Tipos del módulo de cajas.
// Define las interfaces principales para listado, creación, edición y cambio de activo.

export interface Caja {
  id_caja: number;
  id_sucursal: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  creado_en?: string;
  actualizado_en?: string;
}

export interface CajaCreate {
  id_sucursal: number;
  nombre: string;
  codigo: string;
}

export interface CajaUpdate {
  id_sucursal: number;
  nombre: string;
  codigo: string;
}

export interface CajaActivoUpdate {
  activo: boolean;
}

export interface CajasQuery {
  solo_activos?: boolean;
}

export interface CajasPorSucursalQuery {
  solo_activos?: boolean;
}

export interface SucursalOption {
  id_sucursal: number;
  nombre: string;
  activo: boolean;
}