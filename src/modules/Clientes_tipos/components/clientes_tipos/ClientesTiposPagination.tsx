// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposPagination.tsx
// Paginación del listado de Clientes Tipos.
// Responsabilidades: navegar páginas y mostrar rango actual.

import type { ClientesTiposTheme } from "../../theme/clientesTiposTheme";

type Props = {
  theme: ClientesTiposTheme;
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function ClientesTiposPagination({
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
    <div className="mx-auto mt-4 flex max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-center text-xs sm:text-sm font-semibold text-black/70 sm:text-left">
        Mostrando <span className="font-extrabold">{from}</span> a{" "}
        <span className="font-extrabold">{to}</span> de{" "}
        <span className="font-extrabold">{total}</span>
      </div>

      <div className="flex items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 0}
          className={[
            "rounded-xl border px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-extrabold disabled:opacity-50",
            theme.btnReloadBorder,
            theme.btnReloadBg,
            theme.btnReloadText,
            theme.btnReloadHover,
          ].join(" ")}
        >
          Anterior
        </button>

        <div className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm font-extrabold text-black/70">
          {page + 1} / {totalPages}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages - 1}
          className={[
            "rounded-xl border px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-extrabold disabled:opacity-50",
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
