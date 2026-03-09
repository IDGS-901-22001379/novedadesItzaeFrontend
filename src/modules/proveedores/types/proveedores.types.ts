// src/modules/proveedores/types/proveedores.types.ts

// =========================
// Catálogos / enums
// =========================

export type ProveedorTipo = "REGISTRADO" | "EXTERNO";
export type ProveedorEstatus = "ACTIVO" | "INACTIVO";

// =========================
// Proveedor
// =========================

export type Proveedor = {
  id_proveedor: number;
  tipo: ProveedorTipo;
  razon_social: string;
  nombre_contacto: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  condiciones_pago: string | null;
  notas: string | null;
  estatus: ProveedorEstatus;
  creado_en: string;
  actualizado_en: string;
};

// Respuesta corta para tabla/listado administrativo
export type ProveedorListItem = {
  id_proveedor: number;
  razon_social: string;
  tipo: ProveedorTipo;
  estatus: ProveedorEstatus;
  telefono: string | null;
  correo: string | null;
};

export type ProveedorCreate = {
  tipo: ProveedorTipo;
  razon_social: string;
  nombre_contacto: string;
  telefono: string;
  correo: string | null;
  direccion: string;
  condiciones_pago: string;
  notas: string;
};

export type ProveedorUpdate = {
  tipo: ProveedorTipo;
  razon_social: string;
  nombre_contacto: string;
  telefono: string;
  correo: string | null;
  direccion: string;
  condiciones_pago: string;
  notas: string;
};

export type ProveedorEstatusUpdate = {
  estatus: ProveedorEstatus;
};

export type ProveedoresListQuery = {
  solo_activos?: boolean;
};

export type ProveedoresBuscarQuery = {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
};

// =========================
// Relación proveedor-producto
// =========================

export type ProveedorProducto = {
  id_proveedor: number;
  id_producto: number;
  sku_proveedor: string | null;
  costo_referencia: number | null;
  activo: boolean;
  creado_en: string;
};

export type ProveedorProductoCreate = {
  id_producto: number;
  sku_proveedor: string;
  costo_referencia: number;
  activo: boolean;
};

export type ProveedorProductoUpdate = {
  sku_proveedor: string;
  costo_referencia: number;
  activo: boolean;
};

export type ProveedorProductosListQuery = {
  solo_activos?: boolean;
};