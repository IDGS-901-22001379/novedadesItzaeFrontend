// src/modules/caja/components/caja/ConfirmActionModal.tsx
// Modal chico de confirmación para acciones del módulo Caja.
// Responsabilidades: mostrar un mensaje tipo alerta y confirmar o cancelar una acción.

import type { ReactNode } from "react";

export type ConfirmVariant = "success" | "warning" | "danger" | "info";

type Props = {
  open: boolean;
  title?: string;
  message: ReactNode;
  variant?: ConfirmVariant;

  cancelText?: string;
  confirmText: string;

  onCancel: () => void;
  onConfirm: () => void;

  loading?: boolean;
};

function variantStyles(variant: ConfirmVariant) {
  if (variant === "danger") {
    return {
      badge: "bg-red-100 text-red-700 border-red-200",
      confirmBtn: "bg-red-500 text-white hover:opacity-90",
    };
  }

  if (variant === "warning") {
    return {
      badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmBtn: "bg-yellow-400 text-black hover:opacity-90",
    };
  }

  if (variant === "info") {
    return {
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      confirmBtn: "bg-blue-600 text-white hover:opacity-90",
    };
  }

  return {
    badge: "bg-green-100 text-green-700 border-green-200",
    confirmBtn: "bg-green-500 text-white hover:opacity-90",
  };
}

export default function ConfirmActionModal({
  open,
  title = "¡Atención!",
  message,
  variant = "info",
  cancelText = "Cancelar",
  confirmText,
  onCancel,
  onConfirm,
  loading = false,
}: Props) {
  if (!open) return null;

  const styles = variantStyles(variant);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/35"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-black/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-extrabold ${styles.badge}`}
            >
              {title}
            </span>
          </div>

          <button
            type="button"
            onClick={loading ? undefined : onCancel}
            className="rounded-lg px-2 py-1 text-sm font-extrabold text-black/50 hover:bg-black/10"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="text-sm font-semibold text-black/70">{message}</div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5 disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-lg px-4 py-2 text-sm font-extrabold disabled:opacity-50 ${styles.confirmBtn}`}
            >
              {loading ? "Procesando..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
