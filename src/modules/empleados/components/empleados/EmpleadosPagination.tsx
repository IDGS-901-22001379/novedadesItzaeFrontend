// src/modules/empleados/components/empleados/EmpleadosPagination.tsx
// Paginación del listado de Empleados.
// Responsabilidades: navegar páginas y mostrar rango actual.
// Nota: Empleados usa paginación 1-based (page inicia en 1).

import type { EmpleadosTheme } from "../../theme/empleadosTheme";

type Props = {
  theme: EmpleadosTheme;
  page: number; // 1..n
  totalPages: number; // 1..n
  from: number;
  to: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function EmpleadosPagination({
  theme,
  page,
  totalPages,
  from,
  to,
  total,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm font-semibold text-black/70">
        Mostrando <span className="font-extrabold">{from}</span> a{" "}
        <span className="font-extrabold">{to}</span> de{" "}
        <span className="font-extrabold">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-extrabold disabled:opacity-50",
            theme.btnReloadBorder,
            theme.btnReloadBg,
            theme.btnReloadText,
            theme.btnReloadHover,
          ].join(" ")}
        >
          Anterior
        </button>

        <div className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-extrabold text-black/70">
          {page} / {totalPages}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-extrabold disabled:opacity-50",
            theme.btnReloadBorder,
            theme.btnReloadBg,
            theme.btnReloadText,
            theme.btnReloadHover,
          ].join(" ")}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
