// src/modules/movimientos_inventario/components/movimientos_inventario/form/MovimientosSection.tsx
// Sección colapsable del formulario de Movimientos de Inventario.
// Responsabilidades:
// - mostrar un bloque con título
// - permitir abrir/cerrar contenido
// - mantener estilo consistente con el módulo

import type { ReactNode } from "react";
import type { MovimientosInventarioTheme } from "../../../theme/movimientosInventarioTheme";

type Props = {
  theme: MovimientosInventarioTheme;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  rightSlot?: ReactNode;
};

export default function MovimientosSection({
  theme,
  title,
  open,
  onToggle,
  children,
  rightSlot,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className={[
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition",
          theme.headerBg,
          theme.headerText,
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-extrabold">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          {rightSlot ? (
            <div
              className="hidden text-sm font-semibold opacity-95 sm:block"
              onClick={(e) => e.stopPropagation()}
            >
              {rightSlot}
            </div>
          ) : null}

          <span className="text-lg font-extrabold">{open ? "−" : "+"}</span>
        </div>
      </button>

      {open ? <div className="p-4">{children}</div> : null}
    </div>
  );
}
