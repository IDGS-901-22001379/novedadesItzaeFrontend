// src/modules/traspasos/pages/traspasos/list/useTraspasosListActions.ts
// Hook de acciones del listado de Traspasos.
// Responsabilidades:
// - controlar apertura/cierre de modales
// - cargar detalle al visualizar
// - preparar apertura de nuevo registro

import { useState } from "react";
import type {
  TraspasoDetalle,
  TraspasoItemListado,
} from "../../../types/traspasos.types";

type Params = {
  obtenerTraspaso: (id_movimiento: number) => Promise<TraspasoDetalle>;
};

export function useTraspasosListActions({ obtenerTraspaso }: Params) {
  const [selectedTraspaso, setSelectedTraspaso] =
    useState<TraspasoDetalle | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  function onNuevo() {
    setSelectedTraspaso(null);
    setOpenNuevo(true);
  }

  async function onVer(item: TraspasoItemListado) {
    try {
      const detalle = await obtenerTraspaso(item.id_movimiento);
      setSelectedTraspaso(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del traspaso.";
      alert(msg);
    }
  }

  function closeNuevo() {
    setOpenNuevo(false);
  }

  function closeVer() {
    setOpenVer(false);
  }

  return {
    selectedTraspaso,

    openNuevo,
    openVer,

    onNuevo,
    onVer,

    closeNuevo,
    closeVer,
  };
}