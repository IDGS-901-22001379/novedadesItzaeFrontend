// src/modules/ventas/components/ventas/VentasDesktopWindow.tsx
// Ventana escritorio de ventas.
// Responsabilidades:
// - Conectar el hook de lógica de ventana.
// - Renderizar frame, header, contenido y confirmación de cierre.
// - Mantener el contenido montado aunque la ventana esté minimizada.

import type { VentasDesktopWindowProps } from "./desktop/ventasDesktopWindow.types";
import VentasDesktopWindowFrame from "./desktop/VentasDesktopWindowFrame";
import VentasDesktopWindowHeader from "./desktop/VentasDesktopWindowHeader";
import VentasDesktopWindowConfirmClose from "./desktop/VentasDesktopWindowConfirmClose";
import { useVentasDesktopWindow } from "./desktop/useVentasDesktopWindow";

export default function VentasDesktopWindow(props: VentasDesktopWindowProps) {
  const vm = useVentasDesktopWindow(props);

  return (
    <>
      {/* Mantiene vivo el contenido cuando la ventana está minimizada */}
      <div
        style={{ display: props.minimized ? "block" : "none" }}
        className="hidden"
      >
        {props.children}
      </div>

      {!props.minimized ? (
        <VentasDesktopWindowFrame
          rect={vm.rect}
          zIndex={props.zIndex}
          onFocus={vm.focus}
        >
          <VentasDesktopWindowHeader
            title={props.title}
            theme={props.theme}
            isMaximized={vm.isMaximized}
            onRequestClose={vm.requestClose}
            onToggleMaximize={vm.toggleMaximize}
            onMinimize={vm.minimize}
            onStartDrag={vm.startDrag}
          />

          <div className="overflow-auto p-5" style={{ height: vm.bodyHeight }}>
            {props.children}
          </div>

          <VentasDesktopWindowConfirmClose
            open={vm.showCloseConfirm}
            saving={vm.savingAndClosing}
            onCancel={vm.cancelCloseConfirm}
            onCloseWithoutSave={vm.closeWithoutSave}
            onSaveAndClose={vm.saveAndClose}
          />

          {/* Bordes y esquinas para redimensionar cuando no está maximizada */}
          {!vm.isMaximized && (
            <>
              <div
                className="absolute left-0 top-0 h-2 w-full cursor-n-resize"
                onMouseDown={(e) => vm.startResize("n", e)}
              />
              <div
                className="absolute bottom-0 left-0 h-2 w-full cursor-s-resize"
                onMouseDown={(e) => vm.startResize("s", e)}
              />
              <div
                className="absolute left-0 top-0 h-full w-2 cursor-w-resize"
                onMouseDown={(e) => vm.startResize("w", e)}
              />
              <div
                className="absolute right-0 top-0 h-full w-2 cursor-e-resize"
                onMouseDown={(e) => vm.startResize("e", e)}
              />

              <div
                className="absolute left-0 top-0 h-4 w-4 cursor-nwse-resize"
                onMouseDown={(e) => vm.startResize("nw", e)}
              />
              <div
                className="absolute right-0 top-0 h-4 w-4 cursor-nesw-resize"
                onMouseDown={(e) => vm.startResize("ne", e)}
              />
              <div
                className="absolute bottom-0 left-0 h-4 w-4 cursor-nesw-resize"
                onMouseDown={(e) => vm.startResize("sw", e)}
              />
              <div
                className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
                onMouseDown={(e) => vm.startResize("se", e)}
              />
            </>
          )}
        </VentasDesktopWindowFrame>
      ) : null}
    </>
  );
}
