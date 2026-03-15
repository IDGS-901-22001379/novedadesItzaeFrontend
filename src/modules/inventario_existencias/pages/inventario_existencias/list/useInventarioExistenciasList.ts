// src/modules/inventario_existencias/pages/inventario_existencias/list/useInventarioExistenciasList.ts

import { useCallback, useEffect, useMemo, useState } from "react";

import { inventarioExistenciasService } from "../../../services/inventarioExistencias.service";
import { productosService } from "../../../../productos/services/productos.service";

import type {
  ExistenciaDetalle,
  ExistenciaItem,
} from "../../../types/inventarioExistencias.types";

import type {
  InventarioExistenciasFiltersState,
  SucursalOption,
  UbicacionOption,
} from "../../../components/inventario_existencias/InventarioExistenciasFilters";

import type {
  ExistenciaRow,
  LoadState,
} from "./inventarioExistenciasList.types";

import { PAGE_SIZE, getErrorMessage, sortUbicaciones } from "./inventarioExistenciasList.utils";
import { FILTERS_INITIAL, API_LIMIT_GLOBAL, API_LIMIT_MAX } from "./inventarioExistenciasList.constants";
import { cargarCatalogosExistencias } from "./inventarioExistenciasList.catalogs";
import { buildExistenciasQueryParams } from "./inventarioExistenciasList.query";
import { buildExistenciasRows } from "./inventarioExistenciasList.rows";
import { resolveDetalleExistencia } from "./inventarioExistenciasList.actions";

export function useInventarioExistenciasList() {
  const [items, setItems] = useState<ExistenciaRow[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] =
    useState<InventarioExistenciasFiltersState>(FILTERS_INITIAL);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [selectedItem, setSelectedItem] = useState<ExistenciaDetalle | null>(
    null,
  );

  const [openAjuste, setOpenAjuste] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const [sucursalesDisponibles, setSucursalesDisponibles] = useState<
    SucursalOption[]
  >([]);
  const [ubicacionesCatalogo, setUbicacionesCatalogo] = useState<
    Array<{
      id_ubicacion: number;
      id_sucursal: number;
      nombre: string;
      tipo: string;
      codigo: string;
      vendible: boolean;
      activo: boolean;
    }>
  >([]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const offset = page * PAGE_SIZE;

  const updateFilters = useCallback(
    (patch: Partial<InventarioExistenciasFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { sucursales, ubicaciones } = await cargarCatalogosExistencias();

        if (!mounted) return;

        setSucursalesDisponibles(sucursales);
        setUbicacionesCatalogo(ubicaciones);

        if (sucursales.length > 0) {
          const primeraSucursal = sucursales[0];
          const ubicacionesDeSucursal = ubicaciones.filter(
            (u) => u.id_sucursal === primeraSucursal.id,
          );

          const primeraTienda =
            ubicacionesDeSucursal.find(
              (u) => String(u.tipo).toUpperCase() === "TIENDA",
            ) ?? null;

          setFilters((prev) => ({
            ...prev,
            idSucursal:
              prev.idSucursal === "TODAS"
                ? String(primeraSucursal.id)
                : prev.idSucursal,
            idUbicacion:
              prev.idUbicacion === "TODAS" && primeraTienda
                ? String(primeraTienda.id_ubicacion)
                : prev.idUbicacion,
          }));
        }
      } catch {
        if (!mounted) return;
        setSucursalesDisponibles([]);
        setUbicacionesCatalogo([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const sucursalMap = useMemo(() => {
    return new Map<number, string>(
      sucursalesDisponibles.map((s) => [s.id, s.nombre]),
    );
  }, [sucursalesDisponibles]);

  const ubicacionMap = useMemo(() => {
    return new Map<number, (typeof ubicacionesCatalogo)[number]>(
      ubicacionesCatalogo.map((u) => [u.id_ubicacion, u]),
    );
  }, [ubicacionesCatalogo]);

  const buildQueryParams = useCallback(() => {
    return buildExistenciasQueryParams(filters, ubicacionMap);
  }, [filters, ubicacionMap]);

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const queryParams = buildQueryParams();

      const productosServiceAny = productosService as unknown as {
        listar?: (params?: Record<string, unknown>) => Promise<unknown>;
      };

      const productosLimit =
        queryParams.id_ubicacion != null || queryParams.id_sucursal != null
          ? API_LIMIT_MAX
          : API_LIMIT_GLOBAL;

      const [existenciasData, productosRaw] = await Promise.all([
        inventarioExistenciasService.listar(queryParams),
        productosServiceAny.listar
          ? productosServiceAny.listar({
              q: filters.q.trim() || undefined,
              solo_activos:
                filters.estadoProductos === "ACTIVOS"
                  ? true
                  : filters.estadoProductos === "INACTIVOS"
                    ? false
                    : undefined,
              limit: productosLimit,
              offset: 0,
            })
          : Promise.resolve([]),
      ]);

      const existenciasBase = Array.isArray(existenciasData.items)
        ? existenciasData.items
        : [];

      let rows = await buildExistenciasRows({
        existenciasBase,
        productosRaw,
        filtersQ: filters.q,
        estadoProductos: filters.estadoProductos,
        sucursalMap,
        ubicacionMap,
      });

      const sucursalSeleccionadaId =
        filters.idSucursal !== "TODAS" && filters.idSucursal !== "-1"
          ? Number(filters.idSucursal)
          : null;

      if (sucursalSeleccionadaId !== null) {
        rows = rows.filter((row) => {
          const idSucursalRow =
            row.ubicacion?.id_sucursal ??
            ubicacionMap.get(row.id_ubicacion)?.id_sucursal ??
            0;

          return idSucursalRow === sucursalSeleccionadaId;
        });
      }

      if (filters.idUbicacion !== "TODAS" && filters.idUbicacion !== "-1") {
        const ubicacionId = Number(filters.idUbicacion);
        rows = rows.filter((row) => row.id_ubicacion === ubicacionId);
      }

      const totalRows = rows.length;
      const pagedRows = rows.slice(offset, offset + PAGE_SIZE);

      setItems(pagedRows);
      setTotal(totalRows);
      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
      setItems([]);
      setTotal(0);
    }
  }, [buildQueryParams, filters, offset, sucursalMap, ubicacionMap]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void cargar();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [cargar]);

  const resumen = useMemo(() => {
    const conExistencia = items.filter((x) => Number(x.existencia) > 0).length;
    const sinExistencia = items.filter((x) => Number(x.existencia) <= 0).length;

    return {
      totalRegistros: total,
      conExistencia,
      sinExistencia,
    };
  }, [items, total]);

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  const ubicacionesDisponibles = useMemo<UbicacionOption[]>(() => {
    const sucursalActualId =
      filters.idSucursal !== "TODAS" && filters.idSucursal !== "-1"
        ? Number(filters.idSucursal)
        : null;

    const base = ubicacionesCatalogo.filter((u) => {
      if (sucursalActualId === null) return true;
      return u.id_sucursal === sucursalActualId;
    });

    const ordenadas = sortUbicaciones(base);

    return ordenadas.map((u) => ({
      id: u.id_ubicacion,
      nombre: u.nombre,
      tipo: u.tipo,
      sucursalNombre:
        sucursalMap.get(u.id_sucursal) ?? "Sucursal no disponible",
    }));
  }, [ubicacionesCatalogo, sucursalMap, filters.idSucursal]);

  async function onVer(item: ExistenciaItem) {
    try {
      const detalle = await resolveDetalleExistencia({
        item,
        ubicacionMap,
        sucursalMap,
      });

      setSelectedItem(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la existencia.";
      alert(msg);
    }
  }

  async function onAbrirAjuste(item?: ExistenciaRow | null) {
    if (!item) {
      setSelectedItem(null);
      setOpenAjuste(true);
      return;
    }

    try {
      const detalle = await resolveDetalleExistencia({
        item,
        ubicacionMap,
        sucursalMap,
      });

      setSelectedItem(detalle);
      setOpenAjuste(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la existencia.";
      alert(msg);
    }
  }

  return {
    items,
    state,
    errorMsg,
    filters,
    page,
    total,
    totalPages,
    from,
    to,
    selectedItem,
    openAjuste,
    openVer,
    sucursalesDisponibles,
    ubicacionesDisponibles,
    resumen,

    setPage,
    setOpenAjuste,
    setOpenVer,
    updateFilters,
    onVer,
    onAbrirAjuste,
    cargar,

    setSelectedItem,
    ubicacionesCatalogo,
  };
}