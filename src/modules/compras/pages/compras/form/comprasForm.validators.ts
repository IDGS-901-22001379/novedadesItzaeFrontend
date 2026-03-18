// src/modules/compras/pages/compras/form/comprasForm.validators.ts

import type { DetalleFormRow, FormState } from "./comprasForm.types";

export function validarCompra(
  form: FormState,
  detalles: DetalleFormRow[],
): string {
  if (!form.id_forma_pago || form.id_forma_pago <= 0) {
    return "Te falta seleccionar la forma de pago.";
  }

  if (!form.id_ubicacion_destino || Number(form.id_ubicacion_destino) <= 0) {
    return "Te falta seleccionar la ubicación destino.";
  }

  if (form.usarProveedorExterno) {
    if (!form.proveedor_externo_nombre.trim()) {
      return "Te falta registrar el nombre del proveedor externo.";
    }
  } else {
    if (!form.id_proveedor || Number(form.id_proveedor) <= 0) {
      return "Te falta seleccionar el proveedor.";
    }
  }

  if (!detalles.length) {
    return "Te falta agregar al menos un producto.";
  }

  for (let i = 0; i < detalles.length; i++) {
    const row = detalles[i];
    const n = i + 1;

    if (!row.id_producto || row.id_producto <= 0) {
      return `Te falta seleccionar el producto en la fila ${n}.`;
    }

    if (!row.producto_label.trim()) {
      return `Te falta el nombre del producto en la fila ${n}.`;
    }

    if (row.cantidad === "" || Number(row.cantidad) <= 0) {
      return `La cantidad debe ser mayor a 0 en la fila ${n}.`;
    }

    if (row.costo_unitario === "" || Number(row.costo_unitario) <= 0) {
      return `El costo unitario debe ser mayor a 0 en la fila ${n}.`;
    }

    if (row.descuento !== "" && Number(row.descuento) < 0) {
      return `El descuento no puede ser menor a 0 en la fila ${n}.`;
    }

    if (row.impuestos !== "" && Number(row.impuestos) < 0) {
      return `Los impuestos no pueden ser menores a 0 en la fila ${n}.`;
    }
  }

  return "";
}