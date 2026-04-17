// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.effects.ts

import { useEffect, useMemo } from "react";
import { buildInitialForm } from "../ventasForm.utils";
import { initVentasForm } from "./useVentasForm.init";
import { searchVentasClientes } from "./useVentasForm.clientes";
import {
  searchVentasProductos,
  type VentaProductoBusquedaItem,
} from "./useVentasForm.productos";
import { ventasProductosService } from "../../../../services/ventasProductos.service";
import type { VentasFormProps, VentaFormState } from "../ventasForm.types";
import type {
  VentaClienteOption,
  VentaFormaPagoOption,
} from "../../../../types";
import type { VentaAperturaActual } from "../ventasFormAperturas";
import { sincronizarPreciosPorTipoCliente } from "./useVentasForm.precios";
import { FORMAS_PAGO_DEFAULT } from "./useVentasForm.helpers";

type Params = {
  props: VentasFormProps;
  readOnly: boolean;
  defaultsLoaded: boolean;
  setDefaultsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  form: VentaFormState;
  setForm: React.Dispatch<React.SetStateAction<VentaFormState>>;
  setMsgError: React.Dispatch<React.SetStateAction<string>>;
  setMsgInfoAccion: React.Dispatch<React.SetStateAction<string>>;
  clienteQuery: string;
  setClienteQuery: React.Dispatch<React.SetStateAction<string>>;
  setClienteResults: React.Dispatch<React.SetStateAction<VentaClienteOption[]>>;
  setClienteSearching: React.Dispatch<React.SetStateAction<boolean>>;
  productoQuery: string;
  setProductosEncontrados: React.Dispatch<
    React.SetStateAction<VentaProductoBusquedaItem[]>
  >;
  setLoadingProductos: React.Dispatch<React.SetStateAction<boolean>>;
  setCobroOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormasPagoOptions: React.Dispatch<
    React.SetStateAction<VentaFormaPagoOption[]>
  >;
  aperturasActual: VentaAperturaActual | null;
  productosMapRef: React.MutableRefObject<Map<number, VentaProductoBusquedaItem>>;
  initKeyRef: React.MutableRefObject<string>;
};

export function useVentasFormEffects({
  props,
  readOnly,
  form,
  setForm,
  setDefaultsLoaded,
  setMsgError,
  setMsgInfoAccion,
  clienteQuery,
  setClienteQuery,
  setClienteResults,
  setClienteSearching,
  productoQuery,
  setProductosEncontrados,
  setLoadingProductos,
  setCobroOpen,
  setFormasPagoOptions,
  aperturasActual,
  productosMapRef,
  initKeyRef,
}: Params): void {
  const detallesSnapshot = useMemo(() => form.detalles, [form.detalles]);

  const formPrecioSnapshot = useMemo(
    () =>
      ({
        id_tipo_cliente: form.id_tipo_cliente,
        tipo_cliente_label: form.tipo_cliente_label,
        detalles: detallesSnapshot,
      }) as VentaFormState,
    [form.id_tipo_cliente, form.tipo_cliente_label, detallesSnapshot],
  );

  useEffect(() => {
    const initKey =
      props.modo === "VER"
        ? `VER-${props.initialVenta?.venta?.id_venta ?? "null"}`
        : "CREAR";

    if (initKeyRef.current === initKey) return;

    initKeyRef.current = initKey;

    let mounted = true;

    (async () => {
      try {
        await initVentasForm({
          props,
          readOnly,
          setForm,
          setDefaultsLoaded,
          setMsgError,
          setMsgInfoAccion,
          setClienteQuery,
          setClienteResults,
          setCobroOpen,
          setFormasPagoOptions,
        });

        if (!mounted) return;
      } catch {
        if (!mounted) return;

        setForm(buildInitialForm("CREAR", null, {}));
        setClienteQuery("Publico General");
        setFormasPagoOptions(FORMAS_PAGO_DEFAULT);
        setDefaultsLoaded(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [
    props,
    props.modo,
    props.initialVenta,
    readOnly,
    setForm,
    setDefaultsLoaded,
    setMsgError,
    setMsgInfoAccion,
    setClienteQuery,
    setClienteResults,
    setCobroOpen,
    setFormasPagoOptions,
    initKeyRef,
  ]);

  useEffect(() => {
    if (readOnly) return;

    const timeout = window.setTimeout(() => {
      void searchVentasClientes({
        readOnly,
        clienteQuery,
        setClienteSearching,
        setClienteResults,
        setClienteQuery,
        setForm,
      });
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    clienteQuery,
    readOnly,
    setClienteSearching,
    setClienteResults,
    setClienteQuery,
    setForm,
  ]);

  useEffect(() => {
    if (readOnly) return;

    const timeout = window.setTimeout(() => {
      void searchVentasProductos({
        readOnly,
        productoQuery,
        marcadaParaFacturar: Boolean(form.marcada_para_facturar),
        setLoadingProductos,
        setProductosEncontrados: (items) => {
          setProductosEncontrados(items);

          for (const item of items) {
            productosMapRef.current.set(item.id_producto, item);
          }
        },
        buscarProductos: ventasProductosService.buscar,
      });
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    productoQuery,
    readOnly,
    form.marcada_para_facturar,
    setLoadingProductos,
    setProductosEncontrados,
    productosMapRef,
  ]);

  useEffect(() => {
    if (readOnly) return;

    setForm((prev) => {
      const nextIdApertura = aperturasActual?.id_apertura ?? null;
      const nextAperturaLabel = aperturasActual?.apertura_label ?? "";

      if (
        prev.id_apertura === nextIdApertura &&
        prev.apertura_label === nextAperturaLabel
      ) {
        return prev;
      }

      return {
        ...prev,
        id_apertura: nextIdApertura,
        apertura_label: nextAperturaLabel,
      };
    });
  }, [readOnly, aperturasActual, setForm]);

  useEffect(() => {
    if (readOnly) return;
    if (!formPrecioSnapshot.detalles.length) return;

    let cancelled = false;

    (async () => {
      const detallesActualizados = await sincronizarPreciosPorTipoCliente({
        form: formPrecioSnapshot,
        readOnly,
        productosMapRef,
      });

      if (cancelled) return;

      setForm((prev) => {
        const same =
          JSON.stringify(prev.detalles) === JSON.stringify(detallesActualizados);

        if (same) return prev;

        return {
          ...prev,
          detalles: detallesActualizados,
        };
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [readOnly, formPrecioSnapshot, productosMapRef, setForm]);
}