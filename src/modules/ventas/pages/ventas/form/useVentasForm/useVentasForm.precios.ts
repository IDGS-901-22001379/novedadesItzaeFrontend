// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.precios.ts

import type { MutableRefObject } from "react";
import type { VentaDetalleForm, VentaFormState } from "../ventasForm.types";
import type { VentaProductoBusquedaItem } from "./useVentasForm.productos";
import {
  resolvePrecioDetalleAsync,
  recalculatePrecioPorTipoClienteEnDetalles,
} from "./useVentasForm.productos";
import { ventasProductosPreciosService } from "../../../../services/ventasProductosPrecios.service";

export function buildDetalleImporte(
  detalle: Pick<
    VentaDetalleForm,
    "cantidad" | "precio_unitario" | "descuento" | "impuestos"
  >,
): number {
  const cantidad = Number(detalle.cantidad || 0);
  const precio = Number(detalle.precio_unitario || 0);
  const descuento = Number(detalle.descuento || 0);
  const impuestos = Number(detalle.impuestos || 0);

  const importeBase = cantidad * precio - descuento + impuestos;
  return Number((importeBase > 0 ? importeBase : 0).toFixed(2));
}

export async function resolverYAplicarPrecioReal(params: {
  index: number;
  producto: VentaProductoBusquedaItem;
  presentacion: VentaDetalleForm["presentacion"];
  id_tipo_cliente?: number | null;
  tipoClienteLabel?: string | null;
  setForm: React.Dispatch<React.SetStateAction<VentaFormState>>;
  patchDetalle: (
    form: VentaFormState,
    index: number,
    patch: Partial<VentaDetalleForm>,
  ) => VentaFormState;
}): Promise<void> {
  const {
    index,
    producto,
    presentacion,
    id_tipo_cliente,
    tipoClienteLabel,
    setForm,
    patchDetalle,
  } = params;

  const precioReal = await resolvePrecioDetalleAsync({
    producto,
    id_tipo_cliente,
    tipoClienteLabel,
    presentacion,
    resolverPrecioVenta: ventasProductosPreciosService.resolverPrecioVenta,
  });

  setForm((prev) => {
    const detalleActual = prev.detalles[index];
    if (!detalleActual) return prev;
    if (detalleActual.id_producto !== producto.id_producto) return prev;

    const detalleActualizado: VentaDetalleForm = {
      ...detalleActual,
      presentacion,
      precio_unitario: precioReal,
      importe: buildDetalleImporte({
        cantidad: detalleActual.cantidad,
        precio_unitario: precioReal,
        descuento: detalleActual.descuento,
        impuestos: detalleActual.impuestos,
      }),
    };

    return patchDetalle(prev, index, detalleActualizado);
  });
}

export async function sincronizarPreciosPorTipoCliente(params: {
  form: VentaFormState;
  readOnly: boolean;
  productosMapRef: MutableRefObject<Map<number, VentaProductoBusquedaItem>>;
}): Promise<VentaFormState["detalles"]> {
  const { form, readOnly, productosMapRef } = params;

  if (readOnly) return form.detalles;

  const detallesBase = recalculatePrecioPorTipoClienteEnDetalles(
    form.detalles,
    productosMapRef.current,
    form.tipo_cliente_label,
  );

  const detallesActualizados: VentaDetalleForm[] = await Promise.all(
    detallesBase.map(async (detalle): Promise<VentaDetalleForm> => {
      if (!detalle.id_producto) return detalle;

      const producto = productosMapRef.current.get(detalle.id_producto);
      if (!producto) return detalle;

      const presentacion: VentaDetalleForm["presentacion"] =
        detalle.presentacion === "CAJA" && producto.permite_venta_por_caja
          ? "CAJA"
          : "UNIDAD";

      const precioReal = await resolvePrecioDetalleAsync({
        producto,
        id_tipo_cliente: form.id_tipo_cliente,
        tipoClienteLabel: form.tipo_cliente_label,
        presentacion,
        resolverPrecioVenta: ventasProductosPreciosService.resolverPrecioVenta,
      });

      const detalleActualizado: VentaDetalleForm = {
        ...detalle,
        presentacion,
        precio_unitario: precioReal,
        unidades_por_caja:
          Number(producto.unidades_por_caja ?? 0) > 0
            ? Number(producto.unidades_por_caja)
            : detalle.unidades_por_caja || 1,
        importe: buildDetalleImporte({
          cantidad: detalle.cantidad,
          precio_unitario: precioReal,
          descuento: detalle.descuento,
          impuestos: detalle.impuestos,
        }),
      };

      return detalleActualizado;
    }),
  );

  return detallesActualizados;
}