// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/facturacionCfdiForm.utils.ts
// Utilidades del formulario de facturación CFDI.
// Responsabilidades: construir estado inicial y helpers de formato.

import type { Factura } from "../../../types/facturacion_cfdi.types";
import type {
  FacturacionCfdiFormModo,
  FacturacionCfdiFormState,
} from "./facturacionCfdiForm.types";

export function buildInitialForm(
  modo: FacturacionCfdiFormModo,
  factura: Factura | null,
): FacturacionCfdiFormState {
  if ((modo === "ENVIAR" || modo === "VER") && factura) {
    return {
      id_venta: String(factura.id_venta ?? ""),
      venta_label: factura.id_venta ? `Venta #${factura.id_venta}` : "",

      id_cliente_fiscal: String(factura.id_cliente_fiscal ?? ""),
      cliente_fiscal_label: "",

      id_sucursal: factura.id_sucursal ? String(factura.id_sucursal) : "",
      id_serie: String(factura.id_serie ?? ""),

      correo_destino: "",
    };
  }

  return {
    id_venta: "",
    venta_label: "",

    id_cliente_fiscal: "",
    cliente_fiscal_label: "",

    id_sucursal: "",
    id_serie: "",

    correo_destino: "",
  };
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  return value.replace("T", " ");
}

export function buildSubtitle(
  modo: FacturacionCfdiFormModo,
  factura: Factura | null,
): string {
  if (modo === "EMITIR") return "Emitir nueva factura CFDI";
  if (modo === "ENVIAR") {
    return `Enviar factura: ${factura?.serie ?? ""}${factura?.folio ?? ""}`;
  }
  return `Visualizar factura: ${factura?.serie ?? ""}${factura?.folio ?? ""}`;
}