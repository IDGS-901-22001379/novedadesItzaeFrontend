// src/modules/dashboard/components/filtros/DashboardGlobalFilters.tsx
// Filtros globales del dashboard.
// Responsabilidades:
// - renderizar filtros globales que aplican a todo el dashboard
// - permitir cambiar fecha desde, fecha hasta y top N
// - permitir cambiar el periodo rápido (día, semana, mes)
// - permitir mostrar u ocultar montos con botón tipo ojo
// - mantener una barra compacta integrada al encabezado, sin panel blanco independiente

import { Eye, EyeOff } from "lucide-react";
import type { DashboardTheme } from "../../theme/dashboardTheme";
import type {
  DashboardGlobalFiltersProps,
  DashboardPeriodo,
} from "../../types/shared/dashboard_filters.types";

type Props = DashboardGlobalFiltersProps & {
  theme: DashboardTheme;
};

const PERIODOS: Array<{ key: DashboardPeriodo; label: string }> = [
  { key: "dia", label: "Día" },
  { key: "semana", label: "Semana" },
  { key: "mes", label: "Mes" },
];

export default function DashboardGlobalFilters({ value, onChange }: Props) {
  function patch<K extends keyof typeof value>(key: K, val: (typeof value)[K]) {
    onChange({
      ...value,
      [key]: val,
    });
  }

  return (
    <div className="flex flex-wrap items-end justify-end gap-3">
      <div className="min-w-[150px]">
        <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-white/90">
          Desde
        </label>
        <input
          type="date"
          value={value.fechaDesde}
          onChange={(e) => patch("fechaDesde", e.target.value)}
          className="w-full rounded-xl border border-[#b9d4ff] bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition hover:bg-[#eef5ff] focus:border-[#8fb8ff] focus:ring-2 focus:ring-[#cfe1ff]"
        />
      </div>

      <div className="min-w-[150px]">
        <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-white/90">
          Hasta
        </label>
        <input
          type="date"
          value={value.fechaHasta}
          onChange={(e) => patch("fechaHasta", e.target.value)}
          className="w-full rounded-xl border border-[#b9d4ff] bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition hover:bg-[#eef5ff] focus:border-[#8fb8ff] focus:ring-2 focus:ring-[#cfe1ff]"
        />
      </div>

      <div className="min-w-[110px]">
        <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-white/90">
          Top N
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={value.topN}
          onChange={(e) => patch("topN", Number(e.target.value || 1))}
          className="w-full rounded-xl border border-[#b9d4ff] bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition hover:bg-[#eef5ff] focus:border-[#8fb8ff] focus:ring-2 focus:ring-[#cfe1ff]"
        />
      </div>

      <div className="min-w-[145px]">
        <label className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-white/90">
          Montos
        </label>
        <button
          type="button"
          onClick={() => patch("mostrarMontos", !value.mostrarMontos)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#b9d4ff] bg-white px-3 py-2 text-sm font-extrabold text-slate-900 transition hover:bg-[#eef5ff]"
          title={value.mostrarMontos ? "Ocultar montos" : "Mostrar montos"}
        >
          {value.mostrarMontos ? (
            <Eye className="h-4 w-4 text-slate-700" />
          ) : (
            <EyeOff className="h-4 w-4 text-slate-700" />
          )}
          <span>{value.mostrarMontos ? "Mostrar" : "Oculto"}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 pl-1">
        {PERIODOS.map((item) => {
          const active = value.periodo === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => patch("periodo", item.key)}
              className={[
                "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition",
                active
                  ? "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]"
                  : "border border-[#b9d4ff] bg-white text-slate-900 hover:bg-[#eef5ff]",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
