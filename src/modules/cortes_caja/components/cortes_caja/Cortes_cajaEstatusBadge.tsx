// src/modules/cortes_caja/components/cortes_caja/Cortes_cajaEstatusBadge.tsx
// Badge visual para el estatus de la apertura de caja.
// Se encarga de pintar ABIERTA en verde claro y CERRADA en amarillo claro.

import type { AperturaCajaEstatus } from "../../types";
import type { CortesCajaTheme } from "../../theme/cortesCajaTheme";

type Props = {
  theme: CortesCajaTheme;
  estatus: AperturaCajaEstatus;
};

export default function Cortes_cajaEstatusBadge({ theme, estatus }: Props) {
  const isAbierta = estatus === "ABIERTA";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isAbierta ? theme.badgeActivoBg : theme.badgeInactivoBg,
        isAbierta ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {estatus}
    </span>
  );
}
