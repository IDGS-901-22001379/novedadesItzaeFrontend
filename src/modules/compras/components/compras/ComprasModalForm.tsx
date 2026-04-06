// src/modules/compras/components/compras/ComprasModalForm.tsx
// Modal contenedor para formularios del módulo Compras.
// Responsabilidades: abrir/cerrar modal, pintar header con el color del tema y renderizar children.
// Nota: este modal es más grande que el de Usuarios para permitir capturar compras con muchos productos.

import type { ReactNode } from "react";
import type { ComprasTheme } from "../../theme/comprasTheme";

type Props = {
  open: boolean;
  title: string;
  theme: ComprasTheme;
  onClose: () => void;
  children: ReactNode;
};

export default function ComprasModalForm({
  open,
  title,
  theme,
  onClose,
  children,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">
        {/* Header con el mismo color del tema que la tabla */}
        <div
          className={`flex items-center justify-between px-5 py-4 ${theme.headerBg} ${theme.headerText}`}
        >
          <div className="text-lg font-extrabold">{title}</div>

          {/* X roja */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-base font-extrabold text-red-200 hover:bg-white/10 hover:text-red-100"
            aria-label="Cerrar"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body con scroll interno y colores forzados */}
        <div
          className={[
            "max-h-[80vh] overflow-y-auto bg-white p-5 text-slate-900",
            "[&_label]:text-slate-900",
            "[&_input]:text-slate-900",
            "[&_select]:text-slate-900",
            "[&_textarea]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
            "[&_textarea::placeholder]:text-slate-400",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
