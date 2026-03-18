export interface CompraListItem {
  id_compra: number;
  fecha: string;
  proveedor: string;
  id_ubicacion_destino: number;
  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
}

export interface Compra {
  id_compra: number;
  fecha: string;
  id_proveedor: number | null;
  proveedor_externo_nombre: string | null;
  proveedor_externo_contacto: string | null;
  proveedor_externo_telefono: string | null;
  proveedor_externo_descripcion: string | null;
  id_forma_pago: number;
  documento_referencia: string | null;
  observaciones: string | null;
  id_ubicacion_destino: number;
  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
  id_usuario_registra: number;
  creado_en: string;
  actualizado_en: string;
}

export interface CompraDetalle {
  id_producto: number;
  sku: string;
  nombre: string;
  cantidad: number;
  costo_unitario: number;
  descuento: number;
  impuestos: number;
  importe: number;
}

export interface ProveedorExternoPayload {
  proveedor_externo_nombre: string;
  proveedor_externo_contacto?: string | null;
  proveedor_externo_telefono?: string | null;
  proveedor_externo_descripcion?: string | null;
}

export interface CompraDetalleCreate {
  id_producto: number;
  cantidad: number;
  costo_unitario: number;
  descuento: number;
  impuestos: number;
  importe: number;
}

export interface CompraCreate {
  id_forma_pago: number;
  documento_referencia?: string | null;
  observaciones?: string | null;
  id_ubicacion_destino: number;
  id_proveedor?: number | null;
  proveedor_externo?: ProveedorExternoPayload | null;
  detalle: CompraDetalleCreate[];
}

export interface ComprasQuery {
  q?: string;
  id_proveedor?: number;
  id_ubicacion_destino?: number;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}