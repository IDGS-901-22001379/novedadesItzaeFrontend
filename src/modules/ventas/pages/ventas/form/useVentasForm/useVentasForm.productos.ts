// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.productos.ts
// Lógica auxiliar para búsqueda y selección de productos en ventas.
// Responsabilidades:
// - Buscar productos desde el hook principal.
// - Resolver el precio según tipo de cliente.
// - Resolver el precio por presentación UNIDAD / CAJA.
// - Agregar el producto al primer renglón vacío o crear uno nuevo.
// - Recalcular precios cuando cambie el tipo de cliente.
// - Permitir resolver precio real usando service externo de precios.
// - Tomar el IVA del producto cuando aplique facturación.
// Nota:
// - La búsqueda ligera /productos/buscar no siempre regresa el campo facturable.
// - Por eso no se filtra aquí por facturación.
// - La validación real del producto facturable se hace al seleccionar el producto,
//   cuando ya se consulta el detalle completo del producto por ID.

import type { Dispatch, SetStateAction } from "react";
import type { VentaPresentacion, VentaProductoOption } from "../../../../types";
import type { VentaFormState } from "../ventasForm.types";

export type VentaProductoBusquedaItem = VentaProductoOption;

type SearchProductosParams = {
  readOnly: boolean;
  productoQuery: string;
  marcadaParaFacturar?: boolean;
  setLoadingProductos: (value: boolean) => void;
  setProductosEncontrados: (value: VentaProductoBusquedaItem[]) => void;
  buscarProductos: (params: {
    q: string;
    limit?: number;
    offset?: number;
  }) => Promise<VentaProductoBusquedaItem[]>;
};

type SelectProductoParams = {
  producto: VentaProductoBusquedaItem;
  tipoClienteLabel?: string | null;
  marcadaParaFacturar?: boolean;
  setForm: Dispatch<SetStateAction<VentaFormState>>;
};

export type ResolverPrecioVentaFn = (params: {
  producto: VentaProductoBusquedaItem;
  id_tipo_cliente?: number | null;
  presentacion: VentaPresentacion;
}) => Promise<number>;

export type ResolvePrecioDetalleAsyncParams = {
  producto: VentaProductoBusquedaItem;
  id_tipo_cliente?: number | null;
  tipoClienteLabel?: string | null;
  presentacion: VentaPresentacion;
  resolverPrecioVenta?: ResolverPrecioVentaFn;
};

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function toMoney(value?: number | null): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) && n > 0 ? Number(n.toFixed(2)) : 0;
}

function toPositiveInt(value?: number | null, fallback = 1): number {
  const n = Number(value ?? fallback);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : fallback;
}

function isProductoFacturable(producto: VentaProductoBusquedaItem): boolean {
  return Boolean(producto.facturable ?? producto.es_facturable ?? false);
}

function resolveProductoIvaTasa(producto: VentaProductoBusquedaItem): number {
  const ivaTasa = toMoney(producto.iva_tasa);
  if (ivaTasa > 0) return ivaTasa;

  const iva = toMoney(producto.iva);
  if (iva > 0) return iva;

  return 0;
}

export function buildVentaProductoLabel(
  producto: VentaProductoBusquedaItem,
): string {
  if (producto.producto_label?.trim()) {
    return producto.producto_label.trim();
  }

  if (producto.nombre?.trim()) {
    return producto.nombre.trim();
  }

  return `Producto #${producto.id_producto}`;
}

export function resolvePrecioProductoPorTipoCliente(
  producto: VentaProductoBusquedaItem,
  tipoClienteLabel?: string | null,
): number {
  const tipo = normalizeText(tipoClienteLabel);

  const precioVenta = toMoney(producto.precio_venta);
  const precioMayoreo = toMoney(producto.precio_mayoreo);
  const precioEspecial = toMoney(producto.precio_especial);
  const precioDescuento = toMoney(producto.precio_descuento);

  if (tipo.includes("mayoreo")) {
    return precioMayoreo || precioVenta || 0;
  }

  if (tipo.includes("especial")) {
    return precioEspecial || precioVenta || 0;
  }

  if (tipo.includes("descuento")) {
    return precioDescuento || precioVenta || 0;
  }

  return precioVenta || precioMayoreo || precioEspecial || precioDescuento || 0;
}

export function resolvePrecioProductoInicial(
  producto: VentaProductoBusquedaItem,
  tipoClienteLabel?: string | null,
  presentacion: VentaPresentacion = "UNIDAD",
): number {
  const precioBase = resolvePrecioProductoPorTipoCliente(
    producto,
    tipoClienteLabel,
  );

  if (presentacion === "CAJA") {
    const precioCaja = toMoney(producto.precio_caja);
    if (precioCaja > 0) return Number(precioCaja.toFixed(2));

    const unidadesPorCaja = toPositiveInt(producto.unidades_por_caja, 1);
    return Number((precioBase * unidadesPorCaja).toFixed(2));
  }

  return Number(precioBase.toFixed(2));
}

export async function resolvePrecioDetalleAsync({
  producto,
  id_tipo_cliente,
  tipoClienteLabel,
  presentacion,
  resolverPrecioVenta,
}: ResolvePrecioDetalleAsyncParams): Promise<number> {
  if (resolverPrecioVenta) {
    try {
      const precio = await resolverPrecioVenta({
        producto,
        id_tipo_cliente,
        presentacion,
      });

      const precioNormalizado = toMoney(precio);
      if (precioNormalizado > 0) return precioNormalizado;
    } catch {
      // Si falla el service externo, cae al fallback local.
    }
  }

  return resolvePrecioProductoInicial(producto, tipoClienteLabel, presentacion);
}

export async function searchVentasProductos({
  readOnly,
  productoQuery,
  marcadaParaFacturar,
  setLoadingProductos,
  setProductosEncontrados,
  buscarProductos,
}: SearchProductosParams): Promise<void> {
  if (readOnly) return;

  const q = productoQuery.trim();

  if (!q) {
    setProductosEncontrados([]);
    setLoadingProductos(false);
    return;
  }

  setLoadingProductos(true);

  try {
    const items = await buscarProductos({
      q,
      limit: 10,
      offset: 0,
    });

    const productos = Array.isArray(items) ? items : [];

    // Nota importante:
    // No se filtra aquí por facturación porque /productos/buscar
    // puede no incluir el campo facturable en la respuesta ligera.
    // La validación real se hace al seleccionar el producto,
    // cuando se consulta el detalle completo por ID.
    void marcadaParaFacturar;

    setProductosEncontrados(productos);
  } catch {
    setProductosEncontrados([]);
  } finally {
    setLoadingProductos(false);
  }
}

export function selectVentasProducto({
  producto,
  tipoClienteLabel,
  marcadaParaFacturar,
  setForm,
}: SelectProductoParams): void {
  if (marcadaParaFacturar && !isProductoFacturable(producto)) {
    return;
  }

  const precioInicial = resolvePrecioProductoInicial(
    producto,
    tipoClienteLabel,
    "UNIDAD",
  );

  const productoLabel = buildVentaProductoLabel(producto);
  const unidadesPorCaja = toPositiveInt(producto.unidades_por_caja, 1);
  const ivaTasa = resolveProductoIvaTasa(producto);

  setForm((prev) => {
    const firstEmptyIndex = prev.detalles.findIndex(
      (d) => !d.id_producto || !d.producto_label.trim(),
    );

    const nextDetalle = {
      id_producto: producto.id_producto,
      producto_label: productoLabel,
      presentacion: "UNIDAD" as const,
      unidades_por_caja: unidadesPorCaja,
      cantidad: 1,
      precio_unitario: precioInicial,
      descuento: 0,
      iva_tasa: ivaTasa,
      impuestos: 0,
      importe: precioInicial,
    };

    if (firstEmptyIndex >= 0) {
      return {
        ...prev,
        detalles: prev.detalles.map((detalle, index) =>
          index === firstEmptyIndex ? nextDetalle : detalle,
        ),
      };
    }

    return {
      ...prev,
      detalles: [...prev.detalles, nextDetalle],
    };
  });
}

export function recalculatePrecioPorTipoClienteEnDetalles(
  detalles: VentaFormState["detalles"],
  productosMap: Map<number, VentaProductoBusquedaItem>,
  tipoClienteLabel?: string | null,
): VentaFormState["detalles"] {
  return detalles.map((detalle) => {
    if (!detalle.id_producto) return detalle;

    const producto = productosMap.get(detalle.id_producto);
    if (!producto) return detalle;

    const presentacion =
      detalle.presentacion === "CAJA" && producto.permite_venta_por_caja
        ? "CAJA"
        : "UNIDAD";

    const precioUnitario = resolvePrecioProductoInicial(
      producto,
      tipoClienteLabel,
      presentacion,
    );

    const unidadesPorCaja = toPositiveInt(
      producto.unidades_por_caja,
      detalle.unidades_por_caja || 1,
    );

    const cantidad = Number(detalle.cantidad || 0);
    const descuento = Number(detalle.descuento || 0);
    const impuestos = Number(detalle.impuestos || 0);
    const ivaTasa = resolveProductoIvaTasa(producto);
    const importeBase = cantidad * precioUnitario - descuento + impuestos;

    return {
      ...detalle,
      presentacion,
      precio_unitario: precioUnitario,
      unidades_por_caja: unidadesPorCaja,
      iva_tasa: ivaTasa,
      importe: Number((importeBase > 0 ? importeBase : 0).toFixed(2)),
    };
  });
}

export function recalculateDetalleByPresentacion(
  detalle: VentaFormState["detalles"][number],
  producto: VentaProductoBusquedaItem,
  tipoClienteLabel?: string | null,
): VentaFormState["detalles"][number] {
  const presentacion =
    detalle.presentacion === "CAJA" && producto.permite_venta_por_caja
      ? "CAJA"
      : "UNIDAD";

  const precioUnitario = resolvePrecioProductoInicial(
    producto,
    tipoClienteLabel,
    presentacion,
  );

  const unidadesPorCaja = toPositiveInt(
    producto.unidades_por_caja,
    detalle.unidades_por_caja || 1,
  );

  const cantidad = Number(detalle.cantidad || 0);
  const descuento = Number(detalle.descuento || 0);
  const impuestos = Number(detalle.impuestos || 0);
  const ivaTasa = resolveProductoIvaTasa(producto);
  const importeBase = cantidad * precioUnitario - descuento + impuestos;

  return {
    ...detalle,
    presentacion,
    precio_unitario: precioUnitario,
    unidades_por_caja: unidadesPorCaja,
    iva_tasa: ivaTasa,
    importe: Number((importeBase > 0 ? importeBase : 0).toFixed(2)),
  };
}