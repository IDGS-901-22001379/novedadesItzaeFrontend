// src/modules/ventas/pages/ventas/form/ventasForm.utils.ts
// Utilidades del formulario de ventas.
// Responsabilidades:
// - Construir el estado del formulario en modo visualización.
// - Calcular importes e impuestos.
// - Formatear fechas y dinero.
// - Mantener helpers reutilizables fuera del hook principal.

import type {
  VentaDetalleForm,
  VentaFormState,
  VentasFormModo,
} from "./ventasForm.types";
import type { VentaObtenerResponse } from "../../../types";
import { VENTA_DEFAULTS } from "./ventasForm.constants";
import {
  buildVentaNuevaDefaultState,
  type VentaDefaultsContext,
} from "./ventasForm.defaults";

// Genera fecha/hora local compatible con input datetime-local.
export function nowLocalDateTimeInput(): string {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

function buildDetalleFallback(): VentaDetalleForm {
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

function buildPagoFallback(): VentaFormState["pagos"][number] {
  return {
    id_forma_pago: null,
    forma_pago_label: "",
    monto: 0,
    referencia: "",
  };
}

// Calcula impuestos de una línea.
export function calcDetalleImpuesto(d: VentaDetalleForm): number {
  const base =
    Math.max(0, Number(d.cantidad) * Number(d.precio_unitario)) -
    Math.max(0, Number(d.descuento));

  const ivaCalculado = base * (Math.max(0, Number(d.iva_tasa)) / 100);
  return Number(ivaCalculado.toFixed(2));
}

// Calcula importe total de una línea.
export function calcDetalleImporte(d: VentaDetalleForm): number {
  const base =
    Math.max(0, Number(d.cantidad) * Number(d.precio_unitario)) -
    Math.max(0, Number(d.descuento));

  const impuestos =
    Number(d.impuestos || 0) > 0
      ? Number(d.impuestos || 0)
      : calcDetalleImpuesto(d);

  return Number((base + impuestos).toFixed(2));
}

// Construye el estado inicial del formulario.
// En modo VER arma el detalle a partir de la venta recibida.
// En modo CREAR usa los defaults del negocio.
export function buildInitialForm(
  modo: VentasFormModo,
  ventaResp: VentaObtenerResponse | null,
  defaultsContext?: VentaDefaultsContext,
): VentaFormState {
  if (modo === "VER" && ventaResp?.venta) {
    const v = ventaResp.venta;

    const detalles =
      (ventaResp.detalles ?? []).map((d) => {
        const detalleBase: VentaDetalleForm = {
          id_producto: d.id_producto ?? null,
          producto_label:
            d.id_producto != null ? `Producto #${d.id_producto}` : "",
          presentacion: d.presentacion,
          unidades_por_caja: d.unidades_por_caja,
          cantidad: Number(d.cantidad),
          precio_unitario: Number(d.precio_unitario),
          descuento: Number(d.descuento),
          iva_tasa: Number(d.iva_tasa ?? 0),
          impuestos: 0,
          importe: 0,
        };

        const impuestos = calcDetalleImpuesto(detalleBase);
        const importe = calcDetalleImporte({
          ...detalleBase,
          impuestos,
        });

        return {
          ...detalleBase,
          impuestos,
          importe,
        };
      }) || [];

    const pagos =
      (ventaResp.pagos ?? []).map((p) => ({
        id_forma_pago: p.id_forma_pago ?? null,
        forma_pago_label:
          p.id_forma_pago != null ? `Forma de pago #${p.id_forma_pago}` : "",
        monto: Number(p.monto),
        referencia: p.referencia ?? "",
      })) || [];

    return {
      id_cliente: v.id_cliente ?? null,
      cliente_label: v.id_cliente != null ? `Cliente #${v.id_cliente}` : "",
      id_tipo_cliente: null,
      tipo_cliente_label: null,

      id_usuario_vendedor: v.id_usuario_vendedor ?? null,
      vendedor_label:
        v.id_usuario_vendedor != null
          ? `Vendedor #${v.id_usuario_vendedor}`
          : "",

      id_apertura: v.id_apertura ?? null,
      apertura_label: v.id_apertura != null ? `Apertura #${v.id_apertura}` : "",

      notas: v.notas ?? "",
      fecha_hora_pos: v.fecha_hora_pos
        ? v.fecha_hora_pos.slice(0, 16)
        : nowLocalDateTimeInput(),

      timezone_pos: v.timezone_pos ?? VENTA_DEFAULTS.timezonePosValue,
      timezone_pos_label: VENTA_DEFAULTS.timezonePosLabel,

      offset_minutos_pos: v.offset_minutos_pos ?? VENTA_DEFAULTS.offsetMinutosPos,
      fuente_hora: v.fuente_hora ?? VENTA_DEFAULTS.fuenteHora,

      marcada_para_facturar: Boolean(v.marcada_para_facturar),
      mostrar_datos_factura: Boolean(v.marcada_para_facturar),

      id_cliente_fiscal: v.id_cliente_fiscal ?? null,
      cliente_fiscal_label:
        v.id_cliente_fiscal != null
          ? `Cliente fiscal #${v.id_cliente_fiscal}`
          : "",

      id_forma_pago_principal: v.id_forma_pago_principal ?? null,
      forma_pago_principal_label:
        v.id_forma_pago_principal != null
          ? `Forma de pago #${v.id_forma_pago_principal}`
          : "",

      id_metodo_pago_cfdi: v.id_metodo_pago_cfdi ?? null,
      metodo_cfdi_label:
        v.id_metodo_pago_cfdi != null
          ? `Método CFDI #${v.id_metodo_pago_cfdi}`
          : "",

      folio: v.folio ?? "",

      detalles: detalles.length > 0 ? detalles : [buildDetalleFallback()],
      pagos: pagos.length > 0 ? pagos : [buildPagoFallback()],
    };
  }

  return buildVentaNuevaDefaultState(defaultsContext ?? {});
}

// Formato moneda MXN.
export function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

// Formato fecha legible.
export function formatDate(value?: string | null): string {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}