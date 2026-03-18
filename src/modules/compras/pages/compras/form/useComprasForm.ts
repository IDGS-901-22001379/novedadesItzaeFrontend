// src/modules/compras/pages/compras/form/useComprasForm.ts

import { useEffect, useMemo, useState } from "react";
import type {
  CompraCreate,
  CompraDetalleCreate,
  ProveedorExternoPayload,
} from "../../../types/compras.types";
import { comprasService } from "../../../services/compras.service";
import type {
  ComprasFormProps,
  DetalleFormRow,
  ProductoBusquedaItem,
  ProveedorBusquedaItem,
  UbicacionDestinoOption,
} from "./comprasForm.types";
import {
  buildInitialDetalles,
  buildInitialForm,
  makeRow,
  toNumber,
} from "./comprasForm.utils";
import { validarCompra } from "./comprasForm.validators";

export function useComprasForm(props: ComprasFormProps) {
  const readOnly = props.modo === "VER";

  const [form, setForm] = useState(() =>
    buildInitialForm(props.modo, props.initialCompra),
  );

  const [detalles, setDetalles] = useState<DetalleFormRow[]>(() =>
    buildInitialDetalles(props.modo, props.initialDetalles),
  );

  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const [ubicacionesDestino, setUbicacionesDestino] = useState<
    UbicacionDestinoOption[]
  >([]);

  const [proveedoresEncontrados, setProveedoresEncontrados] = useState<
    ProveedorBusquedaItem[]
  >([]);

  const [productosEncontrados, setProductosEncontrados] = useState<
    ProductoBusquedaItem[]
  >([]);

  const [loadingUbicaciones, setLoadingUbicaciones] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [proveedorQuery, setProveedorQuery] = useState("");
  const [productoQuery, setProductoQuery] = useState("");

  const subtitulo = useMemo(() => {
    if (props.modo === "CREAR") return "Registrar compra";
    return `Visualizar compra #${props.initialCompra?.id_compra ?? ""}`;
  }, [props.modo, props.initialCompra]);

  const resumen = useMemo(() => {
    const subtotal = detalles.reduce((acc, row) => {
      const cantidad = toNumber(row.cantidad);
      const costo = toNumber(row.costo_unitario);
      return acc + cantidad * costo;
    }, 0);

    const descuentoTotal = detalles.reduce(
      (acc, row) => acc + toNumber(row.descuento),
      0,
    );

    const impuestosTotal = detalles.reduce(
      (acc, row) => acc + toNumber(row.impuestos),
      0,
    );

    const total = subtotal - descuentoTotal + impuestosTotal;

    return {
      subtotal,
      descuentoTotal,
      impuestosTotal,
      total,
    };
  }, [detalles]);

  useEffect(() => {
    if (readOnly) return;

    let cancelled = false;

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          setLoadingUbicaciones(true);

          const sucursalesActivas =
            await comprasService.listarSucursalesActivas();

          if (cancelled) return;

          const ubicacionesPorSucursal = await Promise.all(
            sucursalesActivas.map((sucursal) =>
              comprasService.listarUbicacionesActivasPorSucursal(
                sucursal.id_sucursal,
              ),
            ),
          );

          if (cancelled) return;

          const merged = ubicacionesPorSucursal.flat();

          const uniqueMap = new Map<number, UbicacionDestinoOption>();
          for (const item of merged) {
            uniqueMap.set(item.id_ubicacion, item);
          }

          setUbicacionesDestino(Array.from(uniqueMap.values()));
        } catch (e) {
          if (cancelled) return;

          const msg =
            e instanceof Error
              ? e.message
              : "No se pudieron cargar las ubicaciones activas.";
          setMsgError(msg);
        } finally {
          if (!cancelled) setLoadingUbicaciones(false);
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [readOnly]);

  useEffect(() => {
    if (readOnly) return;

    const query = proveedorQuery.trim();

    if (form.id_proveedor && query) {
      setProveedoresEncontrados([]);
      setLoadingProveedores(false);
      return;
    }

    if (!query) {
      setProveedoresEncontrados([]);
      setLoadingProveedores(false);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          setLoadingProveedores(true);

          const data = await comprasService.buscarProveedoresActivos({
            q: query,
            limit: 10,
            offset: 0,
          });

          if (cancelled) return;

          const mapped: ProveedorBusquedaItem[] = data.map((item) => ({
            id_proveedor: item.id_proveedor,
            label: item.label,
          }));

          setProveedoresEncontrados(mapped);
        } catch {
          if (cancelled) return;
          setProveedoresEncontrados([]);
        } finally {
          if (!cancelled) setLoadingProveedores(false);
        }
      })();
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [proveedorQuery, readOnly, form.id_proveedor]);

  useEffect(() => {
    if (readOnly) return;

    const query = productoQuery.trim();

    if (!query) {
      setProductosEncontrados([]);
      setLoadingProductos(false);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          setLoadingProductos(true);

          const data = await comprasService.buscarProductos({
            q: query,
            limit: 10,
            offset: 0,
          });

          if (cancelled) return;

          const mapped: ProductoBusquedaItem[] = data.map((item) => ({
            id_producto: item.id_producto,
            label: item.label,
            nombre: item.nombre,
            modelo: item.modelo ?? null,
            codigo_barras: item.codigo_barras ?? null,
            costo_sugerido: item.costo_sugerido ?? 1,
          }));

          setProductosEncontrados(mapped);
        } catch {
          if (cancelled) return;
          setProductosEncontrados([]);
        } finally {
          if (!cancelled) setLoadingProductos(false);
        }
      })();
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [productoQuery, readOnly]);

  function updateDetalle(rowId: string, patch: Partial<DetalleFormRow>) {
    setDetalles((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;

        const next = { ...row, ...patch };

        const cantidad = toNumber(next.cantidad);
        const costoUnitario = toNumber(next.costo_unitario);
        const descuento = toNumber(next.descuento);
        const impuestos = toNumber(next.impuestos);

        const importeBase = cantidad * costoUnitario - descuento + impuestos;
        next.importe = importeBase >= 0 ? Number(importeBase.toFixed(2)) : 0;

        return next;
      }),
    );
  }

  function agregarRenglon() {
    setDetalles((prev) => [...prev, makeRow()]);
  }

  function eliminarRenglon(rowId: string) {
    setDetalles((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.id !== rowId);
    });
  }

  function seleccionarUbicacionDestino(idUbicacion: number) {
    setForm((prev) => ({
      ...prev,
      id_ubicacion_destino: idUbicacion > 0 ? idUbicacion : "",
    }));
  }

  function escribirProveedorQuery(value: string) {
    setProveedorQuery(value);

    setForm((prev) => ({
      ...prev,
      id_proveedor: "",
    }));

    if (!value.trim()) {
      setProveedoresEncontrados([]);
    }
  }

  function seleccionarProveedor(proveedor: ProveedorBusquedaItem) {
    setForm((prev) => ({
      ...prev,
      id_proveedor: proveedor.id_proveedor,
      usarProveedorExterno: false,
      proveedor_externo_nombre: "",
      proveedor_externo_contacto: "",
      proveedor_externo_telefono: "",
      proveedor_externo_descripcion: "",
    }));

    setProveedorQuery(proveedor.label);
    setProveedoresEncontrados([]);
  }

  function limpiarProveedorSeleccionado() {
    setForm((prev) => ({
      ...prev,
      id_proveedor: "",
    }));
    setProveedorQuery("");
    setProveedoresEncontrados([]);
  }

  function agregarProductoSeleccionado(producto: ProductoBusquedaItem) {
    const costoDefault =
      producto.costo_sugerido && producto.costo_sugerido > 0
        ? producto.costo_sugerido
        : 1;

    setDetalles((prev) => {
      const firstEmptyIndex = prev.findIndex(
        (row) => !row.id_producto || !row.producto_label.trim(),
      );

      if (firstEmptyIndex >= 0) {
        return prev.map((row, index) => {
          if (index !== firstEmptyIndex) return row;

          return {
            ...row,
            id_producto: producto.id_producto,
            producto_label: producto.label,
            cantidad: 1,
            costo_unitario: costoDefault,
            descuento: 0,
            impuestos: 0,
            importe: costoDefault,
          };
        });
      }

      const newRow: DetalleFormRow = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        id_producto: producto.id_producto,
        producto_label: producto.label,
        cantidad: 1,
        costo_unitario: costoDefault,
        descuento: 0,
        impuestos: 0,
        importe: costoDefault,
      };

      return [...prev, newRow];
    });

    setProductoQuery("");
    setProductosEncontrados([]);
  }

  function actualizarCantidad(rowId: string, cantidad: number | "") {
    updateDetalle(rowId, { cantidad });
  }

  function actualizarCosto(rowId: string, costo_unitario: number | "") {
    updateDetalle(rowId, { costo_unitario });
  }

  function actualizarDescuento(rowId: string, descuento: number | "") {
    updateDetalle(rowId, { descuento });
  }

  function actualizarImpuestos(rowId: string, impuestos: number | "") {
    updateDetalle(rowId, { impuestos });
  }

  async function guardar() {
    const err = validarCompra(form, detalles);
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      const detallePayload: CompraDetalleCreate[] = detalles.map((row) => ({
        id_producto: row.id_producto,
        cantidad: Number(row.cantidad),
        costo_unitario: Number(row.costo_unitario),
        descuento: toNumber(row.descuento),
        impuestos: toNumber(row.impuestos),
        importe:
          row.importe === ""
            ? Number(
                (
                  Number(row.cantidad) * Number(row.costo_unitario) -
                  toNumber(row.descuento) +
                  toNumber(row.impuestos)
                ).toFixed(2),
              )
            : Number(row.importe),
      }));

      let proveedorExterno: ProveedorExternoPayload | null = null;

      if (form.usarProveedorExterno) {
        proveedorExterno = {
          proveedor_externo_nombre: form.proveedor_externo_nombre.trim(),
          proveedor_externo_contacto:
            form.proveedor_externo_contacto.trim() || null,
          proveedor_externo_telefono:
            form.proveedor_externo_telefono.trim() || null,
          proveedor_externo_descripcion:
            form.proveedor_externo_descripcion.trim() || null,
        };
      }

      const payload: CompraCreate = {
        id_forma_pago: form.id_forma_pago,
        documento_referencia: form.documento_referencia.trim() || null,
        observaciones: form.observaciones.trim() || null,
        id_ubicacion_destino: Number(form.id_ubicacion_destino),
        id_proveedor: form.usarProveedorExterno
          ? null
          : Number(form.id_proveedor),
        proveedor_externo: proveedorExterno,
        detalle: detallePayload,
      };

      await comprasService.crear(payload);
      props.onSuccess();
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "Ocurrió un error al guardar la compra.";
      setMsgError(msg);
    } finally {
      setSaving(false);
    }
  }

  return {
    readOnly,

    form,
    setForm,

    detalles,
    saving,
    msgError,
    subtitulo,
    resumen,

    updateDetalle,
    agregarRenglon,
    eliminarRenglon,

    actualizarCantidad,
    actualizarCosto,
    actualizarDescuento,
    actualizarImpuestos,

    guardar,

    ubicacionesDestino,
    loadingUbicaciones,
    seleccionarUbicacionDestino,

    proveedoresEncontrados,
    loadingProveedores,
    proveedorQuery,
    setProveedorQuery,
    escribirProveedorQuery,
    seleccionarProveedor,
    limpiarProveedorSeleccionado,

    productosEncontrados,
    loadingProductos,
    productoQuery,
    setProductoQuery,
    agregarProductoSeleccionado,
  };
}