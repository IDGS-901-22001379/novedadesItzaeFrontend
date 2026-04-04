// src/modules/facturacion_cfdi/types/facturacion_cfdi.types.ts

export type FacturaEstado = "EMITIDA" | "CANCELADA" | "ERROR";

export interface FacturaConcepto {
  id_producto: number;
  presentacion: string;
  unidades_por_caja: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  importe: number;
  importe_neto: number;
  clave_prod_serv_sat: string;
  clave_unidad_sat: string;
  unidad_cfdi: string;
  objeto_imp: string;
  iva_tasa: number;
  impuestos: number;
  total_concepto: number;
  id_concepto: number;
  id_factura: number;
}

export interface Factura {
  id_factura: number;
  id_sucursal?: number | null;
  id_venta: number;
  id_cliente_fiscal: number;
  id_serie: number;

  serie?: string | null;
  folio?: number | string | null;

  // Campos amigables para mostrar en tabla/UI
  factura_folio?: string | null;
  venta_folio?: string | null;

  // Datos enriquecidos del cliente fiscal
  cliente_fiscal_nombre?: string | null;
  razon_social?: string | null;
  cliente_fiscal_rfc?: string | null;

  uuid?: string | null;

  fecha_emision: string;
  fecha_timbrado?: string | null;

  estado: FacturaEstado;
  intentos_timbrado?: number;
  ultimo_error?: string | null;
  ultimo_intento_en?: string | null;

  id_motivo_cancelacion_cfdi?: number | null;
  descripcion_cancelacion?: string | null;
  fecha_cancelacion?: string | null;
  id_usuario_cancela?: number | null;

  id_usuario_genero?: number;
  creado_en?: string;

  conceptos?: FacturaConcepto[];
}

export interface FacturaEmitirPayload {
  id_venta: number;
  id_cliente_fiscal: number;
  id_serie: number;
  id_usuario: number;
}

export interface FacturaCancelacionPayload {
  id_factura: number;
  id_motivo_cancelacion_cfdi: number;
  uuid_sustitucion?: string | null;
  id_usuario: number;
}

export interface FacturaEnvioPayload {
  id_factura: number;
  correo_destino: string;
  id_usuario: number;
}

export interface FacturaQuery {
  q?: string;
  estado?: FacturaEstado;
  id_sucursal?: number;
  id_cliente_fiscal?: number;
  desde?: string;
  hasta?: string;
  limit?: number;
  offset?: number;
}

export interface FacturaUltimasQuery {
  n?: number;
  id_sucursal?: number;
}

export interface SerieFacturacion {
  id_serie: number;
  id_sucursal: number;
  serie: string;
  folio_actual: number;
  folio_inicial: number;
  descripcion?: string | null;
  es_principal: boolean;
  activo: boolean;
  creado_en?: string;
  actualizado_en?: string;
}

export interface SeriesFacturacionQuery {
  id_sucursal?: number;
  solo_activas?: boolean;
}

export interface ClienteFiscal {
  id_cliente_fiscal: number;
  id_cliente?: number | null;
  razon_social: string;
  rfc: string;
  regimen_fiscal?: string | null;
  codigo_postal?: string | null;
  correo?: string | null;
  uso_cfdi?: string | null;
  activo?: boolean;
}

export interface ClienteFiscalBuscarItem {
  id_cliente_fiscal: number;
  id_cliente?: number | null;
  razon_social: string;
  rfc: string;
  correo?: string | null;
  activo?: boolean;
}

export interface ClientesFiscalesQuery {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
}

export interface FacturaOption {
  id: number;
  label: string;
}

export interface SerieFacturacionOption {
  id: number;
  label: string;
  serie: string;
  descripcion?: string | null;
  es_principal: boolean;
}

export interface ClienteFiscalOption {
  id: number;
  label: string;
  rfc: string;
  razon_social: string;
  correo?: string | null;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface MotivoCancelacionCfdi {
  id_motivo_cancelacion_cfdi: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
}

export interface MotivosCancelacionCfdiQuery {
  solo_activos?: boolean;
}