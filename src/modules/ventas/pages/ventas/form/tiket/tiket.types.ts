// src/modules/ventas/pages/ventas/form/tiket/tiket.types.ts
// Tipos del ticket de venta.
// Responsabilidades:
// - Definir la estructura visual del ticket.
// - Separar el formato del ticket de los tipos internos de ventas.

export type TiketDetalleItem = {
  id_producto?: number | null;
  producto_label: string;
  presentacion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  impuestos: number;
  importe: number;
};

export type TiketPagoItem = {
  forma_pago_label: string;
  monto: number;
  referencia?: string | null;
};

export type TiketData = {
  folio: string;
  fecha_hora: string;
  cliente_label: string;
  vendedor_label: string;
  apertura_label?: string | null;
  notas?: string | null;

  es_credito: boolean;

  subtotal: number;
  descuento_total: number;
  impuestos_total: number;
  total: number;
  monto_pagado: number;
  saldo_pendiente: number;
  cambio: number;

  detalles: TiketDetalleItem[];
  pagos: TiketPagoItem[];
};