// src/modules/empleados/components/empleados/EmpleadosTable.tsx
// Tabla del listado de Empleados.
// Responsabilidades: renderizar encabezado, filas, hover suave, estatus tipo ORM y acciones.

import type { Empleado } from "../../types/empleados.types";
import type { EmpleadosTheme } from "../../theme/empleadosTheme";
import EmpleadoEstatusBadge from "./EmpleadoEstatusBadge";
import EmpleadosRowActions from "./EmpleadosRowActions";

type Props = {
  theme: EmpleadosTheme;
  items: Empleado[];
  onVer: (e: Empleado) => void;
  onEditar: (e: Empleado) => void;
  onEliminar: (e: Empleado) => void; // cambiar estatus (baja lógica)
};

function fullName(e: Empleado) {
  return `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`
    .replace(/\s+/g, " ")
    .trim();
}

export default function EmpleadosTable({
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
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Puesto</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          {/* Body siempre sobre blanco: fuerza texto negro */}
          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((e) => (
              <tr key={e.id_empleado} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">{e.id_empleado}</td>

                <td className="px-4 py-3 font-semibold">{fullName(e)}</td>

                <td className="px-4 py-3">{e.puesto}</td>

                <td className="px-4 py-3">
                  {e.tiene_usuario ? (
                    <span className="font-semibold">{e.username ?? "—"}</span>
                  ) : (
                    <span className="text-slate-500">Sin acceso</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <EmpleadoEstatusBadge theme={theme} estatus={e.estatus} />
                </td>

                <td className="px-4 py-3">
                  <EmpleadosRowActions
                    empleado={e}
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
            No hay empleados para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
