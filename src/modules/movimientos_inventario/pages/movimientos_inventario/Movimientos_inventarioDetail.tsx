// src/modules/movimientos_inventario/pages/movimientos_inventario/Movimientos_inventarioDetail.tsx
// Pantalla completa de detalle de un movimiento de inventario.

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { movimientosInventarioService } from "../../services/movimientos_inventario.service";
import { usuariosService } from "../../../usuarios/services/usuarios.service";
import { productosService } from "../../../productos/services/productos.service";
import { inventarioUbicacionesService } from "../../../inventario_ubicaciones/services/inventario_ubicaciones.service";

import type {
  MovimientoInventario,
  MovimientoInventarioDetalle,
} from "../../types/movimientos_inventario.types";
import { useMovimientosInventarioTheme } from "../../theme/useMovimientosInventarioTheme";
import Movimientos_inventarioAlert from "../../components/movimientos_inventario/Movimientos_inventarioAlert";
import MovimientoTipoBadge from "../../components/movimientos_inventario/MovimientoTipoBadge";

type LoadState = "idle" | "loading" | "success" | "error";
type IdNameMap = Record<number, string>;

function formatFecha(fecha?: string | null): string {
  if (!fecha) return "-";

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;

  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatReferencia(
  referencia_tipo?: string | null,
  referencia_id?: number | null,
): string {
  if (!referencia_tipo && !referencia_id) return "-";
  if (referencia_tipo && referencia_id)
    return `${referencia_tipo} #${referencia_id}`;
  if (referencia_tipo) return referencia_tipo;
  return `#${referencia_id}`;
}

function formatMoney(value?: number | null): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

function calcularTotalDetalle(
  detalle: MovimientoInventarioDetalle[] = [],
): number {
  return detalle.reduce((acc, item) => acc + Number(item.importe ?? 0), 0);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar el detalle del movimiento.";
}
type ProductoLookup = {
  id_producto?: number | null;
  nombre?: string | null;
  descripcion?: string | null;
  sku?: string | null;
  codigo_barras?: string | null;
};

type UbicacionLookup = {
  id_ubicacion?: number | null;
  nombre?: string | null;
  descripcion?: string | null;
  codigo?: string | null;
};

type UsuarioLookup = {
  id_usuario?: number | null;
  username?: string | null;
  nombre_en_ticket?: string | null;
};

function productoNombreSeguro(producto: ProductoLookup): string {
  return (
    producto.nombre ??
    producto.descripcion ??
    producto.sku ??
    producto.codigo_barras ??
    `Producto #${producto.id_producto ?? ""}`
  );
}

function ubicacionNombreSeguro(ubicacion: UbicacionLookup): string {
  return (
    ubicacion.nombre ??
    ubicacion.descripcion ??
    ubicacion.codigo ??
    `Ubicación #${ubicacion.id_ubicacion ?? ""}`
  );
}

function usuarioNombreSeguro(usuario: UsuarioLookup): string {
  return (
    usuario.nombre_en_ticket ??
    usuario.username ??
    `Usuario #${usuario.id_usuario ?? ""}`
  );
}

export default function Movimientos_inventarioDetail() {
  const theme = useMovimientosInventarioTheme();
  const navigate = useNavigate();
  const params = useParams();

  const idMovimiento = Number(params.id_movimiento);

  const [item, setItem] = useState<MovimientoInventario | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [usuariosMap, setUsuariosMap] = useState<IdNameMap>({});
  const [productosMap, setProductosMap] = useState<IdNameMap>({});
  const [ubicacionesMap, setUbicacionesMap] = useState<IdNameMap>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!idMovimiento || Number.isNaN(idMovimiento)) {
        setState("error");
        setErrorMsg("El id del movimiento no es válido.");
        return;
      }

      try {
        setState("loading");
        setErrorMsg("");

        const [data, usuarios, productos, ubicaciones] = await Promise.all([
          movimientosInventarioService.obtener(idMovimiento, true),
          usuariosService.listar(),
          productosService.listar?.() ?? Promise.resolve([]),
          inventarioUbicacionesService.listar?.() ?? Promise.resolve([]),
        ]);

        if (!mounted) return;

        const nextUsuariosMap: IdNameMap = {};
        for (const u of usuarios ?? []) {
          if (u?.id_usuario != null) {
            nextUsuariosMap[u.id_usuario] = usuarioNombreSeguro(u);
          }
        }

        const nextProductosMap: IdNameMap = {};
        for (const p of productos ?? []) {
          if (p?.id_producto != null) {
            nextProductosMap[p.id_producto] = productoNombreSeguro(p);
          }
        }

        const nextUbicacionesMap: IdNameMap = {};
        for (const ub of ubicaciones ?? []) {
          if (ub?.id_ubicacion != null) {
            nextUbicacionesMap[ub.id_ubicacion] = ubicacionNombreSeguro(ub);
          }
        }

        setUsuariosMap(nextUsuariosMap);
        setProductosMap(nextProductosMap);
        setUbicacionesMap(nextUbicacionesMap);
        setItem(data);
        setState("success");
      } catch (error: unknown) {
        if (!mounted) return;
        setState("error");
        setErrorMsg(getErrorMessage(error));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [idMovimiento]);

  const detalle = item?.detalle ?? [];

  const resumen = useMemo(() => {
    return {
      productos: detalle.length,
      totalImporte: calcularTotalDetalle(detalle),
    };
  }, [detalle]);

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
          <div className="sm:justify-self-start">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Detalle del movimiento
            </h1>
          </div>

          <div className="sm:justify-self-center">
            <div className="text-center text-lg font-extrabold tracking-tight opacity-95">
              <span>
                Productos:{" "}
                <span className="font-extrabold">{resumen.productos}</span>
              </span>
              <span className="mx-2">·</span>
              <span>
                Total:{" "}
                <span className="font-extrabold">
                  {formatMoney(resumen.totalImporte)}
                </span>
              </span>
            </div>
          </div>

          <div className="sm:justify-self-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f]"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {state === "error" ? (
        <div className="mt-4">
          <Movimientos_inventarioAlert type="error" message={errorMsg} />
        </div>
      ) : null}

      {state === "loading" ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6 text-center text-sm font-semibold text-slate-600 shadow-sm">
          Cargando detalle del movimiento...
        </div>
      ) : null}

      {state === "success" && item ? (
        <>
          <div className="mt-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
            <div
              className={`mb-4 rounded-2xl border px-4 py-3 ${theme.panelBorder} ${theme.panelBg}`}
            >
              <div className="text-sm font-extrabold text-black/70">
                Información general
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">Tipo</div>
                <div className="mt-2">
                  <MovimientoTipoBadge theme={theme} tipo={item.tipo} />
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">
                  Fecha
                </div>
                <div className="mt-1 text-sm font-semibold text-black/80">
                  {formatFecha(item.fecha_hora)}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">
                  Referencia
                </div>
                <div className="mt-1 text-sm font-semibold text-black/80">
                  {formatReferencia(item.referencia_tipo, item.referencia_id)}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">
                  Usuario
                </div>
                <div className="mt-1 text-sm font-semibold text-black/80">
                  {item.id_usuario != null
                    ? (usuariosMap[item.id_usuario] ??
                      `Usuario #${item.id_usuario}`)
                    : "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">
                  Ubicación origen
                </div>
                <div className="mt-1 text-sm font-semibold text-black/80">
                  {item.id_ubicacion_origen != null
                    ? (ubicacionesMap[item.id_ubicacion_origen] ??
                      `Ubicación #${item.id_ubicacion_origen}`)
                    : "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">
                  Ubicación destino
                </div>
                <div className="mt-1 text-sm font-semibold text-black/80">
                  {item.id_ubicacion_destino != null
                    ? (ubicacionesMap[item.id_ubicacion_destino] ??
                      `Ubicación #${item.id_ubicacion_destino}`)
                    : "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">
                  Creado en
                </div>
                <div className="mt-1 text-sm font-semibold text-black/80">
                  {formatFecha(item.creado_en)}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-xs font-extrabold text-black/50">
                  ID interno
                </div>
                <div className="mt-1 text-sm font-semibold text-black/80">
                  {item.id_movimiento}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-extrabold text-black/50">Notas</div>
              <div className="mt-2 min-h-13 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold text-black/80">
                {item.notas?.trim() || "-"}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-extrabold text-black/70">
                Detalle de productos
              </div>

              <div className="text-sm font-semibold text-black/70">
                Registros:{" "}
                <span className="font-extrabold">{detalle.length}</span>
                <span className="mx-2">·</span>
                Total:{" "}
                <span className="font-extrabold">
                  {formatMoney(resumen.totalImporte)}
                </span>
              </div>
            </div>

            {detalle.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-black/10">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className={`${theme.headerBg} ${theme.headerText}`}>
                      <tr className="text-xs font-extrabold">
                        <th className="px-4 py-3">Producto</th>
                        <th className="px-4 py-3">Cantidad</th>
                        <th className="px-4 py-3">Costo unitario</th>
                        <th className="px-4 py-3">Precio unitario</th>
                        <th className="px-4 py-3">Importe</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-black/5 text-slate-900">
                      {detalle.map((d) => (
                        <tr
                          key={d.id_movimiento_detalle}
                          className={`bg-white ${theme.rowHover}`}
                        >
                          <td className="px-4 py-3 font-semibold">
                            {productosMap[d.id_producto] ??
                              `Producto #${d.id_producto}`}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {d.cantidad}
                          </td>
                          <td className="px-4 py-3">
                            {formatMoney(d.costo_unitario)}
                          </td>
                          <td className="px-4 py-3">
                            {formatMoney(d.precio_unitario)}
                          </td>
                          <td className="px-4 py-3 font-extrabold">
                            {formatMoney(d.importe)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-4 text-sm font-semibold text-black/70">
                Este movimiento no tiene detalles registrados.
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
