// src/modules/ventas/pages/ventas/form/ventasForm.defaults.ts
// Valores por defecto del formulario de ventas.
// Responsabilidades:
// - Construir el estado inicial de una venta nueva.
// - Aplicar reglas de negocio para cliente, vendedor, apertura y facturación.
// - Dejar listo el formulario para captura rápida.

import type { VentaFormState } from "./ventasForm.types";
import { VENTA_DEFAULTS, VENTA_FACTURA_DEFAULTS } from "./ventasForm.constants";

export type VentaDefaultsContext = {
  idClientePublicoGeneral?: number | null;
  nombreClientePublicoGeneral?: string | null;
  idTipoClientePublicoGeneral?: number | null;
  tipoClientePublicoGeneralLabel?: string | null;

  idUsuarioLogeado?: number | null;
  nombreVendedorTicket?: string | null;

  idAperturaActiva?: number | null;
  aperturaLabel?: string | null;
};

// Genera fecha/hora local compatible con input datetime-local.
function nowLocalDateTimeInput(): string {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

// Construye una venta nueva con los valores por defecto del negocio.
export function buildVentaNuevaDefaultState(
  ctx: VentaDefaultsContext,
): VentaFormState {
  return {
    // Cliente por defecto: Público General
    id_cliente: ctx.idClientePublicoGeneral ?? null,
    cliente_label:
      ctx.nombreClientePublicoGeneral?.trim() ||
      VENTA_DEFAULTS.clientePublicoGeneralLabel,
    id_tipo_cliente: ctx.idTipoClientePublicoGeneral ?? null,
    tipo_cliente_label: ctx.tipoClientePublicoGeneralLabel?.trim() || null,

    // Vendedor por defecto: usuario logeado
    id_usuario_vendedor: ctx.idUsuarioLogeado ?? null,
    vendedor_label: ctx.nombreVendedorTicket?.trim() || "",

    // Apertura por defecto: apertura activa
    id_apertura: ctx.idAperturaActiva ?? null,
    apertura_label:
      ctx.aperturaLabel?.trim() ||
      (ctx.idAperturaActiva ? `Apertura #${ctx.idAperturaActiva}` : ""),

    // Generales
    notas: "",
    fecha_hora_pos: nowLocalDateTimeInput(),

    timezone_pos: VENTA_DEFAULTS.timezonePosValue,
    timezone_pos_label: VENTA_DEFAULTS.timezonePosLabel,

    offset_minutos_pos: VENTA_DEFAULTS.offsetMinutosPos,
    fuente_hora: VENTA_DEFAULTS.fuenteHora,

    // Facturación apagada por defecto
    marcada_para_facturar: VENTA_FACTURA_DEFAULTS.marcadaParaFacturar,
    mostrar_datos_factura: VENTA_FACTURA_DEFAULTS.mostrarDatosFactura,

    id_cliente_fiscal: null,
    cliente_fiscal_label: "",

    id_forma_pago_principal: null,
    forma_pago_principal_label: "",

    id_metodo_pago_cfdi: null,
    metodo_cfdi_label: "",

    // El folio lo genera backend; si el type lo exige, se deja vacío.
    folio: "",

    // Primer renglón de detalle listo para capturar
    detalles: [
      {
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
      },
    ],

    // Primer pago listo para capturar
    pagos: [
      {
        id_forma_pago: null,
        forma_pago_label: "",
        monto: 0,
        referencia: "",
      },
    ],
  };
}