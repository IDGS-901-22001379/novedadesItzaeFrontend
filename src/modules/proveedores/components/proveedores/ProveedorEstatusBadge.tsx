// src/modules/proveedores/components/proveedores/ProveedorEstatusBadge.tsx
// Badge visual para estatus del proveedor.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { ProveedorEstatus } from "../../types/proveedores.types";
import type { ProveedoresTheme } from "../../theme/proveedoresTheme";

export default function ProveedorEstatusBadge({
  theme,
  estatus,
}: {
  theme: ProveedoresTheme;
  estatus: ProveedorEstatus;
}) {
  const isActivo = estatus === "ACTIVO";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isActivo ? theme.badgeActivoBg : theme.badgeInactivoBg,
        isActivo ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {estatus}
    </span>
  );
}
