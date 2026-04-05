// src/modules/devoluciones_cancelaciones/types/devoluciones_cancelaciones.types.ts
// Tipos del módulo de devoluciones/cancelaciones.
// Responsabilidades:
// - Definir contratos tipados para devoluciones y devoluciones detalle.
// - Definir payloads de creación y actualización.
// - Definir filtros de consulta para listados y widgets.

export type DevolucionTipo = "TOTAL" | "PARCIAL" | "CANCELACION";

export type DevolucionDisposicion =
  | "REGRESA_TIENDA"
  | "ENVIA_BODEGA"
  | "MERMA"
  | string;

export type DevolucionEstatus =
  | "PENDIENTE"
  | "APLICADA"
  | "ANULADA"
  | string;

export interface Devolucion {
  id_devolucion: number;
  fecha_hora: string;
  tipo: DevolucionTipo;
  importe_devuelto: number;
  id_venta: number;

  estatus?: DevolucionEstatus;

  venta_folio?: string | null;
  folio_venta?: string | null;
  numero_venta?: string | null;
}

export interface DevolucionDetail {
  id_devolucion: number;
  id_venta: number;
  fecha_hora: string;
  tipo: DevolucionTipo;
  motivo: string;
  id_forma_pago_reembolso: number;
  importe_devuelto: number;
  genera_nota_credito_interna: boolean;
  disposicion: DevolucionDisposicion;
  id_ubicacion_destino: number;
  id_usuario: number;
  creado_en: string;

  estatus?: DevolucionEstatus;

  venta_folio?: string | null;
  folio_venta?: string | null;
  numero_venta?: string | null;
}

export interface DevolucionDetalle {
  id_devolucion_detalle: number;
  id_producto: number;
  cantidad_devuelta: number;
  importe: number;
}

export interface DevolucionDetalleDetail {
  id_devolucion_detalle: number;
  id_devolucion: number;
  id_producto: number;
  cantidad_devuelta: number;
  precio_unitario: number;
  importe: number;
}

export interface DevolucionCrearDetalle {
  id_producto: number;
  cantidad_devuelta: number;
  precio_unitario: number;
  importe: number;
  id_devolucion?: number;
}

export interface DevolucionCreate {
  id_venta: number;
  tipo: DevolucionTipo;
  motivo: string;
  id_forma_pago_reembolso: number;
  genera_nota_credito_interna: boolean;
  disposicion: DevolucionDisposicion;
  id_ubicacion_destino: number;
  importe_devuelto: number;
  id_usuario: number;
  detalles: DevolucionCrearDetalle[];
}

export interface DevolucionMotivoUpdate {
  motivo: string;
}

export interface DevolucionEstatusUpdate {
  estatus: DevolucionEstatus;
}

export interface DevolucionesQuery {
  q?: string;
  id_cliente?: number;
  id_venta?: number;
  tipo?: DevolucionTipo | string;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
}

export interface DevolucionesUltimasQuery {
  limit?: number;
}

export interface DevolucionesDetalleQuery {
  id_devolucion: number;
  limit?: number;
  offset?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}