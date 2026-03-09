// src/modules/proveedores_productos/components/proveedores_productos/ProveedorProductoActivoBadge.tsx
// Badge visual para estatus de la relación proveedor-producto.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { Proveedores_productosTheme } from "../../theme/proveedores_productosTheme";

export default function ProveedorProductoActivoBadge({
  theme,
  activo,
}: {
  theme: Proveedores_productosTheme;
  activo: boolean;
}) {
  const isActivo = activo === true;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        isActivo ? theme.badgeActivoBg : theme.badgeInactivoBg,
        isActivo ? theme.badgeActivoText : theme.badgeInactivoText,
      ].join(" ")}
    >
      {isActivo ? "ACTIVO" : "INACTIVO"}
    </span>
  );
}
