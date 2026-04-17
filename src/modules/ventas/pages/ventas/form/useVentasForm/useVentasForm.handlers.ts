// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.handlers.ts

import {
  appendDetalle,
  appendPago,
  patchDetalle,
  patchPago,
  removeDetalle,
  removePago,
  setFacturacionState,
} from "../ventasForm.actions";
import {
  recalculateDetalleByPresentacion,
  selectVentasProducto,
  type VentaProductoBusquedaItem,
} from "./useVentasForm.productos";
import { selectVentasCliente } from "./useVentasForm.clientes";
import { resolverYAplicarPrecioReal } from "./useVentasForm.precios";
import { ventasProductosDetalleService } from "../../../../services/ventasProductosDetalle.service";
import { ventasProductosHistorialPreciosService } from "../../../../services/ventasProductosHistorialPrecios.service";
import type {
  VentaDetalleForm,
  VentaFormState,
  VentaPagoForm,
} from "../ventasForm.types";
import type { VentaClienteOption } from "../../../../types";
import type {
  UseVentasFormAperturasVm,
  VentaAperturaActual,
} from "../ventasFormAperturas";

type Params = {
  readOnly: boolean;
  form: VentaFormState;
  setForm: React.Dispatch<React.SetStateAction<VentaFormState>>;
  setMsgError: React.Dispatch<React.SetStateAction<string>>;
  setMsgInfoAccion: React.Dispatch<React.SetStateAction<string>>;
  setProductoQuery: React.Dispatch<React.SetStateAction<string>>;
  setProductosEncontrados: React.Dispatch<
    React.SetStateAction<VentaProductoBusquedaItem[]>
  >;
  setClienteQuery: React.Dispatch<React.SetStateAction<string>>;
  setClienteResults: React.Dispatch<React.SetStateAction<VentaClienteOption[]>>;
  aperturasVm: UseVentasFormAperturasVm;
  productosMapRef: React.MutableRefObject<Map<number, VentaProductoBusquedaItem>>;
};

function isProductoFacturable(producto: VentaProductoBusquedaItem): boolean {
  return Boolean(producto.facturable ?? producto.es_facturable ?? false);
}

export function createVentasFormHandlers({
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
}: Params) {
  function updateDetalle(index: number, patch: Partial<VentaDetalleForm>) {
    if (!aperturasVm.cajaAbierta && !readOnly) {
      setMsgError(
        "La caja está cerrada. Para realizar una venta tienes que abrir la caja.",
      );
      return;
    }

    let productoParaResolver: VentaProductoBusquedaItem | undefined;
    let presentacionParaResolver: VentaDetalleForm["presentacion"] | undefined;

    setForm((prev) => {
      const detalleActual = prev.detalles[index];
      if (!detalleActual) return prev;

      const detallePatched: VentaDetalleForm = {
        ...detalleActual,
        ...patch,
      };

      const idProducto = detallePatched.id_producto;
      const producto = idProducto
        ? productosMapRef.current.get(idProducto)
        : undefined;

      if (producto) {
        const detalleRecalculado = recalculateDetalleByPresentacion(
          detallePatched,
          producto,
          prev.tipo_cliente_label,
        );

        productoParaResolver = producto;
        presentacionParaResolver = detalleRecalculado.presentacion;

        return patchDetalle(prev, index, detalleRecalculado);
      }

      return patchDetalle(prev, index, patch);
    });

    if (productoParaResolver && presentacionParaResolver) {
      void resolverYAplicarPrecioReal({
        index,
        producto: productoParaResolver,
        presentacion: presentacionParaResolver,
        id_tipo_cliente: form.id_tipo_cliente,
        tipoClienteLabel: form.tipo_cliente_label,
        setForm,
        patchDetalle,
      });
    }
  }

  function agregarDetalle() {
    if (!aperturasVm.cajaAbierta && !readOnly) {
      setMsgError(
        "La caja está cerrada. Para realizar una venta tienes que abrir la caja.",
      );
      return;
    }

    setForm((prev) => appendDetalle(prev));
  }

  function eliminarDetalle(index: number) {
    setForm((prev) => removeDetalle(prev, index));
  }

  function updatePago(index: number, patch: Partial<VentaPagoForm>) {
    setForm((prev) => patchPago(prev, index, patch));
  }

  function agregarPago() {
    setForm((prev) => appendPago(prev));
  }

  function eliminarPago(index: number) {
    setForm((prev) => removePago(prev, index));
  }

  function toggleFacturacion(checked: boolean) {
    setForm((prev) => setFacturacionState(prev, checked));
    setMsgError("");
  }

  function toggleCredito(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      es_credito: checked,
    }));

    setMsgError("");
  }

  function selectCliente(cliente: VentaClienteOption) {
    selectVentasCliente(cliente, setForm, setClienteQuery, setClienteResults);
  }

  function clearClienteSearchResults() {
    setClienteResults([]);
  }

  async function selectProducto(producto: VentaProductoBusquedaItem) {
    if (!aperturasVm.cajaAbierta && !readOnly) {
      setMsgError(
        "La caja está cerrada. Para realizar una venta tienes que abrir la caja.",
      );
      return;
    }

    let productoCompleto: VentaProductoBusquedaItem = producto;

    try {
      const [detalleCompleto, preciosUi] = await Promise.all([
        ventasProductosDetalleService.obtener(producto.id_producto),
        ventasProductosHistorialPreciosService.resolverPreciosParaUi({
          producto,
        }),
      ]);

      productoCompleto = {
        ...producto,
        ...detalleCompleto,
        ...preciosUi,
        id_producto: producto.id_producto,
        nombre:
          detalleCompleto.nombre?.trim() ||
          producto.nombre?.trim() ||
          `Producto #${producto.id_producto}`,
        producto_label:
          detalleCompleto.producto_label?.trim() ||
          producto.producto_label?.trim() ||
          producto.nombre?.trim() ||
          `Producto #${producto.id_producto}`,
        label:
          detalleCompleto.label?.trim() ||
          producto.label?.trim() ||
          producto.producto_label?.trim() ||
          producto.nombre?.trim() ||
          `Producto #${producto.id_producto}`,
      };
    } catch {
      try {
        const detalleCompleto = await ventasProductosDetalleService.obtener(
          producto.id_producto,
        );

        productoCompleto = {
          ...producto,
          ...detalleCompleto,
          id_producto: producto.id_producto,
          nombre:
            detalleCompleto.nombre?.trim() ||
            producto.nombre?.trim() ||
            `Producto #${producto.id_producto}`,
          producto_label:
            detalleCompleto.producto_label?.trim() ||
            producto.producto_label?.trim() ||
            producto.nombre?.trim() ||
            `Producto #${producto.id_producto}`,
          label:
            detalleCompleto.label?.trim() ||
            producto.label?.trim() ||
            producto.producto_label?.trim() ||
            producto.nombre?.trim() ||
            `Producto #${producto.id_producto}`,
        };
      } catch {
        productoCompleto = producto;
      }
    }

    if (form.marcada_para_facturar && !isProductoFacturable(productoCompleto)) {
      setMsgError(
        "Este producto no es facturable. Si la venta está marcada como facturable, solo puedes agregar productos facturables.",
      );
      return;
    }

    productosMapRef.current.set(productoCompleto.id_producto, productoCompleto);

    const firstEmptyIndex = form.detalles.findIndex(
      (d) => !d.id_producto || !d.producto_label.trim(),
    );

    const targetIndex =
      firstEmptyIndex >= 0 ? firstEmptyIndex : form.detalles.length;

    selectVentasProducto({
      producto: productoCompleto,
      tipoClienteLabel: form.tipo_cliente_label,
      marcadaParaFacturar: form.marcada_para_facturar,
      setForm,
    });

    setProductoQuery("");
    setProductosEncontrados([]);
    setMsgError("");

    void resolverYAplicarPrecioReal({
      index: targetIndex,
      producto: productoCompleto,
      presentacion: "UNIDAD",
      id_tipo_cliente: form.id_tipo_cliente,
      tipoClienteLabel: form.tipo_cliente_label,
      setForm,
      patchDetalle,
    });
  }

  async function syncAperturaInForm(
    apertura: VentaAperturaActual | null,
  ): Promise<void> {
    setForm((prev) => ({
      ...prev,
      id_apertura: apertura?.id_apertura ?? null,
      apertura_label: apertura?.apertura_label ?? "",
    }));
  }

  function abrirCobro() {
    if (readOnly) return;

    if (!aperturasVm.cajaAbierta) {
      setMsgError(
        "La caja está cerrada. Para realizar una venta tienes que abrir la caja.",
      );
      return;
    }

    if (!form.id_cliente || form.id_cliente <= 0) {
      setMsgError("Te falta seleccionar el cliente.");
      return;
    }

    if (!form.id_usuario_vendedor || form.id_usuario_vendedor <= 0) {
      setMsgError("Te falta registrar el vendedor.");
      return;
    }

    if (!form.id_apertura || form.id_apertura <= 0) {
      setMsgError("Te falta registrar la apertura.");
      return;
    }

    if (!Array.isArray(form.detalles) || form.detalles.length === 0) {
      setMsgError("Te falta agregar al menos un producto.");
      return;
    }

    const detalleInvalido = form.detalles.find(
      (d) =>
        !d.id_producto ||
        d.id_producto <= 0 ||
        Number(d.cantidad) <= 0 ||
        Number(d.precio_unitario) <= 0,
    );

    if (detalleInvalido) {
      setMsgError("Revisa los productos de la venta. Hay datos incompletos.");
      return;
    }

    setMsgError("");
    setMsgInfoAccion("");
  }

  function cerrarCobro(
    setCobroOpen: React.Dispatch<React.SetStateAction<boolean>>,
    saving: boolean,
  ) {
    if (saving) return;
    setCobroOpen(false);
  }

  function accionPendiente(nombre: string) {
    setMsgInfoAccion(`${nombre}: aún se está trabajando en ello.`);
  }

  async function abrirCajaDesdeVentas() {
    setMsgError("");
    setMsgInfoAccion("");
    aperturasVm.abrirModalNuevaApertura();
  }

  return {
    updateDetalle,
    agregarDetalle,
    eliminarDetalle,
    updatePago,
    agregarPago,
    eliminarPago,
    toggleFacturacion,
    toggleCredito,
    selectCliente,
    clearClienteSearchResults,
    selectProducto,
    syncAperturaInForm,
    abrirCobro,
    cerrarCobro,
    accionPendiente,
    abrirCajaDesdeVentas,
  };
}