// src/modules/ventas/pages/ventas/form/cobro/useCobroHotkeys.ts

import { useEffect } from "react";

type Params = {
  open: boolean;
  onClose: () => void;
  onConfirmar: () => void;
};

export function useCobroHotkeys({
  open,
  onClose,
  onConfirmar,
}: Params): void {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Enter") {
        const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();

        // Confirmar con Enter, excepto si el foco está en un textarea.
        if (tag !== "textarea") {
          e.preventDefault();
          onConfirmar();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, onConfirmar]);
}