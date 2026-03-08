// src/modules/productos/components/productos/ProductosFilters.tsx
// Panel de filtros del listado de Productos.
// Responsabilidades:
// - Renderizar inputs/selects.
// - Notificar cambios al padre con onChange(patch).
//
// Ajustes de UI:
// - La Búsqueda va sola en una fila (a lo ancho).
// - Abajo van selects compactos (Sucursal/Estatus/Categoría/Proveedor).
// - Sucursal: POR DEFECTO debe ser "TODAS" (ya no existe "Principal").
// - La búsqueda visual debe indicar que también puede buscar por modelo.

import type { ProductoEstatus } from "../../types/productos.types";
import type { ProductosTheme } from "../../theme/productosTheme";

export type ProductosFiltersState = {
  q: string;
  estatus: "TODOS" | ProductoEstatus;

  // Se manejan como string para que el <select> sea simple ("TODOS" | "1" | "2"...)
  idCategoria: "TODOS" | string;
  idProveedor: "TODOS" | string;

  // Sucursal:
  // - "TODAS": suma existencias de todas las sucursales activas
  // - "15", "16", etc: una sucursal específica
  idSucursal: "TODAS" | string;
};

export type CategoriaOption = { id_categoria: number; nombre: string };
export type ProveedorOption = { id_proveedor: number; nombre: string };
export type SucursalOption = {
  id_sucursal: number;
  nombre: string;
  activo: boolean;
};

type Props = {
  theme: ProductosTheme;
  filters: ProductosFiltersState;

  categoriasDisponibles: CategoriaOption[];
  proveedoresDisponibles: ProveedorOption[];
  sucursalesDisponibles: SucursalOption[];

  onChange: (patch: Partial<ProductosFiltersState>) => void;
};

export default function ProductosFilters({
  theme,
  filters,
  categoriasDisponibles,
  proveedoresDisponibles,
  sucursalesDisponibles,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Búsqueda (sola en una fila) */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por nombre, modelo, SKU, código de barras o descripción..."
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
            theme.inputPlaceholder,
          ].join(" ")}
        />
      </div>

      {/* Selects compactos */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {/* Sucursal (stock por sucursal) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Sucursal</label>
          <select
            value={filters.idSucursal}
            onChange={(e) => onChange({ idSucursal: e.target.value })}
            className={[
              "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
              theme.inputBorder,
              theme.inputFocusRing,
              theme.inputText,
            ].join(" ")}
          >
            <option value="TODAS">Todas</option>

            {(sucursalesDisponibles ?? [])
              .filter((s) => s.activo)
              .map((s) => (
                <option key={s.id_sucursal} value={String(s.id_sucursal)}>
                  {s.nombre}
                </option>
              ))}
          </select>
        </div>

        {/* Estatus */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Estatus</label>
          <select
            value={filters.estatus}
            onChange={(e) =>
              onChange({
                estatus: e.target.value as ProductosFiltersState["estatus"],
              })
            }
            className={[
              "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
              theme.inputBorder,
              theme.inputFocusRing,
              theme.inputText,
            ].join(" ")}
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Categoría</label>
          <select
            value={filters.idCategoria}
            onChange={(e) => onChange({ idCategoria: e.target.value })}
            className={[
              "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
              theme.inputBorder,
              theme.inputFocusRing,
              theme.inputText,
            ].join(" ")}
          >
            <option value="TODOS">Todas</option>
            {(categoriasDisponibles ?? []).map((c) => (
              <option key={c.id_categoria} value={String(c.id_categoria)}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Proveedor */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Proveedor</label>
          <select
            value={filters.idProveedor}
            onChange={(e) => onChange({ idProveedor: e.target.value })}
            className={[
              "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
              theme.inputBorder,
              theme.inputFocusRing,
              theme.inputText,
            ].join(" ")}
          >
            <option value="TODOS">Todos</option>
            {(proveedoresDisponibles ?? []).map((p) => (
              <option key={p.id_proveedor} value={String(p.id_proveedor)}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
