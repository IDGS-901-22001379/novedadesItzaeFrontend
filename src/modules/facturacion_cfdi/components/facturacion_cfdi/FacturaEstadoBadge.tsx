// src/modules/facturacion_cfdi/components/facturacion_cfdi/FacturaEstadoBadge.tsx
// Badge visual para estatus de la factura.
// Responsabilidades: pintar EMITIDA en verde claro, CANCELADA en amarillo claro y ERROR en rojo claro.

import type { FacturaEstado } from "../../types/facturacion_cfdi.types";
import type { FacturacionCfdiTheme } from "../../theme/facturacionCfdiTheme";

export default function FacturaEstadoBadge({
  theme,
  estado,
}: {
  theme: FacturacionCfdiTheme;
  estado: FacturaEstado;
}) {
  const isEmitida = estado === "EMITIDA";
  const isCancelada = estado === "CANCELADA";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isEmitida
          ? `${theme.badgeActivoBg} ${theme.badgeActivoText}`
          : isCancelada
            ? `${theme.badgeInactivoBg} ${theme.badgeInactivoText}`
            : "bg-red-100 text-red-700",
      ].join(" ")}
    >
      {estado}
    </span>
  );
}
