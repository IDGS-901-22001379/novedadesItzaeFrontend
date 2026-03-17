// src/modules/traspasos/pages/traspasos/form/useTraspasosFormCatalogos.ts

import { useEffect, useMemo, useState } from "react";
import { inventarioUbicacionesService } from "../../../../inventario_ubicaciones/services/inventario_ubicaciones.service";
import { inventarioSucursalesService } from "../../../../inventario_sucursales/services";
import { productosService } from "../../../../productos/services/productos.service";
import type {
  ProductoOption,
  UbicacionOption,
} from "./traspasosForm.types";
import {
  extractArray,
  mapProductoOption,
  mapUbicacionOption,
} from "./traspasosForm.utils";

type SucursalLookup = {
  id_sucursal?: number | null;
  id?: number | null;
  nombre?: string | null;
  activo?: boolean | null;
  estatus?: string | null;
};

type UbicacionLookup = Record<string, unknown>;

function getSucursalId(raw: SucursalLookup): number {
  return Number(raw.id_sucursal ?? raw.id ?? 0);
}

function isSucursalActiva(raw: SucursalLookup): boolean {
  if (typeof raw.activo === "boolean") return raw.activo;
  return String(raw.estatus ?? "").toUpperCase() === "ACTIVO";
}

function getUbicacionId(raw: UbicacionLookup): number {
  return Number(raw.id_ubicacion ?? raw.id ?? 0);
}

export function useTraspasosFormCatalogos() {
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [ubicaciones, setUbicaciones] = useState<UbicacionOption[]>([]);
  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [catalogosError, setCatalogosError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function cargarCatalogos() {
      try {
        setLoadingCatalogs(true);
        setCatalogosError("");

        // 1) Sucursales
        const sucursalesResp = await (
          inventarioSucursalesService as {
            listar: (params?: unknown) => Promise<unknown>;
          }
        ).listar();

        const sucursalesActivas = extractArray(sucursalesResp)
          .map((raw) => raw as SucursalLookup)
          .filter((s) => getSucursalId(s) > 0 && isSucursalActiva(s));

        // 2) Ubicaciones activas por sucursal activa
        const ubicacionesPorSucursal = await Promise.all(
          sucursalesActivas.map(async (sucursal) => {
            const idSucursal = getSucursalId(sucursal);

            const resp = await (
              inventarioUbicacionesService as {
                listar: (params?: unknown) => Promise<unknown>;
              }
            ).listar({
              id_sucursal: idSucursal,
              solo_activos: true,
            });

            return extractArray(resp);
          }),
        );

        // 3) Productos activos
        const productosResp = await (
          productosService as {
            listar: (params?: unknown) => Promise<unknown>;
          }
        ).listar({
          estatus: "ACTIVO",
          limit: 500,
          offset: 0,
        });

        if (!mounted) return;

        // 4) Unir ubicaciones y quitar duplicados por id
        const ubicacionesFlat = ubicacionesPorSucursal.flat();

        const ubicacionesMap = new Map<number, UbicacionOption>();
        for (const raw of ubicacionesFlat) {
          const id = getUbicacionId(raw);
          if (id <= 0) continue;

          const mapped = mapUbicacionOption(raw);
          if (mapped.id > 0) {
            ubicacionesMap.set(mapped.id, mapped);
          }
        }

        const ubicacionesItems = Array.from(ubicacionesMap.values());

        const productosItems = extractArray(productosResp)
          .map(mapProductoOption)
          .filter((x) => x.id > 0);

        setUbicaciones(ubicacionesItems);
        setProductos(productosItems);
      } catch (e: unknown) {
        if (!mounted) return;

        setCatalogosError(
          e instanceof Error
            ? e.message
            : "No se pudieron cargar sucursales, ubicaciones y productos.",
        );
      } finally {
        if (mounted) setLoadingCatalogs(false);
      }
    }

    void cargarCatalogos();

    return () => {
      mounted = false;
    };
  }, []);

  const ubicacionLabelById = useMemo(() => {
    const map = new Map<number, string>();
    ubicaciones.forEach((u) => map.set(u.id, u.label));
    return map;
  }, [ubicaciones]);

  const productoLabelById = useMemo(() => {
    const map = new Map<number, string>();
    productos.forEach((p) => map.set(p.id, p.label));
    return map;
  }, [productos]);

  return {
    loadingCatalogs,
    catalogosError,
    ubicaciones,
    productos,
    ubicacionLabelById,
    productoLabelById,
  };
}