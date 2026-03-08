// src/modules/productos/components/productos/form/ProductosSection.tsx
// Sección colapsable tipo acordeón.
// Responsabilidades:
// - Mostrar un header con el color del módulo (mismo que el encabezado del modal).
// - Permitir expandir/contraer el contenido.
// - Mantener el contenido con scroll si es grande.

import type { ReactNode } from "react";
import type { ProductosTheme } from "../../../theme/productosTheme";

type Props = {
  theme: ProductosTheme;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;

  // opcional: deshabilita la interacción (ej. modo VER)
  disabled?: boolean;
};

export default function ProductosSection({
  theme,
  title,
  open,
  onToggle,
  children,
  disabled = false,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      {/* Header (mismo color que el encabezado del modal) */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={[
          "flex w-full items-center justify-between px-4 py-3 text-left",
          theme.headerBg,
          theme.headerText,
          disabled ? "opacity-80" : "hover:opacity-95",
        ].join(" ")}
      >
        <span className="text-sm font-extrabold">{title}</span>

        <span
          className={[
            "ml-3 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/20",
            "bg-white/10 text-white text-lg font-extrabold",
          ].join(" ")}
          aria-hidden="true"
        >
          {open ? "−" : "+"}
        </span>
      </button>

      {/* Body colapsable */}
      {open ? (
        <div className="max-h-[55vh] overflow-y-auto p-4">{children}</div>
      ) : null}
    </div>
  );
}
