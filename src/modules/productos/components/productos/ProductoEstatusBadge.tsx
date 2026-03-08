// src/modules/productos/components/productos/ProductoEstatusBadge.tsx
// Badge visual para estatus del producto.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { ProductoEstatus } from "../../types/productos.types";
import type { ProductosTheme } from "../../theme/productosTheme";

export default function ProductoEstatusBadge({
  theme,
  estatus,
}: {
  theme: ProductosTheme;
  estatus: ProductoEstatus;
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
