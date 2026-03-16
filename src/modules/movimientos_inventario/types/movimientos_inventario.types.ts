// src/modules/movimientos_inventario/types/movimientos_inventario.types.ts


export type MovimientoInventarioTipo =
  | "COMPRA"
  | "VENTA"
  | "AJUSTE"
  | "MERMA"
  | "DEVOLUCION"
  | "TRASPASO"
  | "OTRO"
  | (string & {});

export interface MovimientoInventarioDetalle {
  id_movimiento_detalle: number;
  id_movimiento: number;
  id_producto: number;
  cantidad: number;
  costo_unitario: number;
  precio_unitario: number;
  importe: number;
}

export interface MovimientoInventarioItem {
  id_movimiento: number;
  tipo: MovimientoInventarioTipo;
  fecha_hora: string;
  id_usuario: number | null;
  id_ubicacion_origen: number | null;
  id_ubicacion_destino: number | null;
  referencia_tipo: string | null;
  referencia_id: number | null;
}

export interface MovimientoInventario extends MovimientoInventarioItem {
  notas?: string | null;
  creado_en?: string;
  detalle?: MovimientoInventarioDetalle[];
}

export interface MovimientoInventarioCreateDetalle {
  id_producto: number;
  cantidad: number;
  costo_unitario?: number | null;
  precio_unitario?: number | null;
  importe?: number | null;
}

export interface MovimientoInventarioCreate {
  tipo: MovimientoInventarioTipo;
  id_ubicacion_origen?: number | null;
  id_ubicacion_destino?: number | null;
  referencia_tipo?: string | null;
  referencia_id?: number | null;
  notas?: string | null;

  // El backend acepta "detalle" y también "items" como alias,
  // aquí dejamos "detalle" como principal.
  detalle: MovimientoInventarioCreateDetalle[];
}

export interface MovimientoInventarioAgregarDetalle {
  id_producto: number;
  cantidad: number;
  costo_unitario?: number | null;
  precio_unitario?: number | null;
  importe?: number | null;
}

export interface MovimientosInventarioQuery {
  tipo?: MovimientoInventarioTipo;
  id_producto?: number;
  id_ubicacion?: number;
  id_usuario?: number;
  referencia_tipo?: string;
  referencia_id?: number;
  q?: string;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
  include_detalles?: boolean;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export type Movimientos_inventarioFiltersState = {
  q: string;
  tipo: "TODOS" | string;
  desde: string;
  hasta: string;
};