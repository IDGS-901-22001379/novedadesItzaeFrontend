// src/modules/ventas/pages/ventas/list/ventasList.constants.ts
// Constantes del listado de ventas.
// Responsabilidades:
// - Centralizar el estado inicial de filtros.
// - Definir el tamaño de página usado por la vista.

import type { VentasFiltersState } from "./ventasList.types";

// Estado inicial del panel de filtros.
export const FILTERS_INITIAL: VentasFiltersState = {
  q: "",
  estatus: "TODOS",
  idCliente: "TODOS",
  desde: "",
  hasta: "",
};

// Tamaño fijo de paginación visual del listado.
export const PAGE_SIZE = 10;