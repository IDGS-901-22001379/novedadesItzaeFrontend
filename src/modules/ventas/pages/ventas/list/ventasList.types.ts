// src/modules/ventas/pages/ventas/list/ventasList.types.ts
// Tipos del listado de ventas.
// Responsabilidades:
// - Definir el estado de carga del listado.
// - Centralizar tipos de filtros, resumen y view model.
// - Mantener tipado consistente entre hook, vista y tabla.

import type { Dispatch, SetStateAction } from "react";
import type {
  VentaEstatus,
  VentaListItem,
  VentaObtenerResponse,
} from "../../../types";
import type { VentaClienteFilterOption } from "../../../components/ventas/VentasFilters";
import type { VentaListRow } from "./ventasList.rows";

export type LoadState = "idle" | "loading" | "success" | "error";

export type VentasFiltersState = {
  q: string;
  estatus: "TODOS" | VentaEstatus;
  idCliente: "TODOS" | string;
  desde: string;
  hasta: string;
};

export type VentasResumen = {
  completadas: number;
  canceladas: number;
  total: number;
  totalImporte: number;
};

export type VentasListVm = {
  // Datos originales traídos desde API.
  items: VentaListItem[];

  // Filas ya preparadas para la tabla.
  itemsPagina: VentaListRow[];

  state: LoadState;
  errorMsg: string;

  filters: VentasFiltersState;
  updateFilters: (patch: Partial<VentasFiltersState>) => void;

  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  total: number;
  from: number;
  to: number;

  resumen: VentasResumen;

  // Catálogo para filtro por cliente.
  clientesDisponibles: VentaClienteFilterOption[];

  selectedVentaId: number | null;
  selectedVenta: VentaObtenerResponse | null;

  openNuevo: boolean;
  setOpenNuevo: Dispatch<SetStateAction<boolean>>;

  openVer: boolean;
  setOpenVer: Dispatch<SetStateAction<boolean>>;

  cargar: () => Promise<void>;
  onNuevo: () => void;
  onVer: (item: VentaListItem) => Promise<void>;
};