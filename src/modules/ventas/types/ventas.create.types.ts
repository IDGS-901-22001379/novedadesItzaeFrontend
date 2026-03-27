// src/modules/ventas/types/ventas.create.types.ts
// Tipos para crear ventas.
// Responsabilidades:
// - Definir el payload de creación.
// - Definir la respuesta del POST /ventas.

import type {
  VentaEstatus,
  VentaFuenteHora,
  VentaPresentacion,
} from "./ventas.core.types";
import type { Venta, VentaDetalle, VentaPago } from "./ventas.detail.types";

export interface VentaHeaderCreate {
  id_cliente?: number | null;
  id_usuario_vendedor: number;
  id_apertura?: number | null;

  notas?: string | null;
  fecha_hora_pos?: string | null;
  timezone_pos?: string | null;
  offset_minutos_pos?: number | null;
  fuente_hora?: VentaFuenteHora;

  marcada_para_facturar?: boolean;
  id_cliente_fiscal?: number | null;
  id_forma_pago_principal?: number | null;
  id_metodo_pago_cfdi?: number | null;

  folio?: string | null;
  estatus?: VentaEstatus;

  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
  monto_pagado: number;
  cambio: number;
}

export interface VentaDetalleCreate {
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

export interface VentaPagoCreate {
  id_forma_pago: number;
  monto: number;
  referencia?: string | null;
}

export interface VentaCreate {
  header: VentaHeaderCreate;
  detalles: VentaDetalleCreate[];
  pagos: VentaPagoCreate[];
}

export interface VentaCreateResponse {
  venta: Venta;
  detalles: VentaDetalle[];
  pagos: VentaPago[];
}