// src/modules/ventas/components/ventas/desktop/useVentasDesktopWindow.ts
// Hook principal de la ventana escritorio de ventas.
// Responsabilidades:
// - Manejar posición y tamaño de la ventana.
// - Permitir drag, resize y maximize/restore.
// - Manejar confirmación de cierre cuando hay datos capturados.

import { useMemo, useRef, useState } from "react";
import type {
  DesktopRect,
  DesktopResizeDirection,
  VentasDesktopWindowProps,
} from "./ventasDesktopWindow.types";
import {
  DESKTOP_WINDOW_HEADER_HEIGHT,
} from "./ventasDesktopWindow.constants";
import {
  buildInitialDesktopRect,
  clampRectPosition,
  clampRectSize,
  getMaximizedRect,
} from "./ventasDesktopWindow.utils";

export function useVentasDesktopWindow(props: VentasDesktopWindowProps) {
  const fallbackRect = useMemo<DesktopRect>(() => {
    return buildInitialDesktopRect();
  }, []);

  const [rect, setRect] = useState<DesktopRect>(
    props.initialRect ?? fallbackRect,
  );
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [savingAndClosing, setSavingAndClosing] = useState(false);

  const previousRectRef = useRef<DesktopRect>(props.initialRect ?? fallbackRect);

  const bodyHeight = rect.height - DESKTOP_WINDOW_HEADER_HEIGHT;

  // Inicia el arrastre de la ventana desde la barra de título.
  function startDrag(event: React.MouseEvent<HTMLDivElement>) {
    if (isMaximized) return;

    if ((event.target as HTMLElement).closest("[data-window-button='true']")) {
      return;
    }

    props.onFocus(props.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startRect = rect;

    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const next = clampRectPosition(
        startRect,
        startRect.x + dx,
        startRect.y + dy,
      );

      setRect((prev) => ({
        ...prev,
        x: next.x,
        y: next.y,
      }));
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  // Inicia el redimensionado manual desde bordes y esquinas.
  function startResize(
    direction: DesktopResizeDirection,
    event: React.MouseEvent,
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (isMaximized) return;

    props.onFocus(props.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startRect = rect;

    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let nextX = startRect.x;
      let nextY = startRect.y;
      let nextWidth = startRect.width;
      let nextHeight = startRect.height;

      if (direction.includes("e")) {
        nextWidth = startRect.width + dx;
      }

      if (direction.includes("s")) {
        nextHeight = startRect.height + dy;
      }

      if (direction.includes("w")) {
        const resized = clampRectSize(startRect.width - dx, startRect.height);
        nextWidth = resized.width;
        nextX = startRect.x + (startRect.width - nextWidth);
      }

      if (direction.includes("n")) {
        const resized = clampRectSize(startRect.width, startRect.height - dy);
        nextHeight = resized.height;
        nextY = startRect.y + (startRect.height - nextHeight);
      }

      const clampedSize = clampRectSize(nextWidth, nextHeight);
      nextWidth = clampedSize.width;
      nextHeight = clampedSize.height;

      const nextPos = clampRectPosition(
        { x: nextX, y: nextY, width: nextWidth, height: nextHeight },
        nextX,
        nextY,
      );

      setRect({
        x: nextPos.x,
        y: nextPos.y,
        width: nextWidth,
        height: nextHeight,
      });
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  // Si hay cambios, muestra confirmación antes de cerrar.
  function requestClose() {
    if (props.dirty) {
      setShowCloseConfirm(true);
      return;
    }

    props.onClose(props.id);
  }

  function cancelCloseConfirm() {
    setShowCloseConfirm(false);
  }

  function closeWithoutSave() {
    setShowCloseConfirm(false);
    props.onClose(props.id);
  }

  // Guarda primero y luego cierra la ventana.
  async function saveAndClose() {
    if (!props.onSaveAndClose) {
      props.onClose(props.id);
      return;
    }

    try {
      setSavingAndClosing(true);
      await props.onSaveAndClose();
      setShowCloseConfirm(false);
      props.onClose(props.id);
    } finally {
      setSavingAndClosing(false);
    }
  }

  // Alterna entre maximizado y tamaño restaurado.
  function toggleMaximize() {
    props.onFocus(props.id);

    if (!isMaximized) {
      previousRectRef.current = rect;
      setRect(getMaximizedRect());
      setIsMaximized(true);
      return;
    }

    setRect(previousRectRef.current);
    setIsMaximized(false);
  }

  function minimize() {
    props.onMinimize(props.id);
  }

  function focus() {
    props.onFocus(props.id);
  }

  return {
    rect,
    setRect,

    isMaximized,
    showCloseConfirm,
    savingAndClosing,

    bodyHeight,

    startDrag,
    startResize,

    requestClose,
    cancelCloseConfirm,
    closeWithoutSave,
    saveAndClose,

    toggleMaximize,
    minimize,
    focus,
  };
}