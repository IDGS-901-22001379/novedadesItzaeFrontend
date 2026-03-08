// src/modules/productos/types/proveedores.types.ts

export type ProveedorLite = {
  id_proveedor: number;
  razon_social: string;
  tipo: "REGISTRADO" | "EXTERNO";
  estatus: "ACTIVO" | "INACTIVO";
  telefono?: string | null;
  correo?: string | null;
};

export type Proveedor = ProveedorLite;

export type ProveedoresListQuery = {
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
};

export type ProveedoresBuscarQuery = {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
};

export type ProveedorProductoRelacion = {
  id_proveedor: number;
  id_producto: number;
  sku_proveedor: string | null;
  costo_referencia: number | null;
  activo: boolean;
  creado_en: string;
};