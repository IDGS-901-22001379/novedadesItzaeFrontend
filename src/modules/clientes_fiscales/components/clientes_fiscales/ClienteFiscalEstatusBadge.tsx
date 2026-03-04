// src/modules/clientes_fiscales/components/clientes_fiscales/ClienteFiscalEstatusBadge.tsx
// Badge visual para estatus del cliente fiscal.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.
// MISMO diseño que UsuarioEstatusBadge.

import type { EstatusGenerico } from "../../types/clientes_fiscales.types";
import type { ClientesFiscalesTheme } from "../../theme/clientesFiscalesTheme";

export default function ClienteFiscalEstatusBadge({
  theme,
  estatus,
}: {
  theme: ClientesFiscalesTheme;
  estatus: EstatusGenerico;
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
