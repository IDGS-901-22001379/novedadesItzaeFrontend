// src/modules/empleados/components/empleados/EmpleadoEstatusBadge.tsx
// Badge visual para estatus del empleado.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { EmpleadoEstatus } from "../../types/empleados.types";
import type { EmpleadosTheme } from "../../theme/empleadosTheme";

export default function EmpleadoEstatusBadge({
  theme,
  estatus,
}: {
  theme: EmpleadosTheme;
  estatus: EmpleadoEstatus;
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
