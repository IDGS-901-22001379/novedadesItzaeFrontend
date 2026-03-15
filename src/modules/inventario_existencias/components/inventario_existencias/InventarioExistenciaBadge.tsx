// src/modules/inventario_existencias/components/inventario_existencias/InventarioExistenciaBadge.tsx
// Badge visual para existencia.
// Responsabilidades: pintar CON EXISTENCIA en verde, SIN EXISTENCIA en amarillo y SIN DATO en gris.

import type { InventarioExistenciasTheme } from "../../theme/inventarioExistenciasTheme";

type Props = {
  theme: InventarioExistenciasTheme;
  existencia: number | null | undefined;
};

export default function InventarioExistenciaBadge({
  theme,
  existencia,
}: Props) {
  if (
    existencia === null ||
    existencia === undefined ||
    Number.isNaN(Number(existencia))
  ) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">
        SIN DATO
      </span>
    );
  }

  const tieneExistencia = Number(existencia) > 0;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        tieneExistencia ? theme.badgeActivoBg : theme.badgeInactivoBg,
        tieneExistencia ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {tieneExistencia ? "CON EXISTENCIA" : "SIN EXISTENCIA"}
    </span>
  );
}
