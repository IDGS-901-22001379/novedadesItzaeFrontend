// src/modules/caja/components/caja/CajaFilters.tsx
// Panel de filtros del listado de Cajas.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { CajaTheme } from "../../theme/cajaTheme";

export type CajaFiltersState = {
  q: string;
  activo: "TODAS" | "ACTIVAS" | "INACTIVAS";
  idSucursal: "TODAS" | string;
};

type SucursalOption = {
  id: number;
  label: string;
};

type Props = {
  theme: CajaTheme;
  filters: CajaFiltersState;
  sucursalesDisponibles: SucursalOption[];
  onChange: (patch: Partial<CajaFiltersState>) => void;
};

export default function CajaFilters({
  theme,
  filters,
  sucursalesDisponibles,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por nombre, código, id de caja o sucursal..."
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
        <label className="text-xs font-extrabold">Estado</label>
        <select
          value={filters.activo}
          onChange={(e) =>
            onChange({
              activo: e.target.value as CajaFiltersState["activo"],
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
          <option value="ACTIVAS">Activas</option>
          <option value="INACTIVAS">Inactivas</option>
        </select>
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
    </div>
  );
}
