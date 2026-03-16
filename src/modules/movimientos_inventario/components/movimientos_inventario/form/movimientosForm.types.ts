// src/modules/movimientos_inventario/pages/movimientos_inventario/form/movimientosForm.types.ts
// Tipos del formulario de Movimientos de Inventario.

import type { Dispatch, SetStateAction } from "react";
import type {
  MovimientoInventario,
  MovimientoInventarioDetalle,
} from "../../../types/movimientos_inventario.types";

export type Movimientos_inventarioFormModo = "CREAR" | "EDITAR" | "VER";

export type MovimientosFormProps = {
  modo: Movimientos_inventarioFormModo;
  initialMovimiento: MovimientoInventario | null;
  onSuccess: () => void;
  onCancel: () => void;
  usuariosMap: Record<number, string>;
  productosMap: Record<number, string>;
  ubicacionesMap: Record<number, string>;
};

export type UseMovimientosFormParams = {
  modo: Movimientos_inventarioFormModo;
  initialMovimiento: MovimientoInventario | null;
  onSuccess: () => void;
};

export type UseMovimientosFormResult = {
  subtitulo: string;
  movimiento: MovimientoInventario | null;
  detalle: MovimientoInventarioDetalle[];
  totalDetalle: string;

  openGeneral: boolean;
  setOpenGeneral: Dispatch<SetStateAction<boolean>>;

  openDetalle: boolean;
  setOpenDetalle: Dispatch<SetStateAction<boolean>>;
};