// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/devolucionesForm.helpers.ts
// Helpers del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Construir estado inicial.
// - Convertir valores numéricos.
// - Formatear fecha y dinero.

import type { DevolucionDetail } from "../../../types/devoluciones_cancelaciones.types";
import type {
  Devoluciones_cancelacionesFormModo,
  FormState,
} from "./devolucionesForm.types";

export function buildInitialForm(
  modo: Devoluciones_cancelacionesFormModo,
  d: DevolucionDetail | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && d) {
    return {
      id_venta: String(d.id_venta ?? ""),
      tipo: d.tipo ?? "TOTAL",
      motivo: d.motivo ?? "",
      id_forma_pago_reembolso: String(d.id_forma_pago_reembolso ?? ""),
      genera_nota_credito_interna: Boolean(d.genera_nota_credito_interna),
      disposicion: d.disposicion ?? "REGRESA_TIENDA",
      id_ubicacion_destino: String(d.id_ubicacion_destino ?? ""),
      importe_devuelto: String(d.importe_devuelto ?? ""),
      detalle: {
        id_producto: "",
        cantidad_devuelta: "",
        precio_unitario: "",
        importe: "",
      },
    };
  }

  return {
    id_venta: "",
    tipo: "TOTAL",
    motivo: "",
    id_forma_pago_reembolso: "",
    genera_nota_credito_interna: false,
    disposicion: "REGRESA_TIENDA",
    id_ubicacion_destino: "",
    importe_devuelto: "",
    detalle: {
      id_producto: "",
      cantidad_devuelta: "",
      precio_unitario: "",
      importe: "",
    },
  };
}

export function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatFechaHora(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatMoney(value?: number | string): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number.isFinite(n) ? n : 0);
}