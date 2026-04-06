// src/modules/creditos/components/creditos/CreditoEstatusBadge.tsx
// Badge visual para estatus del crédito.
// Responsabilidades: pintar el estado del crédito con colores visuales claros.

import type { CreditoEstado } from "../../types/creditos.types";
import type { CreditosTheme } from "../../theme/creditosTheme";

type Props = {
  theme: CreditosTheme;
  estatus: CreditoEstado | string;
};

export default function CreditoEstatusBadge({ theme, estatus }: Props) {
  const isPendiente = estatus === "PENDIENTE";
  const isParcial = estatus === "PARCIAL";
  const isPagado = estatus === "PAGADO";

  const bgClass = isPagado
    ? theme.badgeActivoBg
    : isPendiente
      ? theme.badgeInactivoBg
      : isParcial
        ? "bg-blue-100"
        : "bg-slate-200";

  const textClass = isPagado
    ? theme.badgeActivoText
    : isPendiente
      ? theme.badgeInactivoText
      : isParcial
        ? "text-blue-700"
        : "text-slate-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        bgClass,
        textClass,
      ].join(" ")}
    >
      {estatus}
    </span>
  );
}
