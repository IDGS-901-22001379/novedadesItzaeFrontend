// src/modules/inventario_sucursales/components/inventario_sucursales/InventarioSucursalEstatusBadge.tsx
// Badge visual para estatus de la sucursal.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { InventarioSucursalesTheme } from "../../theme/inventarioSucursalesTheme";

type Props = {
  theme: InventarioSucursalesTheme;
  activo: boolean;
};

export default function InventarioSucursalEstatusBadge({
  theme,
  activo,
}: Props) {
  const label = activo ? "ACTIVO" : "INACTIVO";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        activo ? theme.badgeActivoBg : theme.badgeInactivoBg,
        activo ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
