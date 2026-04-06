// src/modules/creditos_abonos/components/creditos_abonos/CreditosAbonosEstatusBadge.tsx
// Badge visual para estatus del abono.
// Responsabilidades: pintar REGISTRADO en verde claro y CANCELADO en amarillo claro.

import type { AbonoCreditoEstatus } from "../../types/creditos_abonos.types";
import type { CreditosAbonosTheme } from "../../theme/creditosAbonosTheme";

export default function CreditosAbonosEstatusBadge({
  theme,
  estatus,
}: {
  theme: CreditosAbonosTheme;
  estatus: AbonoCreditoEstatus;
}) {
  const isRegistrado = estatus === "REGISTRADO";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isRegistrado ? theme.badgeActivoBg : theme.badgeInactivoBg,
        isRegistrado ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {estatus}
    </span>
  );
}
