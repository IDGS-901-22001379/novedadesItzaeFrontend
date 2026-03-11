// src/modules/inventario_ubicaciones/components/inventario_ubicaciones/InventarioUbicacionesFilters.tsx
// Panel de filtros del listado de Inventario - Ubicaciones.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { InventarioUbicacionesTheme } from "../../theme/inventarioUbicacionesTheme";
import type { InventarioUbicacionTipo } from "../../types/inventario_ubicaciones.types";

export type InventarioUbicacionesFiltersState = {
  q: string;
  idSucursal: "TODAS" | string;
  estatus: "TODOS" | "ACTIVO" | "INACTIVO";
  tipo: "TODOS" | InventarioUbicacionTipo;
  vendible: "TODOS" | "SI" | "NO";
};

export type SucursalOption = {
  id: number;
  label: string;
};

type Props = {
  theme: InventarioUbicacionesTheme;
  filters: InventarioUbicacionesFiltersState;
  sucursalesDisponibles: SucursalOption[];
  onChange: (patch: Partial<InventarioUbicacionesFiltersState>) => void;
};

export default function InventarioUbicacionesFilters({
  theme,
  filters,
  sucursalesDisponibles,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por nombre, código, tipo o id..."
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
          onChange={(e) => onChange({ idSucursal: e.target.value })}
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
              {sucursal.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Estatus</label>
        <select
          value={filters.estatus}
          onChange={(e) =>
            onChange({
              estatus: e.target
                .value as InventarioUbicacionesFiltersState["estatus"],
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

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Tipo</label>
        <select
          value={filters.tipo}
          onChange={(e) =>
            onChange({
              tipo: e.target.value as InventarioUbicacionesFiltersState["tipo"],
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
          <option value="TIENDA">Tienda</option>
          <option value="BODEGA">Bodega</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Vendible</label>
        <select
          value={filters.vendible}
          onChange={(e) =>
            onChange({
              vendible: e.target
                .value as InventarioUbicacionesFiltersState["vendible"],
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
          <option value="SI">Sí</option>
          <option value="NO">No</option>
        </select>
      </div>
    </div>
  );
}
