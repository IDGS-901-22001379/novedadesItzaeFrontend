// src/modules/inventario_existencias/pages/inventario_existencias/form/inventarioExistenciasForm.utils.ts

import type { ExistenciaDetalle } from "../../../types/inventarioExistencias.types";
import type { FormState } from "./inventarioExistenciasForm.types";

export function buildInitialForm(item: ExistenciaDetalle | null): FormState {
  const existenciaActual = Number(item?.existencia ?? 0);

  return {
    tipo: "AJUSTE",
    motivo: "",
    referencia_tipo: "",
    referencia_id: "",
    modo_captura: "CAMBIO_FINAL",
    cantidad_movimiento: "",
    nueva_existencia: String(existenciaActual),
  };
}

export function getProductoNombre(item: ExistenciaDetalle | null) {
  if (!item) return "";
  return item.producto?.nombre ?? "Producto sin nombre";
}

export function getProductoSku(item: ExistenciaDetalle | null) {
  if (!item) return "";
  const row = item as ExistenciaDetalle & {
    producto?: { sku?: string | null };
    producto_sku?: string | null;
    sku?: string | null;
  };

  return row.producto?.sku ?? row.producto_sku ?? row.sku ?? "";
}

export function getProductoModelo(item: ExistenciaDetalle | null) {
  if (!item) return "";
  const row = item as ExistenciaDetalle & {
    producto?: { modelo?: string | null };
    producto_modelo?: string | null;
    modelo?: string | null;
  };

  return row.producto?.modelo ?? row.producto_modelo ?? row.modelo ?? "";
}

export function getProductoCodigoBarras(item: ExistenciaDetalle | null) {
  if (!item) return "";
  const row = item as ExistenciaDetalle & {
    producto?: { codigo_barras?: string | null };
    producto_codigo_barras?: string | null;
    codigo_barras?: string | null;
  };

  return (
    row.producto?.codigo_barras ??
    row.producto_codigo_barras ??
    row.codigo_barras ??
    ""
  );
}

export function getSucursalNombre(item: ExistenciaDetalle | null) {
  if (!item) return "";
  const row = item as ExistenciaDetalle & {
    ubicacion?: {
      sucursal_nombre?: string | null;
      id_sucursal?: number | null;
    };
    sucursal_nombre?: string | null;
  };

  return (
    row.ubicacion?.sucursal_nombre ??
    row.sucursal_nombre ??
    `Sucursal #${row.ubicacion?.id_sucursal ?? "-"}`
  );
}

export function getUbicacionNombre(item: ExistenciaDetalle | null) {
  if (!item) return "";
  return item.ubicacion?.nombre ?? "-";
}

export function getUbicacionTipo(item: ExistenciaDetalle | null) {
  if (!item) return "";
  return item.ubicacion?.tipo ?? "-";
}

export function toSafeNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export function getApiErrorMessage(error: unknown): string {
  const e = error as {
    response?: {
      data?: {
        detail?:
          | string
          | Array<{
              loc?: Array<string | number>;
              msg?: string;
              type?: string;
            }>;
      };
    };
    message?: string;
  };

  const detail = e?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item, index) => {
        const campo =
          Array.isArray(item.loc) && item.loc.length > 0
            ? String(item.loc[item.loc.length - 1])
            : String(index);

        return item.msg ? `${campo}: ${item.msg}` : null;
      })
      .filter(Boolean)
      .join(" | ");
  }

  if (e?.message) {
    return e.message;
  }

  return "Ocurrió un error al guardar el ajuste.";
}