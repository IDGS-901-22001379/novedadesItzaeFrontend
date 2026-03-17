// src/modules/traspasos/pages/traspasos/list/useTraspasosListView.ts
// Hook de vista derivada del listado de Traspasos.
// Responsabilidades:
// - exponer la colección que se mostrará en tabla
// - dejar listo un punto de extensión si después agregas agrupaciones o transformaciones

import { useMemo } from "react";
import type { TraspasoItemListado } from "../../../types/traspasos.types";

export function useTraspasosListView(items: TraspasoItemListado[]) {
  const itemsPagina = useMemo(() => items, [items]);

  return {
    itemsPagina,
  };
}