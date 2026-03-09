// src/modules/proveedores_productos/components/proveedores_productos/Proveedores_productosTable.tsx
// Tabla del listado de Proveedores-Productos.
// Responsabilidades:
// - Renderizar encabezado, filas, hover suave, estatus y acciones.
// - No mostrar el id_relacion.
// - Mostrar imagen del producto con preview flotante sin agrandar la fila.
// - Mostrar nombre del producto truncado, con modelo debajo.

import { useState } from "react";

import type { ProveedorProductoRow } from "../../types/proveedores_productos.types";
import type { Proveedores_productosTheme } from "../../theme/proveedores_productosTheme";

import ProveedorProductoActivoBadge from "./Proveedor_productosEstatusBadge";
import Proveedores_productosRowActions from "./Proveedores_productosRowActions";

const DEFAULT_IMAGE_URL =
  "https://cdn-icons-png.flaticon.com/512/10608/10608863.png";

const ASSETS_BASE_URL = "http://127.0.0.1:8000";

type RowWithImage = ProveedorProductoRow & {
  producto_imagen_ruta?: string | null;
};

type Props = {
  theme: Proveedores_productosTheme;
  items: ProveedorProductoRow[];
  onVer: (item: ProveedorProductoRow) => void;
  onEditar: (item: ProveedorProductoRow) => void;
  onEliminar: (item: ProveedorProductoRow) => void;
};

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

function normalizeImgSrc(raw: string): string {
  const s = raw.trim();
  if (!s) return DEFAULT_IMAGE_URL;

  if (isHttpUrl(s)) return s;

  if (s.startsWith("imagenes/")) {
    return ASSETS_BASE_URL ? `${ASSETS_BASE_URL}/${s}` : `/${s}`;
  }

  if (s.startsWith("/")) {
    return ASSETS_BASE_URL ? `${ASSETS_BASE_URL}${s}` : s;
  }

  return ASSETS_BASE_URL ? `${ASSETS_BASE_URL}/${s}` : s;
}

function ellipsisChars(text: string, max = 40) {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export default function Proveedores_productosTable({
  theme,
  items,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  const [previewImg, setPreviewImg] = useState<{
    id_producto: number;
    src: string;
    nombre: string;
  } | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className={`${theme.headerBg} ${theme.headerText}`}>
              <tr className="text-xs font-extrabold">
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Código de barras</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">SKU proveedor</th>
                <th className="px-4 py-3">Costo referencia</th>
                <th className="px-4 py-3">Estatus</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5 text-slate-900">
              {items.map((item) => {
                const row: RowWithImage = item;

                const imgSrc = row.producto_imagen_ruta?.trim()
                  ? normalizeImgSrc(String(row.producto_imagen_ruta))
                  : DEFAULT_IMAGE_URL;

                const nombreFull = row.producto_nombre ?? "";
                const nombreShort = ellipsisChars(nombreFull, 40);

                return (
                  <tr
                    key={row.id_relacion}
                    className={`bg-white ${theme.rowHover}`}
                  >
                    {/* Producto */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImg({
                              id_producto: row.id_producto,
                              src: imgSrc,
                              nombre: nombreFull,
                            })
                          }
                          className={[
                            "shrink-0 rounded-xl border border-black/10 bg-white shadow-sm",
                            "transition hover:scale-[1.02] active:scale-[0.98]",
                            "focus:outline-none focus:ring-2",
                            theme.inputFocusRing,
                          ].join(" ")}
                          title="Ver imagen"
                        >
                          <img
                            src={imgSrc}
                            alt={row.producto_nombre}
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src !== DEFAULT_IMAGE_URL) {
                                img.src = DEFAULT_IMAGE_URL;
                              }
                            }}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </button>

                        <div className="min-w-0">
                          <div
                            className={[
                              "font-extrabold",
                              "truncate",
                              "max-w-[320px] sm:max-w-105 md:max-w-130 lg:max-w-170",
                            ].join(" ")}
                            title={nombreFull}
                          >
                            {nombreShort}
                          </div>

                          <div className="text-xs font-semibold text-slate-500">
                            Modelo:{" "}
                            <span className="font-extrabold">
                              {row.producto_modelo ? row.producto_modelo : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 font-semibold">
                      {row.producto_sku ? row.producto_sku : "-"}
                    </td>

                    {/* Código de barras */}
                    <td className="px-4 py-3 font-semibold">
                      {row.producto_codigo_barras
                        ? row.producto_codigo_barras
                        : "-"}
                    </td>

                    {/* Proveedor */}
                    <td className="px-4 py-3">
                      <div className="font-semibold">{row.razon_social}</div>
                      <div className="text-xs font-semibold text-slate-500">
                        Tipo:{" "}
                        <span className="font-extrabold">
                          {row.proveedor_tipo}
                        </span>
                      </div>
                    </td>

                    {/* SKU proveedor */}
                    <td className="px-4 py-3 font-semibold">
                      {row.sku_proveedor ? row.sku_proveedor : "-"}
                    </td>

                    {/* Costo referencia */}
                    <td className="px-4 py-3 font-semibold">
                      {row.costo_referencia !== null &&
                      row.costo_referencia !== undefined
                        ? `$${Number(row.costo_referencia).toFixed(2)}`
                        : "-"}
                    </td>

                    {/* Estatus */}
                    <td className="px-4 py-3">
                      <ProveedorProductoActivoBadge
                        theme={theme}
                        activo={row.activo}
                      />
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <Proveedores_productosRowActions
                        item={row}
                        onVer={onVer}
                        onEditar={onEditar}
                        onEliminar={onEliminar}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {items.length === 0 && (
            <div className="p-6 text-center text-sm font-semibold text-slate-600">
              No hay relaciones para mostrar con los filtros actuales.
            </div>
          )}
        </div>
      </div>

      {/* Overlay de imagen */}
      {previewImg ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPreviewImg(null)}
          />

          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl">
            <div
              className={`flex items-center justify-between px-5 py-4 ${theme.headerBg} ${theme.headerText}`}
            >
              <div
                className="truncate text-sm font-extrabold"
                title={previewImg.nombre}
              >
                {previewImg.nombre}
              </div>

              <button
                type="button"
                onClick={() => setPreviewImg(null)}
                className="rounded-lg px-3 py-2 text-base font-extrabold text-red-200 hover:bg-white/10 hover:text-red-100"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-black/10 bg-black/5 p-4">
                <img
                  src={previewImg.src}
                  alt={previewImg.nombre}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== DEFAULT_IMAGE_URL) {
                      img.src = DEFAULT_IMAGE_URL;
                    }
                  }}
                  className="max-h-105 w-auto rounded-2xl object-contain"
                />
              </div>

              <div className="mt-3 text-xs font-semibold text-black/60">
                Tip: haz click fuera para cerrar.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
