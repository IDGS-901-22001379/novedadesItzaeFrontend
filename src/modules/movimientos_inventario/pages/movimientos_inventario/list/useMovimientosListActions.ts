// src/modules/movimientos_inventario/pages/movimientos_inventario/list/useMovimientosListActions.ts
// Hook de acciones del listado de Movimientos de Inventario.
// Responsabilidades:
// - abrir/cerrar modal de visualización
// - cargar el detalle del movimiento al dar clic en Ver

import { useCallback, useState } from "react";

import type {
  MovimientoInventario,
  MovimientoInventarioItem,
} from "../../../types/movimientos_inventario.types";

type Params = {
  obtenerMovimiento: (id_movimiento: number) => Promise<MovimientoInventario>;
};

export function useMovimientosListActions({
  obtenerMovimiento,
}: Params) {
  const [selectedMovimiento, setSelectedMovimiento] =
    useState<MovimientoInventario | null>(null);

  const [openVer, setOpenVer] = useState(false);

  const onVer = useCallback(
    async (item: MovimientoInventarioItem) => {
      const detalle = await obtenerMovimiento(item.id_movimiento);
      setSelectedMovimiento(detalle);
      setOpenVer(true);
    },
    [obtenerMovimiento],
  );

  const closeVer = useCallback(() => {
    setOpenVer(false);
  }, []);

  return {
    selectedMovimiento,

    openVer,
    onVer,
    closeVer,
  };
}