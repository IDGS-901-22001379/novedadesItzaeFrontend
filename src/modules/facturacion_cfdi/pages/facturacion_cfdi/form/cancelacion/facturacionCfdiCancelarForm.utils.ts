// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/cancelacion/facturacionCfdiCancelarForm.utils.ts
// Utilidades del formulario de cancelación CFDI.
// Responsabilidades: construir estado inicial y helpers simples del formulario.

import type { Factura } from "../../../../types/facturacion_cfdi.types";
import type { FacturacionCfdiCancelarFormState } from "./facturacionCfdiCancelarForm.types";

export function buildInitialCancelarForm(
  factura: Factura | null,
  idUsuario: number | string,
): FacturacionCfdiCancelarFormState {
  return {
    id_factura: factura ? String(factura.id_factura) : "",
    id_motivo_cancelacion_cfdi: "",
    uuid_sustitucion: factura?.uuid ?? "",
    id_usuario: String(idUsuario ?? ""),
  };
}

export function buildCancelarSubtitle(factura: Factura | null): string {
  if (!factura) return "Cancelar factura CFDI";

  return `Cancelar factura: ${factura.serie ?? ""}${factura.folio ?? ""}`;
}