// src/modules/usuarios/components/usuarios/UsuarioEstatusBadge.tsx
// Badge visual para estatus del usuario.
// Responsabilidades: pintar ACTIVO en verde claro e INACTIVO en amarillo claro.

import type { UsuarioEstatus } from "../../types/usuarios.types";
import type { UsuariosTheme } from "../../theme/usuariosTheme";

export default function UsuarioEstatusBadge({
  theme,
  estatus,
}: {
  theme: UsuariosTheme;
  estatus: UsuarioEstatus;
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