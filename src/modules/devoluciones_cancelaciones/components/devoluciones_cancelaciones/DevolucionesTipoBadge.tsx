// src/modules/devoluciones_cancelaciones/components/devoluciones_cancelaciones/DevolucionesTipoBadge.tsx
// Badge visual para el tipo de devolución.
// Responsabilidades: pintar TOTAL en verde claro, PARCIAL en amarillo claro
// y CANCELACION usando el mismo estilo visual suave del módulo.

import type { DevolucionTipo } from "../../types/devoluciones_cancelaciones.types";
import type { DevolucionesCancelacionesTheme } from "../../theme/devolucionesCancelacionesTheme";

export default function DevolucionesTipoBadge({
  theme,
  tipo,
}: {
  theme: DevolucionesCancelacionesTheme;
  tipo: DevolucionTipo;
}) {
  const isTotal = tipo === "TOTAL";
  const isParcial = tipo === "PARCIAL";

  const bgClass = isTotal
    ? theme.badgeActivoBg
    : isParcial
      ? theme.badgeInactivoBg
      : "bg-red-100";

  const textClass = isTotal
    ? theme.badgeActivoText
    : isParcial
      ? theme.badgeInactivoText
      : "text-red-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        bgClass,
        textClass,
      ].join(" ")}
    >
      {tipo}
    </span>
  );
}
