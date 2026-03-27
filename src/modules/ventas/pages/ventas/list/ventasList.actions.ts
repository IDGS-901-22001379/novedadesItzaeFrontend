// src/modules/ventas/pages/ventas/list/ventasList.actions.ts
// Acciones reutilizables del listado de ventas.
// Responsabilidades:
// - Abrir modal de nueva venta.
// - Limpiar la venta seleccionada.
// - Preparar la apertura del modal de visualización.

import type { Dispatch, SetStateAction } from "react";
import type { VentaObtenerResponse } from "../../../types";

// Abre el modal para crear una nueva venta y limpia la selección anterior.
export function abrirNuevaVenta(params: {
  setSelectedVentaId: Dispatch<SetStateAction<number | null>>;
  setSelectedVenta: Dispatch<SetStateAction<VentaObtenerResponse | null>>;
  setOpenNuevo: Dispatch<SetStateAction<boolean>>;
}) {
  params.setSelectedVentaId(null);
  params.setSelectedVenta(null);
  params.setOpenNuevo(true);
}

// Limpia la venta actualmente seleccionada.
export function limpiarVentaSeleccionada(params: {
  setSelectedVentaId: Dispatch<SetStateAction<number | null>>;
  setSelectedVenta: Dispatch<SetStateAction<VentaObtenerResponse | null>>;
}) {
  params.setSelectedVentaId(null);
  params.setSelectedVenta(null);
}

// Deja lista la información seleccionada para abrir el modal de visualización.
export function abrirVisualizacionVenta(params: {
  idVenta: number;
  detalle: VentaObtenerResponse;
  setSelectedVentaId: Dispatch<SetStateAction<number | null>>;
  setSelectedVenta: Dispatch<SetStateAction<VentaObtenerResponse | null>>;
  setOpenVer: Dispatch<SetStateAction<boolean>>;
}) {
  params.setSelectedVentaId(params.idVenta);
  params.setSelectedVenta(params.detalle);
  params.setOpenVer(true);
}