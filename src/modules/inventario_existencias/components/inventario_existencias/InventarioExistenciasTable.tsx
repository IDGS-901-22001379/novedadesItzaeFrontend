// src/modules/inventario_existencias/components/inventario_existencias/InventarioExistenciasTable.tsx
// Tabla del listado de Inventario Existencias.
// Ajustes UI:
// - Sin columna ID.
// - Primero imagen del producto.
// - Nombre del producto al frente y debajo su modelo.
// - Luego código de barras.
// - Luego sucursal y debajo ubicación.
// - Luego existencias con semáforo.
// - Sin columna Estado.
// - Con botones Ver y Ajustar desde InventarioExistenciasRowActions.
// - La sucursal muestra: NombreSucursal · TIENDA/BODEGA

import { useState } from "react";

import type { ExistenciaItem } from "../../types/inventarioExistencias.types";
import type { InventarioExistenciasTheme } from "../../theme/inventarioExistenciasTheme";

import InventarioExistenciasRowActions from "./InventarioExistenciasRowActions";

const DEFAULT_IMAGE_URL = "/producto.png";
const ASSETS_BASE_URL = "http://127.0.0.1:8000";

type Props = {
  theme: InventarioExistenciasTheme;
  items: ExistenciaItem[];
  loading?: boolean;
  onVer: (item: ExistenciaItem) => void;
  onEditar: (item: ExistenciaItem) => void;
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

function getExistenciaStyles(existencia: number | null) {
  if (existencia === null) {
    return {
      pill: "border-black/10 bg-white text-black/60",
      dot: "bg-black/30",
      title: "Sin datos de existencia.",
    };
  }

  if (existencia <= 0) {
    return {
      pill: "border-yellow-200 bg-yellow-50 text-yellow-900",
      dot: "bg-yellow-400",
      title: "Sin existencia en esta sucursal / ubicación.",
    };
  }

  return {
    pill: "border-green-200 bg-green-50 text-green-800",
    dot: "bg-green-500",
    title: "Existencia disponible.",
  };
}

function getProductoNombre(item: ExistenciaItem) {
  return item.producto?.nombre ?? item.producto_nombre ?? "Producto sin nombre";
}

function getProductoModelo(item: ExistenciaItem) {
  return item.producto?.modelo ?? item.producto_modelo ?? null;
}

function getProductoCodigoBarras(item: ExistenciaItem) {
  return item.producto?.codigo_barras ?? item.producto_codigo_barras ?? null;
}

function getProductoImagen(item: ExistenciaItem) {
  const row = item as ExistenciaItem & {
    imagen_ruta?: string | null;
    producto_imagen_ruta?: string | null;
    producto?: { imagen_ruta?: string | null; imagen_url?: string | null };
  };

  return (
    row.producto?.imagen_ruta ??
    row.producto?.imagen_url ??
    row.producto_imagen_ruta ??
    item.producto_imagen_url ??
    row.imagen_ruta ??
    null
  );
}

function getSucursalNombre(item: ExistenciaItem) {
  return (
    item.ubicacion?.sucursal_nombre ??
    item.sucursal_nombre ??
    "Sucursal no disponible"
  );
}

function getUbicacionNombre(item: ExistenciaItem) {
  return (
    item.ubicacion?.nombre ?? item.ubicacion_nombre ?? "Ubicación no disponible"
  );
}

function getUbicacionTipo(item: ExistenciaItem) {
  const tipo = item.ubicacion?.tipo ?? item.ubicacion_tipo ?? "";
  return tipo ? String(tipo).toUpperCase() : "";
}

function buildRowKey(item: ExistenciaItem) {
  if (item.id_existencia != null && item.id_existencia > 0) {
    return `existencia-${item.id_existencia}`;
  }

  return `virtual-${item.id_producto}-${item.id_ubicacion}`;
}

export default function InventarioExistenciasTable({
  theme,
  items,
  loading = false,
  onVer,
  onEditar,
}: Props) {
  const [previewImg, setPreviewImg] = useState<{
    id_existencia: number | null;
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
                <th className="px-4 py-3">Código de barras</th>
                <th className="px-4 py-3">Sucursal / ubicación</th>
                <th className="px-4 py-3">Existencias</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5 text-slate-900">
              {items.map((item) => {
                const nombreFull = getProductoNombre(item);
                const nombreShort = ellipsisChars(nombreFull, 40);

                const modelo = getProductoModelo(item);
                const codigoBarras = getProductoCodigoBarras(item);

                const sucursalNombre = getSucursalNombre(item);
                const ubicacionNombre = getUbicacionNombre(item);
                const ubicacionTipo = getUbicacionTipo(item);

                const existenciaValue =
                  item.existencia === null || item.existencia === undefined
                    ? null
                    : Number(item.existencia);

                const existenciaUI =
                  existenciaValue === null ? "-" : String(existenciaValue);

                const existenciaStyles = getExistenciaStyles(existenciaValue);

                const imgRaw = getProductoImagen(item);
                const imgSrc = imgRaw?.trim()
                  ? normalizeImgSrc(String(imgRaw))
                  : DEFAULT_IMAGE_URL;

                return (
                  <tr
                    key={buildRowKey(item)}
                    className={`bg-white ${theme.rowHover}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImg({
                              id_existencia: item.id_existencia ?? null,
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
                            alt={nombreFull}
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
                              {modelo ? String(modelo) : "-"}
                            </span>
                          </div>

                          {item.es_existencia_real === false ? (
                            <div className="mt-1 text-[11px] font-bold text-amber-700">
                              Registro virtual con existencia 0
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {codigoBarras ? codigoBarras : "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <div
                          className="max-w-65 truncate font-extrabold"
                          title={
                            ubicacionTipo
                              ? `${sucursalNombre} · ${ubicacionTipo}`
                              : sucursalNombre
                          }
                        >
                          {ubicacionTipo
                            ? `${sucursalNombre} · ${ubicacionTipo}`
                            : sucursalNombre}
                        </div>

                        <div
                          className="max-w-65 truncate text-xs font-semibold text-slate-500"
                          title={ubicacionNombre}
                        >
                          Ubicación:{" "}
                          <span className="font-extrabold">
                            {ubicacionNombre}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1",
                          "text-base font-extrabold",
                          existenciaStyles.pill,
                        ].join(" ")}
                        title={existenciaStyles.title}
                      >
                        <span
                          className={[
                            "h-2.5 w-2.5 rounded-full",
                            existenciaStyles.dot,
                          ].join(" ")}
                        />
                        {existenciaUI}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <InventarioExistenciasRowActions
                        item={item}
                        onVer={onVer}
                        onEditar={onEditar}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!loading && items.length === 0 && (
            <div className="p-6 text-center text-sm font-semibold text-slate-600">
              No hay existencias para mostrar con los filtros actuales.
            </div>
          )}

          {loading && (
            <div className="p-6 text-center text-sm font-semibold text-slate-600">
              Cargando existencias...
            </div>
          )}
        </div>
      </div>

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
