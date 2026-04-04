// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/cancelacion/facturacionCfdiCancelarForm.validators.ts
// Validaciones del formulario de cancelación CFDI.
// Responsabilidades: validar datos mínimos antes de enviar la cancelación.

import type { Factura } from "../../../../types/facturacion_cfdi.types";
import type { FacturacionCfdiCancelarFormState } from "./facturacionCfdiCancelarForm.types";

export function validarCancelarFactura(
  form: FacturacionCfdiCancelarFormState,
  factura: Factura | null,
): string {
  if (!factura) return "No se encontró la factura a cancelar.";
  if (!form.id_factura.trim()) return "No se encontró el id de la factura.";
  if (!form.id_motivo_cancelacion_cfdi.trim()) {
    return "Te falta seleccionar el motivo de cancelación.";
  }
  if (!form.id_usuario.trim()) {
    return "No se encontró el usuario que realiza la cancelación.";
  }

  return "";
}