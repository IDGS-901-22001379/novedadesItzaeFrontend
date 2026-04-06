// src/modules/creditos_abonos/types/creditos_abonos.types.ts

export type AbonoCreditoEstatus = "REGISTRADO" | "CANCELADO";
export type FuenteHoraAbono = "SERVIDOR" | "CLIENTE";

export interface CreditoAbonoResumen {
  id_abono: number;
  folio: string;
  id_cliente: number;
  fecha_hora: string;
  monto_total: number;
  id_forma_pago: number;
  estatus: AbonoCreditoEstatus;
}

export interface CreditoAbono {
  id_abono: number;
  folio: string;
  id_cliente: number;
  fecha_hora: string;
  fecha_hora_pos: string;
  fuente_hora: FuenteHoraAbono | string;
  timezone_pos: string;
  offset_minutos_pos: number;
  id_usuario_cobra: number;
  id_apertura: number;
  id_forma_pago: number;
  monto_total: number;
  referencia_pago?: string | null;
  imprimir_ticket: boolean;
  estatus: AbonoCreditoEstatus;
  cancelado_en?: string | null;
  id_usuario_cancela?: number | null;
  motivo_cancelacion?: string | null;
  creado_en?: string | null;
}

export interface CreditoAbonoCreate {
  id_cliente: number;
  fecha_hora_pos: string;
  fuente_hora: FuenteHoraAbono | string;
  timezone_pos: string;
  offset_minutos_pos: number;
  id_usuario_cobra: number;
  id_apertura: number;
  id_forma_pago: number;
  monto_total: number;
  referencia_pago?: string | null;
  imprimir_ticket: boolean;
  folio?: string;
}

export interface CreditoAbonoUpdate {
  fecha_hora_pos: string;
  fuente_hora: FuenteHoraAbono | string;
  timezone_pos: string;
  offset_minutos_pos: number;
  id_apertura: number;
  id_forma_pago: number;
  monto_total: number;
  referencia_pago?: string | null;
  imprimir_ticket: boolean;
}

export interface CreditoAbonoCancel {
  id_usuario_cancela: number;
  motivo_cancelacion: string;
}

export interface CreditosAbonosQuery {
  q?: string;
  id_cliente?: number;
  id_usuario_cobra?: number;
  id_apertura?: number;
  id_forma_pago?: number;
  estatus?: AbonoCreditoEstatus;
  fecha_desde?: string;
  fecha_hasta?: string;
  limit?: number;
  offset?: number;
}

export interface CreditosAbonosClienteQuery {
  limit?: number;
  offset?: number;
}

export interface ListParams {
  limit?: number;
  offset?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface AbonoTicketPayload {
  [key: string]: unknown;
}

export interface AbonoMovimientoCajaPayload {
  [key: string]: unknown;
}