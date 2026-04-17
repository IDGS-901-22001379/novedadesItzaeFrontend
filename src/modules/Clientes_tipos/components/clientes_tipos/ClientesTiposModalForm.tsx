// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposModalForm.tsx
// Modal contenedor para formularios del módulo Clientes Tipos.
// Responsabilidades: abrir/cerrar modal, pintar header con el color del tema y renderizar children.
// Nota UI: el body del modal es responsive y activa scroll vertical en pantallas pequeñas.

import type { ReactNode } from "react";
import type { ClientesTiposTheme } from "../../theme/clientesTiposTheme";

type Props = {
  open: boolean;
  title: string;
  theme: ClientesTiposTheme;
  onClose: () => void;
  children: ReactNode;
};

export default function ClientesTiposModalForm({
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

      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">
        {/* Header con el mismo color del tema que la tabla */}
        <div
          className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 ${theme.headerBg} ${theme.headerText}`}
        >
          <div className="text-base sm:text-lg font-extrabold">{title}</div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base font-extrabold text-red-200 hover:bg-white/10 hover:text-red-100"
            aria-label="Cerrar"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

<<<<<<< Updated upstream
        {/* Body */}
        <div className="p-4 sm:p-5">{children}</div>
=======
        {/* Body responsive con scroll vertical */}
        <div
          className={[
            "flex-1 overflow-y-auto bg-white p-4 text-slate-900 sm:p-5",
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
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
