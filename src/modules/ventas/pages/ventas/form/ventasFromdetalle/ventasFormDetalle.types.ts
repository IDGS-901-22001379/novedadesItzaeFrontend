// src/modules/ventas/pages/ventas/form/ventasFromdetalle/ventasFormDetalle.types.ts

import type { VentaDetalleForm } from "../ventasForm.types";
import type { VentaProductoOption } from "../../../../types";

export type VentasFormDetallesProps = {
  detalles: VentaDetalleForm[];
  readOnly: boolean;

  productoQuery: string;
  setProductoQuery: React.Dispatch<React.SetStateAction<string>>;
  productosEncontrados: VentaProductoOption[];
  loadingProductos: boolean;
  onSelectProducto: (producto: VentaProductoOption) => void;

  onUpdateDetalle: (index: number, patch: Partial<VentaDetalleForm>) => void;
  onEliminarDetalle: (index: number) => void;

  calcDetalleImporte: (detalle: VentaDetalleForm) => number;

  productosInfoMap: Map<number, VentaProductoOption>;
};

export type ModalCajaState = {
  open: boolean;
  detalleIndex: number | null;
};

export type ModalPreciosState = {
  open: boolean;
  detalleIndex: number | null;
};

export type ModalBuscadorState = {
  open: boolean;
};

export type EditableField =
  | "presentacion"
  | "cantidad"
  | "descuento"
  | "iva_tasa";