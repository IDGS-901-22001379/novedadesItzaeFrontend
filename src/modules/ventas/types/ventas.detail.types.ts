// src/modules/ventas/types/ventas.detail.types.ts
// Tipos de detalle de venta.
// Responsabilidades:
// - Definir la estructura completa de una venta.
// - Definir sus detalles y pagos.
// - Definir la respuesta de GET /ventas/{id_venta}.

import type {
  VentaEstatus,
  VentaFuenteHora,
  VentaPresentacion,
} from "./ventas.core.types";

export interface VentaDetalle {
  id_venta_detalle: number;
  id_venta: number;
  id_producto: number;
  presentacion: VentaPresentacion;
  unidades_por_caja: number;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  iva_tasa: number;
  impuestos: number;
  importe: number;
}

export interface VentaPago {
  id_venta_pago: number;
  id_venta: number;
  id_forma_pago: number;
  monto: number;
  referencia: string | null;
  creado_en: string;
}

export interface Venta {
  id_venta: number;
  folio: string;
  fecha_hora: string;
  fecha_hora_pos: string | null;
  timezone_pos: string | null;
  offset_minutos_pos: number | null;
  fuente_hora: VentaFuenteHora;

  id_cliente: number | null;
  id_usuario_vendedor: number;
  id_apertura: number | null;

  notas: string | null;
  estatus: VentaEstatus;

  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;

  marcada_para_facturar: boolean;
  factura_estado: string | null;
  factura_error: string | null;

  id_cliente_fiscal: number | null;
  id_forma_pago_principal: number | null;
  id_metodo_pago_cfdi: number | null;

  monto_pagado: number;
  cambio: number;

  creado_en: string;
  actualizado_en: string;

  detalles: VentaDetalle[];
  pagos: VentaPago[];
}

export interface VentaObtenerResponse {
  venta: Venta;
  detalles: VentaDetalle[];
  pagos: VentaPago[];
}