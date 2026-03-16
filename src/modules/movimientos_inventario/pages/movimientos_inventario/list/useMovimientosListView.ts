// src/modules/movimientos_inventario/pages/movimientos_inventario/list/useMovimientosListView.ts
// Hook de vista del listado de Movimientos de Inventario.
// Responsabilidades:
// - preparar los items que se renderizan en la tabla
// - dejar un punto central para futuras transformaciones visuales
// Nota: por ahora el backend ya entrega la página actual, así que itemsPagina = items.

import { useMemo } from "react";

import type { MovimientoInventarioItem } from "../../../types/movimientos_inventario.types";

export function useMovimientosListView(items: MovimientoInventarioItem[]) {
  const itemsPagina = useMemo(() => {
    return items;
  }, [items]);

  return {
    itemsPagina,
  };
}