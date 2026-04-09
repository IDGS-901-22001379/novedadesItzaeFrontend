// src/modules/ventas/pages/ventas/form/useVentasForm/index.ts

import { useMemo, useRef, useState } from "react";

import type {
  VentaDetalleForm,
  VentasFormProps,
  VentasFormVm,
} from "../ventasForm.types";
import {
  buildInitialForm,
  calcDetalleImporte,
  calcDetalleImpuesto,
  formatDate,
  formatMoney,
} from "../ventasForm.utils";
import { VENTA_UI_TEXTS } from "../ventasForm.constants";
import { submitVenta } from "../ventasForm.submit";
import { FORMAS_PAGO_DEFAULT } from "./useVentasForm.helpers";
import type {
  VentaClienteOption,
  VentaCreateResponse,
  VentaFormaPagoOption,
} from "../../../../types";
import {
  useVentasFormAperturas,
  type VentaAperturaActual,
} from "../ventasFormAperturas";
import type { VentaProductoBusquedaItem } from "./useVentasForm.productos";
import {
  calcCambio,
  calcDescuentoTotal,
  calcImpuestosTotal,
  calcMontoPagado,
  calcSubtotal,
  calcTotal,
} from "./useVentasForm.totales";
import { useVentasFormEffects } from "./useVentasForm.effects";
import { createVentasFormHandlers } from "./useVentasForm.handlers";

export function useVentasForm(props: VentasFormProps): VentasFormVm {
  const readOnly = props.modo === "VER";

  const [defaultsLoaded, setDefaultsLoaded] = useState(readOnly);
  const [form, setForm] = useState(() =>
    buildInitialForm(props.modo, props.initialVenta),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [msgInfoAccion, setMsgInfoAccion] = useState("");

  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResults, setClienteResults] = useState<VentaClienteOption[]>([]);
  const [clienteSearching, setClienteSearching] = useState(false);

  const [productoQuery, setProductoQuery] = useState("");
  const [productosEncontrados, setProductosEncontrados] = useState<
    VentaProductoBusquedaItem[]
  >([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  const [cobroOpen, setCobroOpen] = useState(false);
  const [formasPagoOptions, setFormasPagoOptions] = useState<
    VentaFormaPagoOption[]
  >(FORMAS_PAGO_DEFAULT);

  const aperturasVm = useVentasFormAperturas();
  const productosMapRef = useRef<Map<number, VentaProductoBusquedaItem>>(
    new Map(),
  );
  const initKeyRef = useRef<string>("");

  useVentasFormEffects({
    props,
    readOnly,
    defaultsLoaded,
    setDefaultsLoaded,
    form,
    setForm,
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
    aperturasActual: aperturasVm.aperturaActual as VentaAperturaActual | null,
    productosMapRef,
    initKeyRef,
  });

  const handlers = createVentasFormHandlers({
    readOnly,
    form,
    setForm,
    setMsgError,
    setMsgInfoAccion,
    setProductoQuery,
    setProductosEncontrados,
    setClienteQuery,
    setClienteResults,
    aperturasVm,
    productosMapRef,
  });

  const subtitulo = useMemo(() => {
    if (props.modo === "CREAR") return VENTA_UI_TEXTS.subtituloCrear;
    return `${VENTA_UI_TEXTS.subtituloVer}: ${
      props.initialVenta?.venta?.folio ?? ""
    }`;
  }, [props.modo, props.initialVenta]);

  const subtotal = useMemo(() => calcSubtotal(form.detalles), [form.detalles]);

  const descuentoTotal = useMemo(
    () => calcDescuentoTotal(form.detalles),
    [form.detalles],
  );

  const impuestosTotal = useMemo(
    () => calcImpuestosTotal(form.detalles),
    [form.detalles],
  );

  const total = useMemo(() => calcTotal(form.detalles), [form.detalles]);

  const montoPagado = useMemo(() => calcMontoPagado(form.pagos), [form.pagos]);

  const cambio = useMemo(
    () => calcCambio(montoPagado, total),
    [montoPagado, total],
  );

  const saldoPendiente = useMemo(() => {
    const saldo = Number(total || 0) - Number(montoPagado || 0);
    return saldo > 0 ? saldo : 0;
  }, [total, montoPagado]);

  async function confirmarAbrirCajaDesdeVentas() {
    const apertura = await aperturasVm.confirmarAbrirApertura();

    if (apertura?.id_apertura) {
      await handlers.syncAperturaInForm(apertura);
      setMsgError("");
      setMsgInfoAccion("La caja se abrió correctamente.");
    }
  }

  function abrirCobro() {
    handlers.abrirCobro();
    if (!msgError) setCobroOpen(true);
  }

  function cerrarCobro() {
    handlers.cerrarCobro(setCobroOpen, saving);
  }

  async function guardar(): Promise<VentaCreateResponse | void> {
    if (readOnly) return;

    if (!defaultsLoaded) {
      setMsgError(
        "Espera un momento. Aún se están cargando los datos iniciales de la venta.",
      );
      return;
    }

    try {
      setSaving(true);
      setMsgError("");
      setMsgInfoAccion("");

      const response = await submitVenta({
        form,
        total,
        montoPagado,
        subtotal,
        descuentoTotal,
        impuestosTotal,
        cambio,
      });

      setCobroOpen(false);
      return response;
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Ocurrió un error al guardar la venta.";
      setMsgError(msg);
      return;
    } finally {
      setSaving(false);
    }
  }

  return {
    readOnly,

    form,
    setForm,

    saving,
    msgError: msgError || aperturasVm.msgAperturaError,
    msgInfoAccion,

    subtitulo,

    subtotal,
    descuentoTotal,
    impuestosTotal,
    total,
    montoPagado,
    cambio,
    saldoPendiente,

    guardar,
    abrirCobro,
    cerrarCobro,
    cobroOpen,
    formasPagoOptions,

    updateDetalle: handlers.updateDetalle,
    agregarDetalle: handlers.agregarDetalle,
    eliminarDetalle: handlers.eliminarDetalle,

    updatePago: handlers.updatePago,
    agregarPago: handlers.agregarPago,
    eliminarPago: handlers.eliminarPago,

    toggleFacturacion: handlers.toggleFacturacion,
    toggleCredito: handlers.toggleCredito,

    clienteQuery,
    setClienteQuery,
    clienteResults,
    clienteSearching,
    selectCliente: handlers.selectCliente,
    clearClienteSearchResults: handlers.clearClienteSearchResults,

    productoQuery,
    setProductoQuery,
    productosEncontrados,
    loadingProductos,
    selectProducto: handlers.selectProducto,
    productosInfoMap: productosMapRef.current,

    aperturaVm: aperturasVm,
    abrirCajaDesdeVentas: handlers.abrirCajaDesdeVentas,
    confirmarAbrirCajaDesdeVentas,

    accionPendiente: handlers.accionPendiente,

    calcDetalleImpuesto: calcDetalleImpuesto as (d: VentaDetalleForm) => number,
    calcDetalleImporte: calcDetalleImporte as (d: VentaDetalleForm) => number,

    formatMoney,
    formatDate,
  };
}