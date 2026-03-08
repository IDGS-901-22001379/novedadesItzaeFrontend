// src/modules/productos/components/productos/ProductosTable.tsx
// Ajustes UI solicitados:
// - Nombre del producto: máximo 40 caracteres + "..." (sin romper tabla).
// - Tooltip con nombre completo (title).
// - Imagen expandida: se muestra en un "preview flotante" (overlay) para NO agrandar la fila.
// - La celda del producto usa truncado real (truncate) y ancho máximo controlado.
// - En pantallas pequeñas, el nombre sigue truncado y no empuja acciones.
// - Cambio solicitado:
//   * Se elimina la columna "Modelo".
//   * Se agrega columna "SKU".
//   * El modelo aparece debajo del nombre del producto.

import { useState } from "react";

import type { ProductoLite } from "../../types/productos.types";
import type { ProductosTheme } from "../../theme/productosTheme";

import ProductoEstatusBadge from "./ProductoEstatusBadge";
import ProductosRowActions from "./ProductosRowActions";

const DEFAULT_IMAGE_URL =
  "https://cdn-icons-png.flaticon.com/512/10608/10608863.png";

const ASSETS_BASE_URL = "http://127.0.0.1:8000";

type ProductoRow = ProductoLite & {
  modelo?: string | null;
  imagen_ruta?: string | null;
  stock_minimo_tienda?: number | string | null;
};

type Props = {
  theme: ProductosTheme;
  items: ProductoLite[];

  onVer: (p: ProductoLite) => void;
  onEditar: (p: ProductoLite) => void;
  onEliminar: (p: ProductoLite) => void;

  onPrecios: (p: ProductoLite) => void;

  // stock real (número) desde resumen
  getStockValue?: (p: ProductoLite) => number | null;
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

function asIntOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function getStockStyles(stock: number | null, min: number | null) {
  if (stock === null) {
    return {
      pill: "border-black/10 bg-white text-black/60",
      dot: "bg-black/30",
      title: "Sin datos de stock (selecciona sucursal o carga existencias).",
    };
  }

  if (stock === 0) {
    return {
      pill: "border-red-200 bg-red-50 text-red-800",
      dot: "bg-red-500",
      title: "Sin existencia (0).",
    };
  }

  const minSafe = min ?? 0;

  if (stock <= minSafe) {
    return {
      pill: "border-yellow-200 bg-yellow-50 text-yellow-900",
      dot: "bg-yellow-400",
      title: `Bajo / en mínimo (mínimo: ${minSafe}).`,
    };
  }

  return {
    pill: "border-green-200 bg-green-50 text-green-800",
    dot: "bg-green-500",
    title: `OK (mínimo: ${minSafe}).`,
  };
}

// Limita a N caracteres con "..."
function ellipsisChars(text: string, max = 40) {
  const t = (text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export default function ProductosTable({
  theme,
  items,
  onVer,
  onEditar,
  onEliminar,
  onPrecios,
  getStockValue,
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
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estatus</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5 text-slate-900">
              {items.map((p) => {
                const row: ProductoRow = p;

                const stockValue = getStockValue?.(row) ?? null;
                const minFromRow = asIntOrNull(row.stock_minimo_tienda);
                const stockUI = stockValue === null ? "-" : String(stockValue);
                const stockStyles = getStockStyles(stockValue, minFromRow ?? 0);

                const imgSrc = row.imagen_ruta?.trim()
                  ? normalizeImgSrc(String(row.imagen_ruta))
                  : DEFAULT_IMAGE_URL;

                const nombreFull = row.nombre ?? "";
                const nombreShort = ellipsisChars(nombreFull, 40);

                return (
                  <tr
                    key={row.id_producto}
                    className={`bg-white ${theme.rowHover}`}
                  >
                    {/* Producto */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Imagen pequeña */}
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
                            alt={row.nombre}
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img.src !== DEFAULT_IMAGE_URL) {
                                img.src = DEFAULT_IMAGE_URL;
                              }
                            }}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </button>

                        {/* Nombre + Modelo */}
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
                              {row.modelo ? String(row.modelo) : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 font-semibold">
                      {row.sku ? row.sku : "-"}
                    </td>

                    {/* Código barras */}
                    <td className="px-4 py-3 font-semibold">
                      {row.codigo_barras ? row.codigo_barras : "-"}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1",
                          "text-base font-extrabold",
                          stockStyles.pill,
                        ].join(" ")}
                        title={stockStyles.title}
                      >
                        <span
                          className={[
                            "h-2.5 w-2.5 rounded-full",
                            stockStyles.dot,
                          ].join(" ")}
                        />
                        {stockUI}
                      </span>
                    </td>

                    {/* Estatus */}
                    <td className="px-4 py-3">
                      <ProductoEstatusBadge
                        theme={theme}
                        estatus={row.estatus}
                      />
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onPrecios(row)}
                          className={[
                            "inline-flex items-center justify-center",
                            "h-9 w-9 rounded-xl border shadow-sm transition",
                            "border-black/10 bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
                            "disabled:opacity-50",
                          ].join(" ")}
                          title="Precios"
                        >
                          <span className="text-base font-extrabold">$</span>
                        </button>

                        <ProductosRowActions
                          producto={row}
                          onVer={onVer}
                          onEditar={onEditar}
                          onEliminar={onEliminar}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {items.length === 0 && (
            <div className="p-6 text-center text-sm font-semibold text-slate-600">
              No hay productos para mostrar con los filtros actuales.
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
