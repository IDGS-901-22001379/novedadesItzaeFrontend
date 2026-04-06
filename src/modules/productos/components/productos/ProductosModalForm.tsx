// src/modules/productos/components/productos/ProductosModalForm.tsx
// Modal contenedor para formularios del módulo Productos.
// Responsabilidades: abrir/cerrar modal, pintar header con el color del tema y renderizar children.
// Nota: Es responsivo y, si el contenido es grande, el body tiene scroll.

import type { ReactNode } from "react";
import type { ProductosTheme } from "../../theme/productosTheme";

type Props = {
  open: boolean;
  title: string;
  theme: ProductosTheme;
  onClose: () => void;
  children: ReactNode;
};

export default function ProductosModalForm({
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

      {/* Contenedor grande + alto máximo para que sea responsivo */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl">
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

        {/* Body con scroll interno (cuando hay muchos campos) y colores forzados */}
        <div
          className={[
            "max-h-[85vh] overflow-y-auto bg-white p-4 text-slate-900 sm:p-5 md:p-6",
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
