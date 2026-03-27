// src/modules/ventas/types/ventas.query.types.ts
// Tipos de consulta del módulo Ventas.
// Responsabilidades:
// - Definir filtros del listado.
// - Mantener tipos reutilizables para queries paginadas.

import type { VentaEstatus } from "./ventas.core.types";

export interface VentasQuery {
  desde?: string;
  hasta?: string;
  q?: string;
  id_cliente?: number;
  estatus?: VentaEstatus;
  limit?: number;
  offset?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}