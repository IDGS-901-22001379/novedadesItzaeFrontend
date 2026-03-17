// src/modules/traspasos/types/traspasos.types.ts

export type TraspasoUbicacionTipo = "BODEGA" | "TIENDA" | string;

export interface TraspasoItemListado {
  id_movimiento: number;
  fecha_hora: string;

  id_usuario: number | null;
  username?: string | null;
  usuario_nombre?: string | null;
  usuario_rol?: string | null;

  id_ubicacion_origen: number;
  origen_tipo: TraspasoUbicacionTipo;
  origen_nombre: string;
  origen_codigo: string;
  origen_sucursal_nombre: string;

  id_ubicacion_destino: number;
  destino_tipo: TraspasoUbicacionTipo;
  destino_nombre: string;
  destino_codigo: string;
  destino_sucursal_nombre: string;

  notas: string | null;
}

export interface TraspasoDetalleItem {
  id_producto: number;
  cantidad: number;
}

export interface TraspasoDetalle {
  id_movimiento: number;
  tipo: string;
  fecha_hora: string;

  id_usuario: number | null;
  id_ubicacion_origen: number;
  id_ubicacion_destino: number;

  notas: string | null;
  items: TraspasoDetalleItem[];
}

export interface TraspasoCreateItem {
  id_producto: number;
  cantidad: number;
}

export interface TraspasoCreate {
  id_ubicacion_origen: number;
  id_ubicacion_destino: number;
  notas?: string | null;
  items: TraspasoCreateItem[];
}

export interface TraspasosQuery {
  desde?: string;
  hasta?: string;
  id_sucursal?: number;
  limit?: number;
  offset?: number;
}

export interface PagedTraspasos {
  items: TraspasoItemListado[];
  total: number;
  limit: number;
  offset: number;
}