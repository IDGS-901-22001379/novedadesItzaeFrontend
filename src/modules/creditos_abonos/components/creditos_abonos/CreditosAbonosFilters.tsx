// src/modules/creditos_abonos/components/creditos_abonos/CreditosAbonosFilters.tsx
// Panel de filtros del listado de Créditos Abonos.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { AbonoCreditoEstatus } from "../../types/creditos_abonos.types";
import type { CreditosAbonosTheme } from "../../theme/creditosAbonosTheme";

export type CreditosAbonosFiltersState = {
  q: string;
  estatus: "TODOS" | AbonoCreditoEstatus;
  idFormaPago: "TODOS" | string;
  idCliente: string;
};

type Props = {
  theme: CreditosAbonosTheme;
  filters: CreditosAbonosFiltersState;
  onChange: (patch: Partial<CreditosAbonosFiltersState>) => void;
};

export default function CreditosAbonosFilters({
  theme,
  filters,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por folio, id abono, id cliente o monto..."
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
              estatus: e.target.value as CreditosAbonosFiltersState["estatus"],
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
          <option value="REGISTRADO">Registrado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Forma de pago</label>
        <select
          value={filters.idFormaPago}
          onChange={(e) => onChange({ idFormaPago: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="TODOS">Todas</option>
          <option value="1">Efectivo</option>
          <option value="2">Transferencia</option>
          <option value="3">Tarjeta</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Id cliente</label>
        <input
          value={filters.idCliente}
          onChange={(e) => onChange({ idCliente: e.target.value })}
          placeholder="Filtrar por id cliente..."
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
            theme.inputPlaceholder,
          ].join(" ")}
        />
      </div>
    </div>
  );
}
