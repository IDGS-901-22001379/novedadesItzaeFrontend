// src/modules/ventas/types/ventas.list.types.ts
// Tipos del listado administrativo de ventas.
// Responsabilidades:
// - Definir el item del listado.
// - Definir la respuesta real del backend para GET /ventas.

import type { VentaEstatus } from "./ventas.core.types";

export interface VentaListItem {
  id_venta: number;
  folio: string;
  fecha_hora: string;
  fecha_hora_pos?: string | null;

  id_cliente: number | null;
  id_usuario_vendedor: number;
  id_apertura: number | null;

  estatus: VentaEstatus;

  subtotal?: number;
  descuento_total?: number;
  impuestos_total?: number;
  total: number;

  monto_pagado?: number;
  cambio?: number;

  marcada_para_facturar: boolean;
  factura_estado?: string | null;
}

// Respuesta real del backend para GET /ventas:
// [
//   [ ...ventas ],
//   total
// ]
export type VentasListResponse = [VentaListItem[], number];