// src/modules/ventas/pages/ventas/form/ventasForm.validators.ts
// Validaciones del formulario de ventas.
// Responsabilidades:
// - Validar datos mínimos para registrar una venta.
// - Exigir datos fiscales solo cuando la venta se marca para facturar.
// - Mantener la lógica de validación fuera del hook principal.

import type { VentaFormState } from "./ventasForm.types";

type ValidarVentaParams = {
  form: VentaFormState;
  total: number;
  montoPagado: number;
};

export function validarVenta({
  form,
  total,
  montoPagado,
}: ValidarVentaParams): string {
  // Cliente obligatorio.
  if (!form.id_cliente || form.id_cliente <= 0) {
    return "Te falta seleccionar el cliente.";
  }

  // Vendedor obligatorio.
  if (!form.id_usuario_vendedor || form.id_usuario_vendedor <= 0) {
    return "Te falta registrar el vendedor.";
  }

  // La venta debe estar ligada a una apertura activa.
  if (!form.id_apertura || form.id_apertura <= 0) {
    return "Te falta registrar la apertura.";
  }

  // Debe existir al menos un producto.
  if (!Array.isArray(form.detalles) || form.detalles.length === 0) {
    return "Te falta agregar al menos un producto.";
  }

  const detalleInvalido = form.detalles.find(
    (d) =>
      !d.id_producto ||
      d.id_producto <= 0 ||
      Number(d.cantidad) <= 0 ||
      Number(d.precio_unitario) <= 0,
  );

  if (detalleInvalido) {
    return "Revisa los productos de la venta. Hay datos incompletos.";
  }

  // Debe existir al menos una forma de pago.
  if (!Array.isArray(form.pagos) || form.pagos.length === 0) {
    return "Te falta agregar al menos una forma de pago.";
  }

  const pagoInvalido = form.pagos.find(
    (p) => !p.id_forma_pago || p.id_forma_pago <= 0 || Number(p.monto) <= 0,
  );

  if (pagoInvalido) {
    return "Revisa los pagos. Hay datos incompletos.";
  }

  // El monto pagado debe cubrir el total.
  if (Number(montoPagado) < Number(total)) {
    return "El monto pagado no cubre el total de la venta.";
  }

  // Validaciones fiscales solo si se marcó para facturar.
  if (form.marcada_para_facturar) {
    if (!form.id_cliente_fiscal || form.id_cliente_fiscal <= 0) {
      return "Te falta seleccionar el cliente fiscal para facturar.";
    }

    if (!form.id_forma_pago_principal || form.id_forma_pago_principal <= 0) {
      return "Te falta seleccionar la forma de pago principal para facturar.";
    }

    if (!form.id_metodo_pago_cfdi || form.id_metodo_pago_cfdi <= 0) {
      return "Te falta seleccionar el método CFDI para facturar.";
    }
  }

  return "";
}