// src/modules/traspasos/components/traspasos/TraspasosFilters.tsx
// Panel de filtros del listado de Traspasos.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { TraspasosTheme } from "../../theme/traspasosTheme";

export type TraspasosFiltersState = {
  desde: string;
  hasta: string;
  idSucursal: "TODOS" | string;
};

export type SucursalOption = {
  id: number;
  label: string;
};

type Props = {
  theme: TraspasosTheme;
  filters: TraspasosFiltersState;
  sucursalesDisponibles?: SucursalOption[];
  onChange: (patch: Partial<TraspasosFiltersState>) => void;
};

export default function TraspasosFilters({
  theme,
  filters,
  sucursalesDisponibles = [],
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Desde</label>
        <input
          type="datetime-local"
          value={filters.desde}
          onChange={(e) => onChange({ desde: e.target.value })}
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
        <label className="text-xs font-extrabold">Hasta</label>
        <input
          type="datetime-local"
          value={filters.hasta}
          onChange={(e) => onChange({ hasta: e.target.value })}
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
          <option value="TODOS">Todas</option>
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
