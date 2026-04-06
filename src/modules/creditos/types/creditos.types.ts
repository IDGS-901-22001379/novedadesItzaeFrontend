// src/modules/creditos/types/creditos.types.ts
// Tipos del módulo Créditos y Cobranza - Créditos.
// Responsabilidades:
// - definir entidades principales del crédito
// - tipar payloads de creación y actualización
// - tipar filtros de búsqueda y consultas auxiliares

export type CreditoEstado = "PENDIENTE" | "PARCIAL" | "PAGADO" | "CANCELADO";

export interface Credito {
  id_venta_credito: number;
  id_venta: number;
  id_cliente: number;
  id_apertura: number;
  id_usuario: number;
  estado: CreditoEstado | string;
  total_venta: number;
  total_abonado: number;
  saldo_pendiente: number;
  fecha_vencimiento: string;
  notas?: string | null;
  creado_en?: string;
  actualizado_en?: string;
}

export interface CreditoListItem {
  id_venta_credito: number;
  id_venta: number;
  id_cliente: number;
  estado: CreditoEstado | string;
  total_venta: number;
  total_abonado: number;
  saldo_pendiente: number;
  fecha_vencimiento: string;
}

export interface CreditoCreate {
  id_venta: number;
  id_cliente: number;
  id_apertura: number;
  id_usuario: number;
  total_venta: number;
  total_abonado: number;
  saldo_pendiente: number;
  fecha_vencimiento: string;
  notas?: string | null;
  estado: CreditoEstado | string;
}

export interface CreditoUpdate {
  id_apertura: number;
  id_usuario: number;
  estado: CreditoEstado | string;
  total_venta: number;
  total_abonado: number;
  saldo_pendiente: number;
  fecha_vencimiento: string;
  notas?: string | null;
}

export interface CreditoSaldoUpdate {
  nuevo_total_abonado: number;
  nuevo_saldo_pendiente: number;
}

export interface CreditosQuery {
  q?: string;
  id_cliente?: number;
  id_venta?: number;
  estado?: CreditoEstado | string;
  vencidos_solo?: boolean;
  fecha_vencimiento_desde?: string;
  fecha_vencimiento_hasta?: string;
  limit?: number;
  offset?: number;
}

export interface CreditoClienteResumen {
  deuda_total: number;
  ventas_activas: number;
  ultimo_vencimiento?: string | null;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}