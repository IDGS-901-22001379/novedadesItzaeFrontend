// src/modules/inventario_ubicaciones/types/inventario_ubicaciones.types.ts

export type InventarioUbicacionTipo = "TIENDA" | "BODEGA";

export type InventarioUbicacion = {
  id_ubicacion: number;
  id_sucursal: number;
  tipo: InventarioUbicacionTipo;
  nombre: string;
  codigo: string;
  vendible: boolean;
  activo: boolean;
  creado_en?: string;
  actualizado_en?: string;
};

export type InventarioUbicacionCreate = {
  id_sucursal: number;
  tipo: InventarioUbicacionTipo;
  nombre: string;
  codigo: string;
  vendible: boolean;
};

export type InventarioUbicacionUpdate = {
  id_sucursal: number;
  tipo: InventarioUbicacionTipo;
  nombre: string;
  codigo: string;
  vendible: boolean;
};

export type InventarioUbicacionEstatusUpdate = {
  activo: boolean;
};

export type InventarioUbicacionesQuery = {
  id_sucursal?: number | null;
  solo_activos?: boolean;
};