// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/facturacionCfdiForm.validators.ts
// Validaciones del formulario de facturación CFDI.
// Responsabilidades: validar emisión y envío de factura.

import type { Factura } from "../../../types/facturacion_cfdi.types";
import type { FacturacionCfdiFormState } from "./facturacionCfdiForm.types";

export function validarEmitir(form: FacturacionCfdiFormState): string {
  if (!form.id_venta.trim()) return "Te falta registrar la venta.";
  if (!form.id_cliente_fiscal.trim()) {
    return "Te falta seleccionar el cliente fiscal.";
  }
  if (!form.id_serie.trim()) return "Te falta seleccionar la serie.";

  if (Number.isNaN(Number(form.id_venta)) || Number(form.id_venta) <= 0) {
    return "La venta seleccionada no es válida.";
  }

  return "";
}

export function validarEnviar(
  form: FacturacionCfdiFormState,
  initialFactura: Factura | null,
): string {
  if (!initialFactura) return "No se encontró la factura a enviar.";
  if (!form.correo_destino.trim()) {
    return "Te falta registrar el correo destino.";
  }

  const correo = form.correo_destino.trim();
  const correoValido = /\S+@\S+\.\S+/.test(correo);
  if (!correoValido) return "El correo destino no es válido.";

  return "";
}