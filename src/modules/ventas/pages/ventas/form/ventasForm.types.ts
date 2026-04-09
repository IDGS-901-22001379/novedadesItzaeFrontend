// src/modules/ventas/pages/ventas/form/ventasForm.types.ts
// Tipos del formulario de ventas.
// Responsabilidades:
// - Definir el estado del formulario.
// - Soportar valores por defecto del negocio.
// - Permitir mostrar labels visibles además de ids internos.
// - Preparar la lógica para facturación opcional.
// - Preparar la lógica para ventas a crédito.
// - Exponer el estado auxiliar para búsqueda/selección de cliente.
// - Exponer el estado auxiliar para búsqueda/selección de productos.
// - Exponer el flujo de cobro previo al registro final.
// - Exponer el flujo de aperturas/caja dentro de ventas.

import type { Dispatch, SetStateAction } from "react";
import type {
  VentaCreate,
  VentaCreateResponse,
  VentaObtenerResponse,
  VentaPresentacion,
  VentaClienteOption,
  VentaFormaPagoOption,
  VentaProductoOption,
} from "../../../types";
import type { UseVentasFormAperturasVm } from "./ventasFormAperturas/useVentasFormAperturas";

export type VentasFormModo = "CREAR" | "VER";

export type VentasFormProps = {
  modo: VentasFormModo;
  initialVenta: VentaObtenerResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export type VentaDetalleForm = {
  id_producto: number | null;
  producto_label: string;

  // Presentación seleccionada para la venta.
  presentacion: VentaPresentacion;
  unidades_por_caja: number;

  // Captura / cálculo
  cantidad: number;
  precio_unitario: number;
  descuento: number;

  // Se conserva por compatibilidad si después calculas IVA por tasa.
  iva_tasa: number;

  // Valores de trabajo para el detalle.
  impuestos: number;
  importe: number;
};

export type VentaPagoForm = {
  id_forma_pago: number | null;
  forma_pago_label: string;
  monto: number;
  referencia: string;
};

export type VentaFormState = {
  // Cliente comercial
  id_cliente: number | null;
  cliente_label: string;
  id_tipo_cliente: number | null;
  tipo_cliente_label: string | null;

  // Usuario vendedor
  id_usuario_vendedor: number | null;
  vendedor_label: string;

  // Apertura activa
  id_apertura: number | null;
  apertura_label: string;

  // Generales
  notas: string;
  fecha_hora_pos: string;

  timezone_pos: string;
  timezone_pos_label: string;

  offset_minutos_pos: number;
  fuente_hora: "SERVIDOR" | "CLIENTE";

  // Crédito
  es_credito: boolean;

  // Facturación
  marcada_para_facturar: boolean;
  mostrar_datos_factura: boolean;

  id_cliente_fiscal: number | null;
  cliente_fiscal_label: string;

  id_forma_pago_principal: number | null;
  forma_pago_principal_label: string;

  id_metodo_pago_cfdi: number | null;
  metodo_cfdi_label: string;

  // El folio existe en el estado por compatibilidad,
  // pero no se mostrará en captura porque se genera solo.
  folio: string;

  detalles: VentaDetalleForm[];
  pagos: VentaPagoForm[];
};

export type VentasFormVm = {
  readOnly: boolean;

  form: VentaFormState;
  setForm: Dispatch<SetStateAction<VentaFormState>>;

  saving: boolean;
  msgError: string;
  msgInfoAccion: string;

  subtitulo: string;

  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  total: number;
  montoPagado: number;
  cambio: number;
  saldoPendiente: number;

  guardar: () => Promise<VentaCreateResponse | void>;

  // Flujo de cobro
  abrirCobro: () => void;
  cerrarCobro: () => void;
  cobroOpen: boolean;
  formasPagoOptions: VentaFormaPagoOption[];

  updateDetalle: (index: number, patch: Partial<VentaDetalleForm>) => void;
  agregarDetalle: () => void;
  eliminarDetalle: (index: number) => void;

  updatePago: (index: number, patch: Partial<VentaPagoForm>) => void;
  agregarPago: () => void;
  eliminarPago: (index: number) => void;

  // Activa o limpia la parte de facturación.
  toggleFacturacion: (checked: boolean) => void;

  // Activa o desactiva la venta a crédito.
  toggleCredito: (checked: boolean) => void;

  // Búsqueda/selección de cliente comercial.
  clienteQuery: string;
  setClienteQuery: Dispatch<SetStateAction<string>>;
  clienteResults: VentaClienteOption[];
  clienteSearching: boolean;
  selectCliente: (cliente: VentaClienteOption) => void;
  clearClienteSearchResults: () => void;

  // Búsqueda/selección de productos.
  productoQuery: string;
  setProductoQuery: Dispatch<SetStateAction<string>>;
  productosEncontrados: VentaProductoOption[];
  loadingProductos: boolean;
  selectProducto: (producto: VentaProductoOption) => void;
  productosInfoMap: Map<number, VentaProductoOption>;

  // Flujo de aperturas/caja.
  aperturaVm: UseVentasFormAperturasVm;
  abrirCajaDesdeVentas: () => Promise<void>;
  confirmarAbrirCajaDesdeVentas: () => Promise<void>;

  accionPendiente: (nombre: string) => void;

  calcDetalleImpuesto: (d: VentaDetalleForm) => number;
  calcDetalleImporte: (d: VentaDetalleForm) => number;

  formatMoney: (value: number) => string;
  formatDate: (value?: string | null) => string;
};

export type VentaCreatePayload = VentaCreate;
export type { VentaCreateResponse };