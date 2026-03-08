// src/modules/productos/pages/productos/list/useProductosListView.ts
import { useMemo, useState } from "react";
import type { ProductoLite, ProductoEstatus } from "../../../types/productos.types";
import type { ProductosFiltersState } from "../../../components/productos/ProductosFilters";

export function useProductosListView(items: ProductoLite[], pageSize = 10) {
  const [filters, setFilters] = useState<ProductosFiltersState>({
    q: "",
    estatus: "TODOS",
    idCategoria: "TODOS",
    idProveedor: "TODOS",
    idSucursal: "TODAS",
  });

  const [page, setPage] = useState(0);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (p: ProductoLite) => {
      if (!q) return true;

      const full = [
        p.nombre ?? "",
        p.modelo ?? "",
        p.descripcion ?? "",
        p.sku ?? "",
        p.codigo_barras ?? "",
        String(p.id_producto ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      return full.includes(q);
    };

    const filtrarEstatus = (p: ProductoLite) => {
      if (filters.estatus === "TODOS") return true;
      return p.estatus === (filters.estatus as ProductoEstatus);
    };

    const filtrarCategoria = (p: ProductoLite) => {
      if (filters.idCategoria === "TODOS") return true;
      return p.id_categoria === Number(filters.idCategoria);
    };

    return items.filter(
      (p) =>
        filtrarTexto(p) &&
        filtrarEstatus(p) &&
        filtrarCategoria(p),
    );
  }, [items, filters]);

  const total = itemsFiltrados.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const itemsPagina = useMemo(() => {
    const start = page * pageSize;
    return itemsFiltrados.slice(start, start + pageSize);
  }, [itemsFiltrados, page, pageSize]);

  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  const resumen = useMemo(() => {
    const activos = itemsFiltrados.filter((x) => x.estatus === "ACTIVO").length;
    const inactivos = itemsFiltrados.filter((x) => x.estatus === "INACTIVO").length;
    return { activos, inactivos, total: itemsFiltrados.length };
  }, [itemsFiltrados]);

  function updateFilters(patch: Partial<ProductosFiltersState>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }

  return {
    filters,
    updateFilters,
    page,
    setPage,
    totalPages,
    from,
    to,
    total,
    itemsPagina,
    resumen,
  };
}