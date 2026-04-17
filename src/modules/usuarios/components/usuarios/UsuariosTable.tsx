// src/modules/usuarios/components/usuarios/UsuariosTable.tsx
// Tabla del listado de Usuarios.
// Responsabilidades: renderizar encabezado, filas, hover suave, estatus tipo ORM y acciones.

import type { User } from "../../types/usuarios.types";
import type { UsuariosTheme } from "../../theme/usuariosTheme";
import UsuarioEstatusBadge from "./UsuarioEstatusBadge";
import UsuariosRowActions from "./UsuariosRowActions";
import { rolLabelById } from "../../constants/roles";

type Props = {
  theme: UsuariosTheme;
  items: User[];
  onVer: (u: User) => void;
  onEditar: (u: User) => void;
  onEliminar: (u: User) => void;
};

export default function UsuariosTable({
  theme,
  items,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          {/* Encabezado fuerte (sí debe heredar blanco) */}
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Nombre en ticket</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          {/* Body siempre sobre blanco: fuerza texto negro */}
          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((u) => (
              <tr key={u.id_usuario} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">{u.username}</td>
                <td className="px-4 py-3">{u.nombre_en_ticket}</td>
                <td className="px-4 py-3 font-semibold">
                  {rolLabelById(u.id_rol)}
                </td>
                <td className="px-4 py-3">
                  <UsuarioEstatusBadge theme={theme} estatus={u.estatus} />
                </td>
                <td className="px-4 py-3">
                  <UsuariosRowActions
                    user={u}
                    onVer={onVer}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay usuarios para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
