// src/modules/movimientos_inventario/pages/movimientos_inventario/list/useMovimientosListData.ts
// Hook principal de datos del listado de Movimientos de Inventario.
// Responsabilidades:
// - mantener filtros
// - manejar paginación
// - cargar listado desde API
// - calcular resumen
// - exponer recarga y función para obtener detalle

import { useCallback, useEffect, useMemo, useState } from "react";

import { movimientosInventarioService } from "../../../services/movimientos_inventario.service";
import type {
  MovimientoInventario,
  MovimientoInventarioItem,
  MovimientoInventarioTipo,
  MovimientosInventarioQuery,
} from "../../../types/movimientos_inventario.types";

import type { Movimientos_inventarioFiltersState } from "../../../components/movimientos_inventario/Movimientos_inventarioFilters";

type LoadState = "idle" | "loading" | "success" | "error";

const PAGE_SIZE = 10;

const FILTERS_INITIAL: Movimientos_inventarioFiltersState = {
  q: "",
  tipo: "TODOS",
  desde: "",
  hasta: "",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de movimientos de inventario.";
}

function buildQueryFromFilters(
  filters: Movimientos_inventarioFiltersState,
  page: number,
): MovimientosInventarioQuery {
  return {
    q: filters.q.trim() || undefined,
    tipo:
      filters.tipo === "TODOS"
        ? undefined
        : (filters.tipo as MovimientoInventarioTipo),
    desde: filters.desde ? `${filters.desde}T00:00:00` : undefined,
    hasta: filters.hasta ? `${filters.hasta}T23:59:59` : undefined,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    include_detalles: false,
  };
}

export function useMovimientosListData() {
  const [items, setItems] = useState<MovimientoInventarioItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] =
    useState<Movimientos_inventarioFiltersState>(FILTERS_INITIAL);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const updateFilters = useCallback(
    (patch: Partial<Movimientos_inventarioFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const query = buildQueryFromFilters(filters, page);
      const data = await movimientosInventarioService.listar(query);

      setItems(data.items);
      setTotal(data.total);
      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [filters, page]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const query = buildQueryFromFilters(filters, page);
        const data = await movimientosInventarioService.listar(query);

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
  }, [filters, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const from = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, total);

  const resumen = useMemo(() => {
    const compras = items.filter((x) => x.tipo === "COMPRA").length;
    const ventas = items.filter((x) => x.tipo === "VENTA").length;
    const ajustes = items.filter(
      (x) => x.tipo === "AJUSTE" || x.tipo === "MERMA",
    ).length;

    return {
      total,
      compras,
      ventas,
      ajustes,
    };
  }, [items, total]);

  const obtenerMovimiento = useCallback(
    async (id_movimiento: number): Promise<MovimientoInventario> => {
      const [movimiento, detalles] = await Promise.all([
        movimientosInventarioService.obtener(id_movimiento, true),
        movimientosInventarioService.listarDetalles(id_movimiento),
      ]);

      return {
        ...movimiento,
        detalle: detalles ?? [],
      };
    },
    [],
  );

  return {
    items,
    state,
    errorMsg,

    filters,
    updateFilters,

    page,
    setPage,

    total,
    totalPages,
    from,
    to,

    resumen,

    recargar: cargar,
    obtenerMovimiento,
  };
}