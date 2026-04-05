// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/devolucionesForm.validation.ts
// Validaciones del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Validar creación.
// - Validar edición.

import { getCurrentUserId } from "../../../services/authSession.service";
import type { DevolucionDetail } from "../../../types/devoluciones_cancelaciones.types";
import type { FormState } from "./devolucionesForm.types";

export function validarCrear(form: FormState): string {
  if (!form.id_venta.trim()) return "Te falta seleccionar la venta por folio.";
  if (!form.tipo) return "Te falta seleccionar el tipo de devolución.";
  if (!form.motivo.trim()) return "Te falta registrar el motivo.";
  if (!form.id_forma_pago_reembolso.trim()) {
    return "Te falta seleccionar la forma de pago de reembolso.";
  }
  if (!form.disposicion.trim()) return "Te falta seleccionar la disposición.";
  if (!form.id_ubicacion_destino.trim()) {
    return "Te falta seleccionar la ubicación destino.";
  }
  if (!form.importe_devuelto.trim()) {
    return "Te falta registrar el importe devuelto.";
  }
  if (!form.detalle.id_producto.trim()) return "Te falta seleccionar el producto.";
  if (!form.detalle.cantidad_devuelta.trim()) {
    return "Te falta registrar la cantidad devuelta.";
  }
  if (!form.detalle.precio_unitario.trim()) {
    return "Te falta registrar el precio unitario.";
  }
  if (!form.detalle.importe.trim()) {
    return "Te falta registrar el importe del detalle.";
  }
  if (!getCurrentUserId()) {
    return "No se encontró el usuario de la sesión actual.";
  }

  return "";
}

export function validarEditar(
  form: FormState,
  initialDevolucion: DevolucionDetail | null,
): string {
  if (!form.motivo.trim()) return "Te falta registrar el motivo.";
  if (!initialDevolucion) return "No se encontró la devolución a editar.";
  return "";
}