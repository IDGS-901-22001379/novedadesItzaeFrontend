// src/modules/clientes/components/clientes/ClienteEstatusBadge.tsx
// Badge visual para estatus del cliente.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { ClienteEstatus } from "../../types/clientes.types";
import type { ClientesTheme } from "../../theme/clientesTheme";

export default function ClienteEstatusBadge({
  theme,
  estatus,
}: {
  theme: ClientesTheme;
  estatus: ClienteEstatus;
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
