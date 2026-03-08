// src/modules/productos/components/productos/precios/productoPreciosModal.utils.ts

import type {
  PrecioProductoFormState,
  PresentacionPrecio,
} from "../../../types/productos.types";

export function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function buildInitialForm(): PrecioProductoFormState {
  return {
    id_tipo_cliente: "",
    presentacion: "UNIDAD",
    moneda: "MXN",
    precio: "",
    vigente_desde: todayISO(),
    vigente_hasta: "",
    activo: true,
  };
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const maybeAny = error as {
      response?: { data?: { detail?: unknown } };
      message?: unknown;
    };

    const detail = maybeAny.response?.data?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;

    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string } | undefined;
      if (first?.msg) return first.msg;
    }

    if (typeof maybeAny.message === "string" && maybeAny.message.trim()) {
      return maybeAny.message;
    }
  }

  return "Ocurrió un error al procesar la solicitud.";
}

export function moneyMXN(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function formatDateLabel(value: string | null) {
  if (!value) return "Sin fecha";
  return value;
}

export function estadoBadge(activo: boolean) {
  return activo
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-red-200 bg-red-50 text-red-700";
}

export function presentacionBadge(p: PresentacionPrecio) {
  return p === "CAJA"
    ? "border-blue-200 bg-blue-50 text-blue-700"
    : "border-violet-200 bg-violet-50 text-violet-700";
}