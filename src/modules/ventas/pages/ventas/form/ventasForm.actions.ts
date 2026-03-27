// src/modules/ventas/pages/ventas/form/ventasForm.actions.ts
// Acciones puras del formulario de ventas.
// Responsabilidades:
// - Manipular detalles.
// - Manipular pagos.
// - Activar o limpiar facturación.
// - Recalcular importe del detalle cuando cambian sus valores base.

import type {
  VentaDetalleForm,
  VentaFormState,
  VentaPagoForm,
} from "./ventasForm.types";

function calcImporteDetalle(detalle: VentaDetalleForm): number {
  const cantidad = Number(detalle.cantidad || 0);
  const precioUnitario = Number(detalle.precio_unitario || 0);
  const descuento = Number(detalle.descuento || 0);
  const impuestos = Number(detalle.impuestos || 0);

  const importeBase = cantidad * precioUnitario - descuento + impuestos;
  return Number((importeBase > 0 ? importeBase : 0).toFixed(2));
}

export function createEmptyDetalle(): VentaDetalleForm {
  return {
    id_producto: null,
    producto_label: "",
    presentacion: "UNIDAD",
    unidades_por_caja: 1,
    cantidad: 1,
    precio_unitario: 0,
    descuento: 0,
    iva_tasa: 0,
    impuestos: 0,
    importe: 0,
  };
}

export function createEmptyPago(): VentaPagoForm {
  return {
    id_forma_pago: null,
    forma_pago_label: "",
    monto: 0,
    referencia: "",
  };
}

export function patchDetalle(
  form: VentaFormState,
  index: number,
  patch: Partial<VentaDetalleForm>,
): VentaFormState {
  return {
    ...form,
    detalles: form.detalles.map((item, i) => {
      if (i !== index) return item;

      const nextDetalle: VentaDetalleForm = {
        ...item,
        ...patch,
      };

      return {
        ...nextDetalle,
        importe: calcImporteDetalle(nextDetalle),
      };
    }),
  };
}

export function appendDetalle(form: VentaFormState): VentaFormState {
  return {
    ...form,
    detalles: [...form.detalles, createEmptyDetalle()],
  };
}

export function removeDetalle(
  form: VentaFormState,
  index: number,
): VentaFormState {
  return {
    ...form,
    detalles:
      form.detalles.length <= 1
        ? form.detalles
        : form.detalles.filter((_, i) => i !== index),
  };
}

export function patchPago(
  form: VentaFormState,
  index: number,
  patch: Partial<VentaPagoForm>,
): VentaFormState {
  return {
    ...form,
    pagos: form.pagos.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    ),
  };
}

export function appendPago(form: VentaFormState): VentaFormState {
  return {
    ...form,
    pagos: [...form.pagos, createEmptyPago()],
  };
}

export function removePago(
  form: VentaFormState,
  index: number,
): VentaFormState {
  return {
    ...form,
    pagos:
      form.pagos.length <= 1
        ? form.pagos
        : form.pagos.filter((_, i) => i !== index),
  };
}

// Activa o limpia completamente la parte fiscal.
export function setFacturacionState(
  form: VentaFormState,
  checked: boolean,
): VentaFormState {
  return {
    ...form,
    marcada_para_facturar: checked,
    mostrar_datos_factura: checked,
    ...(checked
      ? {}
      : {
          id_cliente_fiscal: null,
          cliente_fiscal_label: "",
          id_forma_pago_principal: null,
          forma_pago_principal_label: "",
          id_metodo_pago_cfdi: null,
          metodo_cfdi_label: "",
        }),
  };
}