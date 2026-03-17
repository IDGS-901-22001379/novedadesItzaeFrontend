// src/modules/traspasos/components/traspasos/TraspasosTable.tsx
// Tabla del listado de Traspasos.
// Responsabilidades:
// - renderizar encabezado, filas, hover suave y acciones
// - mostrar usuario con su rol debajo
// - mostrar origen y destino
// - mostrar notas con límite visual de 2 renglones
// - mostrar fecha al final antes de acciones
// - mantener acciones al final

import type { TraspasoItemListado } from "../../types/traspasos.types";
import type { TraspasosTheme } from "../../theme/traspasosTheme";
import TraspasosRowActions from "./TraspasosRowActions";

type Props = {
  theme: TraspasosTheme;
  items: TraspasoItemListado[];
  loading?: boolean;
  onVer: (item: TraspasoItemListado) => void;

  usuariosMap: Record<number, string>;
  usuariosRolMap: Record<number, string>;
};

function formatFecha(fecha: string): string {
  if (!fecha) return "-";

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;

  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getUsuarioNombre(
  item: TraspasoItemListado,
  usuariosMap: Record<number, string>,
): string {
  if (item.id_usuario == null) return "No aplica";

  return (
    usuariosMap[item.id_usuario] ??
    item.username ??
    item.usuario_nombre ??
    `Usuario #${item.id_usuario}`
  );
}

function getUsuarioRol(
  item: TraspasoItemListado,
  usuariosRolMap: Record<number, string>,
): string {
  if (item.id_usuario == null) return "Sin rol";

  return usuariosRolMap[item.id_usuario] ?? item.usuario_rol ?? "Sin rol";
}

export default function TraspasosTable({
  theme,
  items,
  loading = false,
  onVer,
  usuariosMap,
  usuariosRolMap,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Origen</th>
              <th className="px-4 py-3">Destino</th>
              <th className="px-4 py-3">Notas</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((item) => (
              <tr
                key={item.id_movimiento}
                className={`bg-white ${theme.rowHover}`}
              >
                {/* Usuario + rol */}
                <td className="px-4 py-3 align-top">
                  <div className="font-extrabold text-slate-900">
                    {getUsuarioNombre(item, usuariosMap)}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {getUsuarioRol(item, usuariosRolMap)}
                  </div>
                </td>

                {/* Origen */}
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-slate-900">
                    {item.origen_nombre}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {item.origen_tipo} · {item.origen_codigo}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {item.origen_sucursal_nombre}
                  </div>
                </td>

                {/* Destino */}
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-slate-900">
                    {item.destino_nombre}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {item.destino_tipo} · {item.destino_codigo}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {item.destino_sucursal_nombre}
                  </div>
                </td>

                {/* Notas */}
                <td className="px-4 py-3 align-top">
                  <div className="max-w-70 text-slate-900">
                    <div
                      className="line-clamp-2 wrap-break-word font-semibold leading-5"
                      title={item.notas?.trim() || "Sin notas"}
                    >
                      {item.notas?.trim() || "Sin notas"}
                    </div>
                  </div>
                </td>

                {/* Fecha */}
                <td className="px-4 py-3 align-top font-semibold whitespace-nowrap">
                  {formatFecha(item.fecha_hora)}
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 align-top">
                  <TraspasosRowActions item={item} onVer={onVer} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay traspasos para mostrar con los filtros actuales.
          </div>
        )}

        {loading && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            Cargando traspasos...
          </div>
        )}
      </div>
    </div>
  );
}
