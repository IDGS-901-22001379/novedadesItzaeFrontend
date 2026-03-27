// src/modules/ventas/components/ventas/VentasEstatusBadge.tsx
// Badge visual para estatus de la venta.
// Responsabilidades:
// - Pintar COMPLETADA con estilo de activo.
// - Pintar CANCELADA con estilo de inactivo/advertencia.

import type { VentaEstatus } from "../../types";
import type { VentasTheme } from "../../theme/ventasTheme";

export default function VentasEstatusBadge({
  theme,
  estatus,
}: {
  theme: VentasTheme;
  estatus: VentaEstatus;
}) {
  const isCompletada = estatus === "COMPLETADA";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isCompletada ? theme.badgeActivoBg : theme.badgeInactivoBg,
        isCompletada ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {estatus}
    </span>
  );
}
