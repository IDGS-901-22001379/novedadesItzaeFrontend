// src/modules/inventario_sucursales/types/inventario_sucursales.types.ts

export type InventarioSucursalListItem = {
  id_sucursal: number;
  codigo: string;
  nombre: string;
  activo: boolean;
};

export type InventarioSucursal = {
  id_sucursal: number;
  nombre: string;
  codigo: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
};

export type InventarioSucursalCreate = {
  nombre: string;
  codigo: string;
  telefono: string;
  direccion: string;
};

export type InventarioSucursalUpdate = {
  nombre: string;
  codigo: string;
  telefono: string;
  direccion: string;
};

export type InventarioSucursalEstatusUpdate = {
  activo: boolean;
};

export type InventarioSucursalesQuery = {
  solo_activos?: boolean;
};