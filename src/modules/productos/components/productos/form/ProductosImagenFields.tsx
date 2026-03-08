// src/modules/productos/components/productos/form/ProductosImagenFields.tsx
// Imagen del producto (solo enlace).
// Responsabilidades:
// - Permitir pegar un enlace (URL) para la imagen.
// - Mostrar vista previa SIEMPRE (si no hay enlace, usa imagen por defecto).
// - Mostrar miniaturas (Actual / Default).
//
// Nota: NO se usa input file, NO se muestra MIME, NO se muestran bytes/hash.

import { useMemo } from "react";
import type { ProductosFormState } from "../../../pages/productos/form/productosForm.types";

type Props = {
  readOnly: boolean;
  form: ProductosFormState;
  onChange: (patch: Partial<ProductosFormState>) => void;

  // Opcional: base URL si tus imágenes vienen del backend
  // Ej: "http://127.0.0.1:8000"
  assetsBaseUrl?: string;
};

const DEFAULT_IMAGE_URL = "/public/producto.png";

function isProbablyUrl(path: string) {
  return (
    /^https?:\/\//i.test(path) ||
    path.startsWith("/") ||
    path.startsWith("imagenes/")
  );
}

function normalizeImgSrc(path: string, baseUrl?: string) {
  const raw = path.trim();
  if (!raw) return "";

  // URL completa
  if (/^https?:\/\//i.test(raw)) return raw;

  // "imagenes/..." => "/imagenes/..."
  if (raw.startsWith("imagenes/")) return `/${raw}`;

  // "/imagenes/..." => se respeta
  if (raw.startsWith("/")) return raw;

  // fallback
  return baseUrl ? `${baseUrl}/${raw}` : raw;
}

export default function ProductosImagenFields({
  readOnly,
  form,
  onChange,
  assetsBaseUrl,
}: Props) {
  // Src de la imagen guardada por ruta (si existe y es interpretable por el navegador)
  const rutaSrc = useMemo(() => {
    const raw = form.imagen_ruta.trim();
    if (!raw) return "";
    if (!isProbablyUrl(raw)) return "";
    return normalizeImgSrc(raw, assetsBaseUrl);
  }, [form.imagen_ruta, assetsBaseUrl]);

  // Preview principal: si hay ruta válida -> esa; si no -> default
  const mainPreview = rutaSrc || DEFAULT_IMAGE_URL;

  // Miniaturas: Actual (si hay) + Default (siempre)
  const thumbs = useMemo(() => {
    const arr: { key: string; src: string; label: string }[] = [];

    if (rutaSrc) arr.push({ key: "ruta", src: rutaSrc, label: "Actual" });
    arr.push({ key: "default", src: DEFAULT_IMAGE_URL, label: "Default" });

    return arr;
  }, [rutaSrc]);

  return (
    <div className="space-y-4">
      {/* Preview grande */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-3">
          <div className="text-xs font-extrabold text-black/60">
            Vista previa
          </div>

          <div className="mt-2 flex items-center justify-center rounded-2xl border border-dashed border-black/10 bg-black/5 p-3">
            <img
              src={mainPreview}
              alt="preview"
              className="max-h-56 w-auto rounded-xl object-contain"
            />
          </div>

          {/* Miniaturas */}
          <div className="mt-3 flex flex-wrap gap-2">
            {thumbs.map((t) => (
              <div key={t.key} className="flex flex-col items-center gap-1">
                <img
                  src={t.src}
                  alt={t.label}
                  className="h-14 w-14 rounded-xl border border-black/10 object-cover"
                />
                <div className="text-[11px] font-extrabold text-black/60">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controles */}
        <div className="rounded-2xl border border-black/10 bg-white p-3">
          <div className="text-xs font-extrabold text-black/60">
            Enlace de imagen
          </div>

          <div className="mt-3 flex flex-col gap-3">
            {/* Enlace */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold">
                URL / Ruta (opcional)
              </label>

              <input
                value={form.imagen_ruta}
                disabled={readOnly}
                onChange={(e) => onChange({ imagen_ruta: e.target.value })}
                placeholder="https://.../producto.jpg"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
              />

              <div className="text-xs font-semibold text-black/50">
                Pega un enlace directo de imagen (.jpg, .png, .webp). Si lo
                dejas vacío, se usará la imagen default.
              </div>
            </div>

            {/* Botón limpiar */}
            {!readOnly ? (
              <button
                type="button"
                onClick={() => onChange({ imagen_ruta: "" })}
                className="w-fit rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
              >
                Quitar enlace
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mensaje si puso ruta pero no se puede interpretar */}
      {form.imagen_ruta.trim() && !rutaSrc ? (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-900">
          El enlace/ruta que escribiste no parece válida para el navegador. Usa
          una URL directa (https://...) o una ruta pública servida por tu app o
          backend.
        </div>
      ) : null}
    </div>
  );
}
