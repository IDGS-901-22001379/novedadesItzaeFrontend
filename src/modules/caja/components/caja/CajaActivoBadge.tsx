// src/modules/caja/components/caja/CajaActivoBadge.tsx
// Badge visual para el estado de la caja.
// Responsabilidades: pintar ACTIVA en verde claro e INACTIVA en amarillo claro.

import type { CajaTheme } from "../../theme/cajaTheme";

type Props = {
  theme: CajaTheme;
  activo: boolean;
};

export default function CajaActivoBadge({ theme, activo }: Props) {
  const isActiva = activo === true;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isActiva ? theme.badgeActivoBg : theme.badgeInactivoBg,
        isActiva ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {isActiva ? "ACTIVA" : "INACTIVA"}
    </span>
  );
}
