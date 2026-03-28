// src/modules/ventas/components/ventas/desktop/ventasDesktopWindow.types.ts
// Tipos base de la ventana escritorio de ventas.
// Responsabilidades:
// - Definir rectángulo de posición/tamaño.
// - Definir direcciones de resize.
// - Definir props del contenedor principal.

import type { ReactNode } from "react";
import type { VentasTheme } from "../../../theme/ventasTheme";

export type DesktopRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DesktopResizeDirection =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

export type VentasDesktopWindowProps = {
  id: string;
  title: string;
  theme: VentasTheme;
  children: ReactNode;

  minimized: boolean;
  zIndex: number;

  initialRect?: DesktopRect;

  dirty?: boolean;
  onSaveAndClose?: () => void | Promise<void>;

  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onClose: (id: string) => void;
};

export type VentasDesktopWindowHeaderProps = {
  title: string;
  theme: VentasTheme;
  isMaximized: boolean;
  onRequestClose: () => void;
  onToggleMaximize: () => void;
  onMinimize: () => void;
  onStartDrag: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export type VentasDesktopWindowFrameProps = {
  rect: DesktopRect;
  zIndex: number;
  children: ReactNode;
  onFocus: () => void;
};

export type VentasDesktopWindowConfirmCloseProps = {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onCloseWithoutSave: () => void;
  onSaveAndClose: () => void | Promise<void>;
};