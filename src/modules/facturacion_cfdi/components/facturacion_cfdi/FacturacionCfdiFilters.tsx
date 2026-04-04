// src/modules/facturacion_cfdi/components/facturacion_cfdi/FacturacionCfdiFilters.tsx
// Panel de filtros del listado de Facturación CFDI.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { FacturaEstado } from "../../types/facturacion_cfdi.types";
import type { FacturacionCfdiTheme } from "../../theme/facturacionCfdiTheme";

export type FacturacionCfdiFiltersState = {
  q: string;
  estado: "TODOS" | FacturaEstado;
  desde: string;
  hasta: string;
};

type Props = {
  theme: FacturacionCfdiTheme;
  filters: FacturacionCfdiFiltersState;
  onChange: (patch: Partial<FacturacionCfdiFiltersState>) => void;
};

export default function FacturacionCfdiFilters({
  theme,
  filters,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por id factura, venta, UUID, serie o folio..."
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
          value={filters.estado}
          onChange={(e) =>
            onChange({
              estado: e.target.value as FacturacionCfdiFiltersState["estado"],
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
          <option value="EMITIDA">Emitida</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="ERROR">Error</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Desde</label>
        <input
          type="date"
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
          type="date"
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
