// src/modules/inventario_existencias/components/inventario_existencias/InventarioExistenciasFilters.tsx
// Panel de filtros del listado de Inventario Existencias.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { InventarioExistenciasTheme } from "../../theme/inventarioExistenciasTheme";

export type EstadoProductosFilter = "ACTIVOS" | "INACTIVOS" | "TODOS";

export type InventarioExistenciasFiltersState = {
  q: string;
  idSucursal: "TODAS" | string;
  idUbicacion: "TODAS" | string;
  estadoProductos: EstadoProductosFilter;
};

export type SucursalOption = {
  id: number;
  nombre: string;
};

export type UbicacionOption = {
  id: number;
  nombre: string;
  tipo?: string | null;
  sucursalNombre?: string | null;
};

type Props = {
  theme: InventarioExistenciasTheme;
  filters: InventarioExistenciasFiltersState;
  sucursalesDisponibles: SucursalOption[];
  ubicacionesDisponibles: UbicacionOption[];
  onChange: (patch: Partial<InventarioExistenciasFiltersState>) => void;
};

function ordenarUbicaciones(ubicaciones: UbicacionOption[]) {
  const tiendas = ubicaciones
    .filter((u) => (u.tipo ?? "").toUpperCase() === "TIENDA")
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  const bodegas = ubicaciones
    .filter((u) => (u.tipo ?? "").toUpperCase() !== "TIENDA")
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return [...tiendas, ...bodegas];
}

function buildUbicacionLabel(
  ubicacion: UbicacionOption,
  mostrarSucursal: boolean,
): string {
  const tipo =
    (ubicacion.tipo ?? "").toUpperCase() === "TIENDA" ? "Tienda" : "Bodega";

  if (mostrarSucursal && ubicacion.sucursalNombre?.trim()) {
    return `${tipo} - ${ubicacion.nombre} · ${ubicacion.sucursalNombre}`;
  }

  return `${tipo} - ${ubicacion.nombre}`;
}

export default function InventarioExistenciasFilters({
  theme,
  filters,
  sucursalesDisponibles,
  ubicacionesDisponibles,
  onChange,
}: Props) {
  const ubicacionesOrdenadas = ordenarUbicaciones(ubicacionesDisponibles);
  const mostrarSucursalEnUbicacion = filters.idSucursal === "TODAS";

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por producto, código de barras, SKU o modelo..."
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
            theme.inputPlaceholder,
          ].join(" ")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Sucursal</label>
        <select
          value={filters.idSucursal}
          onChange={(e) =>
            onChange({
              idSucursal: e.target.value,
              idUbicacion: "TODAS",
            })
          }
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="TODAS">Todas</option>

          {sucursalesDisponibles.map((sucursal) => (
            <option key={sucursal.id} value={String(sucursal.id)}>
              {sucursal.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Ubicación</label>
        <select
          value={filters.idUbicacion}
          onChange={(e) => onChange({ idUbicacion: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="TODAS">Todas</option>

          {ubicacionesOrdenadas.map((ubicacion) => (
            <option key={ubicacion.id} value={String(ubicacion.id)}>
              {buildUbicacionLabel(ubicacion, mostrarSucursalEnUbicacion)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Estado de productos</label>
        <select
          value={filters.estadoProductos}
          onChange={(e) =>
            onChange({
              estadoProductos: e.target.value as EstadoProductosFilter,
            })
          }
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="ACTIVOS">Activos</option>
          <option value="INACTIVOS">Inactivos</option>
          <option value="TODOS">Todos</option>
        </select>
      </div>
    </div>
  );
}
