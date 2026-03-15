// src/modules/inventario_existencias/pages/inventario_existencias/form/inventarioExistenciasForm.validators.ts

import type { ExistenciaDetalle } from "../../../types/inventarioExistencias.types";
import type { FormState } from "./inventarioExistenciasForm.types";

type ValidarParams = {
  item: ExistenciaDetalle | null;
  form: FormState;
  existenciaActual: number;
  cantidadMovimientoNum: number;
  nuevaExistenciaNum: number;
  deltaCalculado: number;
  nuevaExistenciaPreview: number;
};

export function validarInventarioExistenciasForm({
  item,
  form,
  existenciaActual,
  cantidadMovimientoNum,
  nuevaExistenciaNum,
  deltaCalculado,
  nuevaExistenciaPreview,
}: ValidarParams): string {
  if (!item) return "No se encontró la existencia a ajustar.";

  if (!Number.isFinite(Number(item.id_producto))) {
    return "No se encontró el producto a ajustar.";
  }

  if (!Number.isFinite(Number(item.id_ubicacion))) {
    return "No se encontró la ubicación a ajustar.";
  }

  if (!form.tipo) return "Te falta seleccionar el tipo de ajuste.";
  if (!form.motivo.trim()) return "Te falta registrar el motivo.";

  if (form.modo_captura === "CAMBIO_FINAL") {
    if (!form.nueva_existencia.trim()) {
      return "Te falta registrar la nueva existencia.";
    }

    if (!Number.isFinite(nuevaExistenciaNum)) {
      return "La nueva existencia no es válida.";
    }

    if (nuevaExistenciaNum < 0) {
      return "La nueva existencia no puede ser negativa.";
    }

    if (nuevaExistenciaNum === existenciaActual) {
      return "La nueva existencia debe ser diferente a la actual.";
    }
  }

  if (form.modo_captura === "MOVIMIENTO") {
    if (!form.cantidad_movimiento.trim()) {
      return "Te falta registrar la cantidad del movimiento.";
    }

    if (!Number.isFinite(cantidadMovimientoNum)) {
      return "La cantidad del movimiento no es válida.";
    }

    if (cantidadMovimientoNum <= 0) {
      return "La cantidad del movimiento debe ser mayor que cero.";
    }
  }

  if (!Number.isFinite(deltaCalculado)) {
    return "No se pudo calcular el ajuste.";
  }

  if (nuevaExistenciaPreview < 0) {
    return "La operación no puede dejar la existencia en negativo.";
  }

  if (
    form.referencia_id.trim() &&
    !Number.isFinite(Number(form.referencia_id.trim()))
  ) {
    return "La referencia ID no es válida.";
  }

  return "";
}