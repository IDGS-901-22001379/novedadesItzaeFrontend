// src/modules/inventario_existencias/pages/inventario_existencias/list/inventarioExistenciasList.query.ts

import type { InventarioExistenciasQuery } from "../../../types/inventarioExistencias.types";
import type { InventarioExistenciasFiltersState } from "../../../components/inventario_existencias/InventarioExistenciasFilters";
import type { InventarioExistenciasUbicacion as InventarioUbicacion } from "../../../services/inventarioExistenciasUbicaciones.service";

import {
  API_LIMIT_DEFAULT,
  API_LIMIT_GLOBAL,
} from "./inventarioExistenciasList.constants";

export function buildExistenciasQueryParams(
  filters: InventarioExistenciasFiltersState,
  ubicacionMap: Map<number, InventarioUbicacion>,
): InventarioExistenciasQuery {
  const idSucursal =
    filters.idSucursal !== "TODAS" && filters.idSucursal !== "-1"
      ? Number(filters.idSucursal)
      : undefined;

  const idUbicacion =
    filters.idUbicacion !== "TODAS" && filters.idUbicacion !== "-1"
      ? Number(filters.idUbicacion)
      : undefined;

  const ubicacionSeleccionada =
    idUbicacion != null ? ubicacionMap.get(idUbicacion) : null;

  const soloVendible =
    ubicacionSeleccionada != null
      ? Boolean(ubicacionSeleccionada.vendible)
      : undefined;

  const limit =
    idUbicacion != null || idSucursal != null
      ? API_LIMIT_DEFAULT
      : API_LIMIT_GLOBAL;

  return {
    q: filters.q.trim() || undefined,
    id_sucursal: idSucursal,
    id_ubicacion: idUbicacion,
    solo_activos:
      filters.estadoProductos === "ACTIVOS"
        ? true
        : filters.estadoProductos === "INACTIVOS"
          ? false
          : undefined,
    solo_vendible: soloVendible,
    include_ceros: true,
    limit,
    offset: 0,
  };
}