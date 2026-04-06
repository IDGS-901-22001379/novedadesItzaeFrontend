// src/modules/creditos/components/creditos/CreditosFilters.tsx
// Panel de filtros del listado de Créditos.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { CreditoEstado } from "../../types/creditos.types";
import type { CreditosTheme } from "../../theme/creditosTheme";

export type CreditosFiltersState = {
  q: string;
  estado: "TODOS" | CreditoEstado;
  idCliente: string;
  idVenta: string;
  vencidosSolo: boolean;
  fechaVencimientoDesde: string;
  fechaVencimientoHasta: string;
};

type Props = {
  theme: CreditosTheme;
  filters: CreditosFiltersState;
  onChange: (patch: Partial<CreditosFiltersState>) => void;
};

export default function CreditosFilters({ theme, filters, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por crédito, venta, cliente o estado..."
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
              estado: e.target.value as CreditosFiltersState["estado"],
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
          <option value="PENDIENTE">Pendiente</option>
          <option value="PARCIAL">Parcial</option>
          <option value="PAGADO">Pagado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">ID cliente</label>
        <input
          type="number"
          min="1"
          value={filters.idCliente}
          onChange={(e) => onChange({ idCliente: e.target.value })}
          placeholder="Ej. 10"
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
        <label className="text-xs font-extrabold">ID venta</label>
        <input
          type="number"
          min="1"
          value={filters.idVenta}
          onChange={(e) => onChange({ idVenta: e.target.value })}
          placeholder="Ej. 66"
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
        <label className="text-xs font-extrabold">Vencimiento desde</label>
        <input
          type="date"
          value={filters.fechaVencimientoDesde}
          onChange={(e) => onChange({ fechaVencimientoDesde: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Vencimiento hasta</label>
        <input
          type="date"
          value={filters.fechaVencimientoHasta}
          onChange={(e) => onChange({ fechaVencimientoHasta: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        />
      </div>

      <div className="md:col-span-3">
        <label className="inline-flex items-center gap-2 text-sm font-extrabold">
          <input
            type="checkbox"
            checked={filters.vencidosSolo}
            onChange={(e) => onChange({ vencidosSolo: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          Solo vencidos
        </label>
      </div>
    </div>
  );
}
