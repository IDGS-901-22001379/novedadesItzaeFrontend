// src/modules/movimientos_inventario/components/movimientos_inventario/Movimientos_inventarioTable.tsx
// Tabla del listado de Movimientos de Inventario.
// Responsabilidades:
// - renderizar encabezado, filas, hover suave y acciones
// - mostrar usuario con su rol debajo
// - mostrar producto principal del movimiento por nombre
// - mostrar origen y destino
// - mostrar fecha y tipo
// - mantener acciones al final

import type { MovimientoInventarioItem } from "../../types/movimientos_inventario.types";
import type { MovimientosInventarioTheme } from "../../theme/movimientosInventarioTheme";
import Movimientos_inventarioRowActions from "./Movimientos_inventarioRowActions";
import MovimientoTipoBadge from "./MovimientoTipoBadge";

type Props = {
  theme: MovimientosInventarioTheme;
  items: MovimientoInventarioItem[];
  loading?: boolean;
  onVer: (item: MovimientoInventarioItem) => void;

  usuariosMap: Record<number, string>;
  usuariosRolMap: Record<number, string>;
  ubicacionesMap: Record<number, string>;
  productosPorMovimientoMap: Record<number, string>;
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
  idUsuario: number | null,
  usuariosMap: Record<number, string>,
): string {
  if (idUsuario == null) return "No aplica";
  return usuariosMap[idUsuario] ?? `Usuario #${idUsuario}`;
}

function getUsuarioRol(
  idUsuario: number | null,
  usuariosRolMap: Record<number, string>,
): string {
  if (idUsuario == null) return "Sin rol";
  return usuariosRolMap[idUsuario] ?? "Sin rol";
}

function getProductoNombre(
  idMovimiento: number,
  productosPorMovimientoMap: Record<number, string>,
): string {
  return productosPorMovimientoMap[idMovimiento] ?? "No disponible";
}

function getUbicacionNombre(
  idUbicacion: number | null,
  ubicacionesMap: Record<number, string>,
): string {
  if (idUbicacion == null) return "No aplica";
  return ubicacionesMap[idUbicacion] ?? `Ubicación #${idUbicacion}`;
}

export default function Movimientos_inventarioTable({
  theme,
  items,
  loading = false,
  onVer,
  usuariosMap,
  usuariosRolMap,
  ubicacionesMap,
  productosPorMovimientoMap,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Origen</th>
              <th className="px-4 py-3">Destino</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Tipo</th>
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
                    {getUsuarioNombre(item.id_usuario, usuariosMap)}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {getUsuarioRol(item.id_usuario, usuariosRolMap)}
                  </div>
                </td>

                {/* Producto */}
                <td className="px-4 py-3 align-top">
                  <div className="font-extrabold text-slate-900">
                    {getProductoNombre(
                      item.id_movimiento,
                      productosPorMovimientoMap,
                    )}
                  </div>
                </td>

                {/* Origen */}
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-slate-900">
                    {getUbicacionNombre(
                      item.id_ubicacion_origen,
                      ubicacionesMap,
                    )}
                  </div>
                </td>

                {/* Destino */}
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-slate-900">
                    {getUbicacionNombre(
                      item.id_ubicacion_destino,
                      ubicacionesMap,
                    )}
                  </div>
                </td>

                {/* Fecha */}
                <td className="px-4 py-3 align-top font-semibold">
                  {formatFecha(item.fecha_hora)}
                </td>

                {/* Tipo */}
                <td className="px-4 py-3 align-top">
                  <MovimientoTipoBadge theme={theme} tipo={item.tipo} />
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 align-top">
                  <Movimientos_inventarioRowActions item={item} onVer={onVer} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay movimientos para mostrar con los filtros actuales.
          </div>
        )}

        {loading && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            Cargando movimientos...
          </div>
        )}
      </div>
    </div>
  );
}
