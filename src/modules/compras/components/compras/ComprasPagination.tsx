// src/modules/compras/components/compras/ComprasPagination.tsx
// Paginación del listado de Compras.
// Responsabilidades: navegar páginas y mostrar rango actual.

import type { ComprasTheme } from "../../theme/comprasTheme";

type Props = {
  theme: ComprasTheme;
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function ComprasPagination({
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
          disabled={page <= 0}
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
          {page + 1} / {totalPages}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages - 1}
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
