// src/modules/clientes_tipos/components/clientes_tipos/ClienteTipoEstatusBadge.tsx
// Badge visual para estatus del tipo de cliente.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { ClientesTiposTheme } from "../../theme/clientesTiposTheme";

export default function ClienteTipoEstatusBadge({
  theme,
  activo,
}: {
  theme: ClientesTiposTheme;
  activo: boolean;
}) {
  const label = activo ? "ACTIVO" : "INACTIVO";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs font-extrabold",
        activo ? theme.badgeActivoBg : theme.badgeInactivoBg,
        activo ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
