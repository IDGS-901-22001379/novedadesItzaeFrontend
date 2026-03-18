// src/modules/compras/pages/compras/form/comprasForm.types.ts

import type { Compra, CompraDetalle } from "../../../types/compras.types";

export type ComprasFormModo = "CREAR" | "VER";

export type ComprasFormProps = {
  modo: ComprasFormModo;
  initialCompra: Compra | null;
  initialDetalles: CompraDetalle[];
  onSuccess: () => void;
  onCancel: () => void;

  initialProveedorLabel?: string;
  initialUbicacionLabel?: string;
};

export type DetalleFormRow = {
  id: string;
  id_producto: number;
  producto_label: string;
  cantidad: number | "";
  costo_unitario: number | "";
  descuento: number | "";
  impuestos: number | "";
  importe: number | "";
};

export type FormState = {
  id_forma_pago: number;
  documento_referencia: string;
  observaciones: string;
  id_ubicacion_destino: number | "";
  id_proveedor: number | "";
  usarProveedorExterno: boolean;

  proveedor_externo_nombre: string;
  proveedor_externo_contacto: string;
  proveedor_externo_telefono: string;
  proveedor_externo_descripcion: string;
};

export type UbicacionDestinoOption = {
  id_ubicacion: number;
  label: string;
  id_sucursal?: number;
  sucursal_nombre?: string;
};

export type ProveedorBusquedaItem = {
  id_proveedor: number;
  label: string;
};

export type ProductoBusquedaItem = {
  id_producto: number;
  label: string;
  nombre: string;
  modelo?: string | null;
  codigo_barras?: string | null;
  costo_sugerido?: number | null;
};