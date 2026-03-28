// src/modules/ventas/components/ventas/desktop/ventasDesktopWindow.utils.ts
// Utilidades de la ventana escritorio de ventas.
// Responsabilidades:
// - Calcular rectángulos iniciales y maximizados.
// - Limitar posiciones y tamaños dentro del viewport.
// - Evitar repetir lógica geométrica en el componente principal.

import type { DesktopRect } from "./ventasDesktopWindow.types";
import {
  DESKTOP_WINDOW_DEFAULT_HEIGHT,
  DESKTOP_WINDOW_DEFAULT_WIDTH,
  DESKTOP_WINDOW_MIN_HEIGHT,
  DESKTOP_WINDOW_MIN_WIDTH,
  DESKTOP_WINDOW_VIEWPORT_MARGIN,
} from "./ventasDesktopWindow.constants";

// Limita un valor entre un mínimo y un máximo.
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Rectángulo maximizado dejando un pequeño margen al rededor.
export function getMaximizedRect(): DesktopRect {
  return {
    x: DESKTOP_WINDOW_VIEWPORT_MARGIN,
    y: DESKTOP_WINDOW_VIEWPORT_MARGIN,
    width: window.innerWidth - DESKTOP_WINDOW_VIEWPORT_MARGIN * 2,
    height: window.innerHeight - DESKTOP_WINDOW_VIEWPORT_MARGIN * 2,
  };
}

// Construye una ventana grande, centrada y casi de pantalla completa.
export function buildInitialDesktopRect(): DesktopRect {
  if (typeof window === "undefined") {
    return {
      x: 24,
      y: 18,
      width: DESKTOP_WINDOW_DEFAULT_WIDTH,
      height: DESKTOP_WINDOW_DEFAULT_HEIGHT,
    };
  }

  const width = Math.max(
    DESKTOP_WINDOW_MIN_WIDTH,
    window.innerWidth - 48,
  );

  const height = Math.max(
    DESKTOP_WINDOW_MIN_HEIGHT,
    window.innerHeight - 36,
  );

  const x = Math.max(20, Math.round((window.innerWidth - width) / 2));
  const y = 18;

  return {
    x,
    y,
    width,
    height,
  };
}

// Ajusta una posición para que la ventana no se salga del viewport.
export function clampRectPosition(
  rect: DesktopRect,
  nextX: number,
  nextY: number,
): Pick<DesktopRect, "x" | "y"> {
  return {
    x: clamp(nextX, 0, Math.max(0, window.innerWidth - rect.width)),
    y: clamp(nextY, 0, Math.max(0, window.innerHeight - rect.height)),
  };
}

// Asegura que el tamaño no sea menor al mínimo permitido.
export function clampRectSize(width: number, height: number) {
  return {
    width: Math.max(DESKTOP_WINDOW_MIN_WIDTH, width),
    height: Math.max(DESKTOP_WINDOW_MIN_HEIGHT, height),
  };
}