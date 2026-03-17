// src/modules/traspasos/pages/traspasos/list/useTraspasosListData.ts
// Hook principal del listado de Traspasos.
// Responsabilidades:
// - cargar listado paginado desde API
// - mantener loading/error
// - controlar filtros y paginación
// - exponer resumen y función de recarga
// - exponer función para obtener detalle

import { useCallback, useEffect, useMemo, useState } from "react";
import { traspasosService } from "../../../services/traspasos.service";
import type {
  TraspasoDetalle,
  TraspasoItemListado,
} from "../../../types/traspasos.types";
import type { TraspasosFiltersState } from "../../../components/traspasos/TraspasosFilters";

export type TraspasosLoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: TraspasosFiltersState = {
  desde: "",
  hasta: "",
  idSucursal: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de traspasos.";
}

export function useTraspasosListData() {
  const [items, setItems] = useState<TraspasoItemListado[]>([]);
  const [state, setState] = useState<TraspasosLoadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] =
    useState<TraspasosFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);

  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const updateFilters = useCallback((patch: Partial<TraspasosFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  const recargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await traspasosService.listar({
        desde: filters.desde || undefined,
        hasta: filters.hasta || undefined,
        id_sucursal:
          filters.idSucursal === "TODOS"
            ? undefined
            : Number(filters.idSucursal),
        limit: pageSize,
        offset: page * pageSize,
      });

      setItems(data.items);
      setTotal(data.total);
      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const data = await traspasosService.listar({
          desde: filters.desde || undefined,
          hasta: filters.hasta || undefined,
          id_sucursal:
            filters.idSucursal === "TODOS"
              ? undefined
              : Number(filters.idSucursal),
          limit: pageSize,
          offset: page * pageSize,
        });

        if (!mounted) return;

        setItems(data.items);
        setTotal(data.total);
        setState("success");
      } catch (error: unknown) {
        if (!mounted) return;
        setState("error");
        setErrorMsg(getErrorMessage(error));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [filters, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  const resumen = useMemo(() => {
    const totalPagina = items.length;
    const conNotas = items.filter((x) => !!x.notas?.trim()).length;
    const sinNotas = items.filter((x) => !x.notas?.trim()).length;

    return {
      total,
      totalPagina,
      conNotas,
      sinNotas,
    };
  }, [items, total]);

  const obtenerTraspaso = useCallback(async (id_movimiento: number) => {
    return traspasosService.obtener(id_movimiento) as Promise<TraspasoDetalle>;
  }, []);

  return {
    items,
    state,
    errorMsg,
    filters,
    updateFilters,
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    from,
    to,
    resumen,
    recargar,
    obtenerTraspaso,
  };
}