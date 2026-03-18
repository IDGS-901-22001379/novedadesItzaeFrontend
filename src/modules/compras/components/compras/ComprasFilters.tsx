// src/modules/compras/components/compras/ComprasFilters.tsx
// Panel de filtros del listado de Compras.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { ComprasTheme } from "../../theme/comprasTheme";

export type ComprasFiltersState = {
  q: string;
  idProveedor: "TODOS" | string;
  idUbicacionDestino: "TODOS" | string;
  desde: string;
  hasta: string;
};

type Props = {
  theme: ComprasTheme;
  filters: ComprasFiltersState;
  onChange: (patch: Partial<ComprasFiltersState>) => void;
};

export default function ComprasFilters({ theme, filters, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por proveedor, documento de referencia u observaciones..."
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
          ].join(" ")}
        />
      </div>
    </div>
  );
}
