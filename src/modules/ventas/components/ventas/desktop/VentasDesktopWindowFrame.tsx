// src/modules/ventas/components/ventas/desktop/VentasDesktopWindowFrame.tsx
// Frame principal de la ventana escritorio de ventas.
// Responsabilidades:
// - Aplicar posición, tamaño y z-index.
// - Envolver visualmente el contenido de la ventana.
// - Avisar cuando la ventana recibe foco.
// Nota UI:
// - Mantiene el body de la ventana en fondo blanco.
// - Fuerza texto oscuro en labels, inputs, selects y textareas para evitar
//   que un tema oscuro deje letras blancas sobre fondo blanco.

import type { VentasDesktopWindowFrameProps } from "./ventasDesktopWindow.types";

export default function VentasDesktopWindowFrame({
  rect,
  zIndex,
  children,
  onFocus,
}: VentasDesktopWindowFrameProps) {
  return (
    <div
      className={[
        "fixed overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-2xl",
        "text-slate-900",
        "[&_label]:text-slate-900",
        "[&_input]:text-slate-900",
        "[&_select]:text-slate-900",
        "[&_textarea]:text-slate-900",
        "[&_input::placeholder]:text-slate-400",
        "[&_textarea::placeholder]:text-slate-400",
      ].join(" ")}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        zIndex,
      }}
      onMouseDown={onFocus}
    >
      {children}
    </div>
  );
}
