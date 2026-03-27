// src/modules/ventas/components/ventas/desktop/VentasDesktopWindowFrame.tsx
// Frame principal de la ventana escritorio de ventas.
// Responsabilidades:
// - Aplicar posición, tamaño y z-index.
// - Envolver visualmente el contenido de la ventana.
// - Avisar cuando la ventana recibe foco.

import type { VentasDesktopWindowFrameProps } from "./ventasDesktopWindow.types";

export default function VentasDesktopWindowFrame({
  rect,
  zIndex,
  children,
  onFocus,
}: VentasDesktopWindowFrameProps) {
  return (
    <div
      className="fixed rounded-[20px] border border-black/10 bg-white shadow-2xl"
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
