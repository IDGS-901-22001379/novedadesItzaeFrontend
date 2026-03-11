// src/modules/inventario_ubicaciones/components/inventario_ubicaciones/InventarioUbicacionEstatusBadge.tsx
// Badge visual para estatus de la ubicación.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { InventarioUbicacionesTheme } from "../../theme/inventarioUbicacionesTheme";

export default function InventarioUbicacionEstatusBadge({
  theme,
  activo,
}: {
  theme: InventarioUbicacionesTheme;
  activo: boolean;
}) {
  const isActivo = activo;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isActivo ? theme.badgeActivoBg : theme.badgeInactivoBg,
        isActivo ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {isActivo ? "ACTIVO" : "INACTIVO"}
    </span>
  );
}
