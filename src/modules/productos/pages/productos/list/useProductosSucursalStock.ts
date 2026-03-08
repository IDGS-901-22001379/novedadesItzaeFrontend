// src/modules/productos/pages/productos/list/useProductosSucursalStock.ts
// Calcula el stock por producto según la sucursal seleccionada en filtros,
// pero usando el endpoint NUEVO de resumen (1 request por página):
//   GET /inventario/existencias/resumen
//
// Reglas:
// - filters.idSucursal = "PRINCIPAL" => usa la sucursal principal (por ahora: primera activa).
// - filters.idSucursal = "TODAS"     => suma existencias de todas las sucursales.
// - filters.idSucursal = "15"        => usa esa sucursal específica.
//
// Resultado:
// - Retorna un map { [id_producto]: stock } para que la tabla pinte rápido.
//
// Ventaja:
// - Antes: N requests por producto/sucursal.
// - Ahora: 1 request por página.

import { useEffect, useMemo, useState } from "react";
import {
  inventarioStockService,
  type SucursalLite,
} from "../../../services/inventario_stock.service";
import type { ProductoLite } from "../../../types/productos.types";
import type { ProductosFiltersState } from "../../../components/productos/ProductosFilters";

function parseSucursalId(val: string): number | null {
  const n = Number(val);
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return n;
}

export function useProductosSucursalStock(
  itemsPagina: ProductoLite[],
  filters: ProductosFiltersState,
  sucursales: SucursalLite[],
) {
  const [stockByProductoId, setStockByProductoId] = useState<
    Record<number, number>
  >({});

  // IDs de productos visibles en la página (para mandar al endpoint resumen)
  const idsProductos = useMemo(() => {
    return itemsPagina
      .map((p) => p.id_producto)
      .filter((id) => Number.isFinite(id) && id > 0);
  }, [itemsPagina]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Si no hay items, limpiamos para evitar stock viejo
      if (idsProductos.length === 0) {
        setStockByProductoId({});
        return;
      }

      // Resolver sucursal según filtro
      const isTodas = filters.idSucursal === "TODAS";

      let idSucursal: number | undefined;

      if (!isTodas) {
        if (filters.idSucursal === "PRINCIPAL") {
          const principal = sucursales.find((s) => s.activo)?.id_sucursal ?? 0;
          idSucursal = principal > 0 ? principal : undefined;
        } else {
          const parsed = parseSucursalId(filters.idSucursal);
          idSucursal = parsed ?? undefined;
        }
      }

      // Si NO es TODAS y no hay sucursal válida => no consultamos
      if (!isTodas && !idSucursal) {
        setStockByProductoId({});
        return;
      }

      try {
        const resp = await inventarioStockService.resumenExistencias({
          ids_productos: idsProductos,
          id_sucursal: idSucursal,
          todas: isTodas,
          solo_vendible: false,
          solo_activos: false,
        });

        if (!mounted) return;

        // Map para acceso rápido
        const map: Record<number, number> = {};

        // El backend ya devuelve todos los ids pedidos (stock 0 si no existe),
        // pero por seguridad normalizamos.
        for (const it of resp.items) {
          map[it.id_producto] = Number(it.stock) || 0;
        }

        setStockByProductoId(map);
      } catch {
        if (!mounted) return;
        setStockByProductoId({});
      }
    })();

    return () => {
      mounted = false;
    };
  }, [idsProductos, filters.idSucursal, sucursales]);

  return stockByProductoId;
}