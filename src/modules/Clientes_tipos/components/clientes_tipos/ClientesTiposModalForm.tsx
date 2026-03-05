// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposModalForm.tsx
// Modal contenedor para formularios del módulo Clientes Tipos.
// Responsabilidades: abrir/cerrar modal, pintar header con el color del tema y renderizar children.

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

      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">
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

        {/* Body */}
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
