// src/modules/inventario_existencias/pages/inventario_existencias/list/inventarioExistenciasList.constants.ts

import type { InventarioExistenciasFiltersState } from "../../../components/inventario_existencias/InventarioExistenciasFilters";

export const FILTERS_INITIAL: InventarioExistenciasFiltersState = {
  q: "",
  idSucursal: "TODAS",
  idUbicacion: "TODAS",
  estadoProductos: "ACTIVOS",
};

export const API_LIMIT_MAX = 100;
export const API_LIMIT_DEFAULT = 50;
export const API_LIMIT_GLOBAL = 20;