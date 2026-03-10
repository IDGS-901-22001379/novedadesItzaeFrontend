// src/modules/inventario_sucursales/components/inventario_sucursales/InventarioSucursalesFilters.tsx
// Panel de filtros del listado de Inventario - Sucursales.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { InventarioSucursalesTheme } from "../../theme/inventarioSucursalesTheme";

export type InventarioSucursalesFiltersState = {
  q: string;
  estatus: "TODOS" | "ACTIVO" | "INACTIVO";
};

type Props = {
  theme: InventarioSucursalesTheme;
  filters: InventarioSucursalesFiltersState;
  onChange: (patch: Partial<InventarioSucursalesFiltersState>) => void;
};

export default function InventarioSucursalesFilters({
  theme,
  filters,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por código, nombre o id..."
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
        <label className="text-xs font-extrabold">Estatus</label>
        <select
          value={filters.estatus}
          onChange={(e) =>
            onChange({
              estatus: e.target
                .value as InventarioSucursalesFiltersState["estatus"],
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
    </div>
  );
}
