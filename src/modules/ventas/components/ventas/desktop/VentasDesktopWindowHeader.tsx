// src/modules/ventas/components/ventas/desktop/VentasDesktopWindowHeader.tsx
// Header de la ventana escritorio de ventas.
// Responsabilidades:
// - Mostrar el título de la ventana.
// - Permitir mover la ventana desde la barra.
// - Mostrar botones de minimizar, maximizar/restaurar y cerrar.

import type { VentasDesktopWindowHeaderProps } from "./ventasDesktopWindow.types";

export default function VentasDesktopWindowHeader({
  title,
  theme,
  isMaximized,
  onRequestClose,
  onToggleMaximize,
  onMinimize,
  onStartDrag,
}: VentasDesktopWindowHeaderProps) {
  return (
    <div
      className={`flex h-10.5 cursor-move items-center justify-between rounded-t-[20px] border-b border-white/15 px-4 ${theme.headerBg} ${theme.headerText}`}
      onMouseDown={onStartDrag}
    >
      <div className="select-none text-sm font-extrabold tracking-tight">
        {title}
      </div>

      <div className="flex items-center gap-2">
        {/* Minimizar */}
        <button
          type="button"
          data-window-button="true"
          onClick={onMinimize}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffd54a] text-xs font-black text-[#6b5200] shadow-sm transition hover:scale-105 hover:bg-[#ffcb2e]"
          aria-label="Minimizar"
          title="Minimizar"
        >
          −
        </button>

        {/* Maximizar / Restaurar */}
        <button
          type="button"
          data-window-button="true"
          onClick={onToggleMaximize}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-[#26ff4a] text-[10px] font-black text-[#006b16] shadow-sm transition hover:scale-105 hover:bg-[#19f140]"
          aria-label={isMaximized ? "Restaurar tamaño" : "Maximizar"}
          title={isMaximized ? "Restaurar tamaño" : "Maximizar"}
        >
          {isMaximized ? (
            <span className="relative block h-3 w-3">
              <span className="absolute right-0 top-0 h-2 w-2 border border-current bg-transparent" />
              <span className="absolute bottom-0 left-0 h-2 w-2 border border-current bg-transparent" />
            </span>
          ) : (
            <span className="block h-2.5 w-2.5 border border-current bg-transparent" />
          )}
        </button>

        {/* Cerrar */}
        <button
          type="button"
          data-window-button="true"
          onClick={onRequestClose}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b6b] text-xs font-black text-[#7a0000] shadow-sm transition hover:scale-105 hover:bg-[#ff5a5a]"
          aria-label="Cerrar"
          title="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
