// src/modules/devoluciones_cancelaciones/types/devoluciones_ventas.types.ts
// Tipos auxiliares de ventas para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Definir opciones de venta para búsquedas por folio.
// - Definir filtros de búsqueda usados desde devoluciones.

export interface DevolucionVentaOption {
  id_venta: number;
  folio: string;
  label: string;
}

export interface DevolucionesVentasQuery {
  desde?: string;
  hasta?: string;
  q?: string;
  id_cliente?: number;
  estatus?: string;
  limit?: number;
  offset?: number;
}