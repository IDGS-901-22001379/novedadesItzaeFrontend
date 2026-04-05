// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/useDevolucionesFormBusquedas.ts
// Hook de búsquedas del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Buscar ventas por folio en tiempo real.
// - Buscar productos en tiempo real.
// - Resolver selección inicial de venta y producto.
// - Mantener índice activo para navegación con teclado.

import { useEffect, useState } from "react";
import { devolucionesVentasService } from "../../../services/devoluciones_ventas.service";
import { devolucionesProductosService } from "../../../services/devoluciones_productos.service";
import type { DevolucionVentaOption } from "../../../types/devoluciones_ventas.types";
import type { DevolucionProductoOption } from "../../../types/devoluciones_productos.types";
import type { FormState } from "./devolucionesForm.types";

type Params = {
  form: FormState;
  setMsgError: React.Dispatch<React.SetStateAction<string>>;
};

export function useDevolucionesFormBusquedas({ form, setMsgError }: Params) {
  const [ventaQuery, setVentaQuery] = useState("");
  const [ventasLoading, setVentasLoading] = useState(false);
  const [ventasOptions, setVentasOptions] = useState<DevolucionVentaOption[]>(
    [],
  );
  const [ventaSeleccionada, setVentaSeleccionada] =
    useState<DevolucionVentaOption | null>(null);
  const [ventaOpen, setVentaOpen] = useState(false);
  const [ventaActiveIndex, setVentaActiveIndex] = useState(-1);

  const [productoQuery, setProductoQuery] = useState("");
  const [productosLoading, setProductosLoading] = useState(false);
  const [productosOptions, setProductosOptions] = useState<
    DevolucionProductoOption[]
  >([]);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<DevolucionProductoOption | null>(null);
  const [productoOpen, setProductoOpen] = useState(false);
  const [productoActiveIndex, setProductoActiveIndex] = useState(-1);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (form.id_venta) {
          const venta = await devolucionesVentasService.obtenerOpcion(
            Number(form.id_venta),
          );
          if (!mounted) return;

          setVentaSeleccionada(venta);
          setVentaQuery(venta.label || venta.folio || `Venta #${venta.id_venta}`);
          setVentasOptions((prev) =>
            prev.some((x) => x.id_venta === venta.id_venta)
              ? prev
              : [venta, ...prev],
          );
        } else {
          setVentaSeleccionada(null);
          setVentaQuery("");
        }

        if (form.detalle.id_producto) {
          const producto = await devolucionesProductosService.obtenerOpcion(
            Number(form.detalle.id_producto),
          );
          if (!mounted) return;

          setProductoSeleccionado(producto);
          setProductoQuery(producto.label);
          setProductosOptions((prev) =>
            prev.some((x) => x.id_producto === producto.id_producto)
              ? prev
              : [producto, ...prev],
          );
        } else {
          setProductoSeleccionado(null);
          setProductoQuery("");
        }
      } catch {
        // silencioso
      }
    })();

    return () => {
      mounted = false;
    };
  }, [form.id_venta, form.detalle.id_producto]);

  useEffect(() => {
    const q = ventaQuery.trim();

    if (!q || ventaSeleccionada?.label === q || ventaSeleccionada?.folio === q) {
      if (!q) {
        setVentasOptions([]);
        setVentaOpen(false);
        setVentaActiveIndex(-1);
      }
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setVentasLoading(true);
        setMsgError("");

        const resp = await devolucionesVentasService.buscar({
          q,
          limit: 10,
          offset: 0,
        });

        setVentasOptions(resp.items);
        setVentaOpen(true);
        setVentaActiveIndex(resp.items.length > 0 ? 0 : -1);
      } catch (e: unknown) {
        setMsgError(
          e instanceof Error
            ? e.message
            : "No se pudieron buscar las ventas.",
        );
      } finally {
        setVentasLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [ventaQuery, ventaSeleccionada, setMsgError]);

  useEffect(() => {
    const q = productoQuery.trim();

    if (!q || productoSeleccionado?.label === q) {
      if (!q) {
        setProductosOptions([]);
        setProductoOpen(false);
        setProductoActiveIndex(-1);
      }
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setProductosLoading(true);
        setMsgError("");

        const resp = await devolucionesProductosService.buscar({
          q,
          solo_activos: true,
          limit: 10,
          offset: 0,
        });

        setProductosOptions(resp);
        setProductoOpen(true);
        setProductoActiveIndex(resp.length > 0 ? 0 : -1);
      } catch (e: unknown) {
        setMsgError(
          e instanceof Error
            ? e.message
            : "No se pudieron buscar los productos.",
        );
      } finally {
        setProductosLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [productoQuery, productoSeleccionado, setMsgError]);

  function seleccionarVenta(item: DevolucionVentaOption | null) {
    setVentaSeleccionada(item);
    setVentaQuery(item?.label || item?.folio || "");
    setVentaOpen(false);
    setVentaActiveIndex(-1);
  }

  function seleccionarProducto(item: DevolucionProductoOption | null) {
    setProductoSeleccionado(item);
    setProductoQuery(item?.label ?? "");
    setProductoOpen(false);
    setProductoActiveIndex(-1);
  }

  return {
    ventaQuery,
    setVentaQuery,
    ventasLoading,
    ventasOptions,
    ventaSeleccionada,
    setVentaSeleccionada: seleccionarVenta,
    ventaOpen,
    setVentaOpen,
    ventaActiveIndex,
    setVentaActiveIndex,

    productoQuery,
    setProductoQuery,
    productosLoading,
    productosOptions,
    productoSeleccionado,
    setProductoSeleccionado: seleccionarProducto,
    productoOpen,
    setProductoOpen,
    productoActiveIndex,
    setProductoActiveIndex,
  };
}