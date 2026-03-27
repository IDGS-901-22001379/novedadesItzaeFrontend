// src/modules/ventas/pages/ventas/list/useVentasList.ts
// Hook principal del listado de ventas.
// Responsabilidades:
// - Cargar ventas desde API.
// - Mantener filtros, paginación y estados de carga.
// - Abrir modales de nueva venta y visualización.
// - Calcular resumen y rango visible del listado.

import { useCallback, useEffect, useMemo, useState } from "react";
import { ventasService } from "../../../services/ventas.service";
import type { VentaListItem, VentaObtenerResponse } from "../../../types";
import type { VentaClienteFilterOption } from "../../../components/ventas/VentasFilters";
import type { VentasListVm } from "./ventasList.types";
import { FILTERS_INITIAL, PAGE_SIZE } from "./ventasList.constants";
import { buildVentasListQuery } from "./ventasList.query";
import {
  buildPaginationRange,
  buildTotalPages,
  buildVentasResumen,
  getErrorMessage,
} from "./ventasList.utils";
import {
  abrirNuevaVenta,
  abrirVisualizacionVenta,
} from "./ventasList.actions";
import { buildVentasRows } from "./ventasList.rows";

export function useVentasList(): VentasListVm {
  const [items, setItems] = useState<VentaListItem[]>([]);
  const [total, setTotal] = useState(0);

  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] = useState(FILTERS_INITIAL);
  const [page, setPage] = useState(0);

  const [selectedVentaId, setSelectedVentaId] = useState<number | null>(null);
  const [selectedVenta, setSelectedVenta] =
    useState<VentaObtenerResponse | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // Catálogo preparado para futuros filtros reales por cliente.
  const [clientesDisponibles] = useState<VentaClienteFilterOption[]>([]);

  // Actualiza filtros y regresa a la primera página.
  const updateFilters = useCallback(
    (patch: Partial<typeof FILTERS_INITIAL>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  // Recarga manual del listado usando filtros + página actuales.
  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const query = buildVentasListQuery(filters);

      // El backend ya soporta paginación real.
      query.limit = PAGE_SIZE;
      query.offset = page * PAGE_SIZE;

      const resp = await ventasService.listar(query);

      setItems(resp.items);
      setTotal(resp.total);
      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [filters, page]);

  // Carga automática del listado cuando cambian filtros o página.
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const query = buildVentasListQuery(filters);

        // El backend regresa solo la página solicitada.
        query.limit = PAGE_SIZE;
        query.offset = page * PAGE_SIZE;

        const resp = await ventasService.listar(query);

        if (!mounted) return;

        setItems(resp.items);
        setTotal(resp.total);
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

  // Prepara filas por si después se enriquecen con más datos visibles.
  const rows = useMemo(() => buildVentasRows(items), [items]);

  const totalPages = useMemo(() => {
    return buildTotalPages(total, PAGE_SIZE);
  }, [total]);

  // Como el backend ya pagina, la página visible es exactamente lo recibido.
  const itemsPagina = useMemo(() => {
    return rows;
  }, [rows]);

  const { from, to } = useMemo(() => {
    return buildPaginationRange(page, PAGE_SIZE, total);
  }, [page, total]);

  // Resumen superior mostrado en el header del módulo.
  // Nota: se calcula con los registros de la página actual.
  const resumen = useMemo(() => {
    return buildVentasResumen(items);
  }, [items]);

  // Abre el modal de nueva venta limpiando la selección previa.
  function onNuevo() {
    abrirNuevaVenta({
      setSelectedVentaId,
      setSelectedVenta,
      setOpenNuevo,
    });
  }

  // Carga el detalle completo y abre el modal de visualización.
  async function onVer(item: VentaListItem) {
    try {
      const detalle = await ventasService.obtener(item.id_venta);

      abrirVisualizacionVenta({
        idVenta: item.id_venta,
        detalle,
        setSelectedVentaId,
        setSelectedVenta,
        setOpenVer,
      });
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error));
    }
  }

  return {
    items,
    itemsPagina,

    state,
    errorMsg,

    filters,
    updateFilters,

    page,
    setPage,
    totalPages,
    total,
    from,
    to,

    resumen,

    clientesDisponibles,

    selectedVentaId,
    selectedVenta,

    openNuevo,
    setOpenNuevo,

    openVer,
    setOpenVer,

    cargar,
    onNuevo,
    onVer,
  };
}