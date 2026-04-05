// src/modules/devoluciones_cancelaciones/components/devoluciones_cancelaciones/DevolucionesModalForm.tsx
// Modal contenedor para formularios del módulo Devoluciones/Cancelaciones.
// Responsabilidades: abrir/cerrar modal, pintar header con el color del tema y renderizar children.
// Ajuste responsive:
// - Limita la altura del modal según la ventana.
// - Agrega scroll vertical al body cuando el formulario es largo.
// - Fuerza colores claros y legibles dentro del body, incluso si el tema general es oscuro.

import type { ReactNode } from "react";
import type { DevolucionesCancelacionesTheme } from "../../theme/devolucionesCancelacionesTheme";

type Props = {
  open: boolean;
  title: string;
  theme: DevolucionesCancelacionesTheme;
  onClose: () => void;
  children: ReactNode;
};

export default function DevolucionesModalForm({
  open,
  title,
  theme,
  onClose,
  children,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative flex w-full max-w-2xl max-h-[92vh] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">
        {/* Header con el mismo color del tema que la tabla */}
        <div
          className={`flex shrink-0 items-center justify-between px-5 py-4 ${theme.headerBg} ${theme.headerText}`}
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

        {/* Body con scroll y colores forzados a claros/legibles */}
        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto bg-white p-5 text-slate-900",
            "[&_label]:text-slate-900",
            "[&_input]:text-slate-900",
            "[&_select]:text-slate-900",
            "[&_textarea]:text-slate-900",
            "[&_input]:bg-white",
            "[&_select]:bg-white",
            "[&_textarea]:bg-white",
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
