// src/modules/productos/components/productos/precios/ProductoPrecioHistorialTable.tsx

import type { ProductosTheme } from "../../../theme/productosTheme";
import type {
  PrecioProducto,
  TipoClienteCatalogo,
} from "../../../types/productos.types";
import {
  estadoBadge,
  moneyMXN,
  presentacionBadge,
} from "./productoPreciosModal.utils";

type Props = {
  theme: ProductosTheme;
  tiposCliente: TipoClienteCatalogo[];
  historialFiltrado: PrecioProducto[];

  onVerPrecio: (precio: PrecioProducto) => void;
  onEditarPrecio: (precio: PrecioProducto) => void;
  onDesactivarPrecio: (precio: PrecioProducto) => void | Promise<void>;
  onActivarPrecio: (precio: PrecioProducto) => void | Promise<void>;
};

export default function ProductoPrecioHistorialTable({
  theme,
  tiposCliente,
  historialFiltrado,
  onVerPrecio,
  onEditarPrecio,
  onDesactivarPrecio,
  onActivarPrecio,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Tipo cliente</th>
              <th className="px-4 py-3">Presentación</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 bg-white text-slate-900">
            {historialFiltrado.map((item) => {
              const nombreTipoCliente =
                item.tipo_cliente_nombre ||
                tiposCliente.find(
                  (x) => x.id_tipo_cliente === item.id_tipo_cliente,
                )?.nombre ||
                `Tipo #${item.id_tipo_cliente}`;

              return (
                <tr key={item.id_precio} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold">
                    {nombreTipoCliente}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold ${presentacionBadge(
                        item.presentacion,
                      )}`}
                    >
                      {item.presentacion}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-extrabold text-slate-900">
                    {moneyMXN(item.precio)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold ${estadoBadge(
                        item.activo,
                      )}`}
                    >
                      {item.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onVerPrecio(item)}
                        className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-sky-700 hover:bg-sky-100"
                      >
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditarPrecio(item)}
                        className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-700 hover:bg-amber-100"
                      >
                        Editar
                      </button>

                      {item.activo ? (
                        <button
                          type="button"
                          onClick={() => void onDesactivarPrecio(item)}
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100"
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void onActivarPrecio(item)}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100"
                        >
                          Activar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
