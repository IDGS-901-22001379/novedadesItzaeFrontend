// src/modules/ventas/pages/ventas/list/ventasList.query.ts
// Conversión de filtros del listado a parámetros de consulta.
// Responsabilidades:
// - Traducir el estado visual de filtros a valores válidos para el service.
// - Evitar repetir esta lógica dentro del hook principal.

import type { VentasQuery } from "../../../types";
import type { VentasFiltersState } from "./ventasList.types";

// Convierte los filtros del listado a un objeto listo para enviar al backend.
export function buildVentasListQuery(filters: VentasFiltersState): VentasQuery {
  return {
    q: filters.q.trim() || undefined,
    estatus: filters.estatus === "TODOS" ? undefined : filters.estatus,
    id_cliente:
      filters.idCliente === "TODOS" ? undefined : Number(filters.idCliente),
    desde: filters.desde || undefined,
    hasta: filters.hasta || undefined,
    limit: 100,
    offset: 0,
  };
}