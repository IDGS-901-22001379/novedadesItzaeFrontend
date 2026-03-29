// src/modules/cortes_caja/types/cortes_caja.types.ts

export type AperturaCajaEstatus = "ABIERTA" | "CERRADA";

export type CorteCajaMovimientoTipo =
  | "ENTRADA_EXTRA"
  | "SALIDA_GASTO";

export interface CorteCajaAperturaResumen {
  id_apertura: number;
  id_caja: number;
  id_usuario: number;
  fecha_hora_apertura: string;
  estatus: AperturaCajaEstatus;
  fecha_hora_cierre?: string | null;
}

export interface CorteCajaApertura {
  id_apertura: number;
  id_caja: number;
  id_usuario: number;
  fecha_hora_apertura: string;
  monto_inicial: string;
  estatus: AperturaCajaEstatus;
  fecha_hora_cierre?: string | null;

  efectivo_contado?: string | null;
  diferencia?: string | null;

  total_ventas?: string | null;
  total_ventas_efectivo?: string | null;
  total_ventas_tarjeta?: string | null;
  total_ventas_otros?: string | null;

  total_devoluciones?: string | null;
  total_gastos?: string | null;
  total_entradas_extra?: string | null;
  total_abonos_credito?: string | null;

  creado_en?: string;
  actualizado_en?: string;
}

export interface CorteCajaMovimientoResumen {
  id_mov_caja: number;
  tipo: CorteCajaMovimientoTipo;
  monto: string;
  fecha_hora: string;
  motivo: string;
}

export interface CorteCajaMovimiento {
  id_mov_caja: number;
  id_apertura: number;
  tipo: CorteCajaMovimientoTipo;
  id_forma_pago?: number | null;
  monto: string;
  motivo: string;
  referencia_tipo?: string | null;
  referencia_id?: number | null;
  id_usuario: number;
  fecha_hora: string;
}

export interface CortesCajaAperturasQuery {
  id_caja?: number | null;
}

export interface CorteCajaAbrirPayload {
  id_caja: number;
  monto_inicial: number;
}

export interface CorteCajaCerrarPayload {
  efectivo_contado: number;
}

export interface CortesCajaMovimientosQuery {
  id_apertura: number;
}

export interface CorteCajaMovimientoCreate {
  id_apertura: number;
  tipo: CorteCajaMovimientoTipo;
  monto: number;
  motivo: string;
  id_forma_pago?: number | null;
  referencia_tipo?: string | null;
  referencia_id?: number | null;
}