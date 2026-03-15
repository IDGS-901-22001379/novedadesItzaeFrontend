// src/modules/inventario_existencias/pages/inventario_existencias/InventarioExistenciasDetail.tsx
// Vista de solo lectura para el detalle de una existencia.
// Responsabilidades: mostrar información del producto, sucursal, ubicación y existencia actual.

import type { ExistenciaDetalle } from "../../types/inventarioExistencias.types";

const DEFAULT_IMAGE_URL =
  "https://cdn-icons-png.flaticon.com/512/10608/10608863.png";

const ASSETS_BASE_URL = "http://127.0.0.1:8000";

type Props = {
  item: ExistenciaDetalle | null;
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

function formatDate(value?: string | null) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProductoModelo(item: ExistenciaDetalle | null) {
  if (!item) return null;

  const row = item as ExistenciaDetalle & {
    producto?: { modelo?: string | null };
    producto_modelo?: string | null;
    modelo?: string | null;
  };

  return row.producto?.modelo ?? row.producto_modelo ?? row.modelo ?? null;
}

function getProductoSku(item: ExistenciaDetalle | null) {
  if (!item) return null;

  const row = item as ExistenciaDetalle & {
    producto?: { sku?: string | null };
    producto_sku?: string | null;
    sku?: string | null;
  };

  return row.producto?.sku ?? row.producto_sku ?? row.sku ?? null;
}

function getProductoCodigoBarras(item: ExistenciaDetalle | null) {
  if (!item) return null;

  const row = item as ExistenciaDetalle & {
    producto?: { codigo_barras?: string | null };
    producto_codigo_barras?: string | null;
    codigo_barras?: string | null;
  };

  return (
    row.producto?.codigo_barras ??
    row.producto_codigo_barras ??
    row.codigo_barras ??
    null
  );
}

function getProductoImagen(item: ExistenciaDetalle | null) {
  if (!item) return null;

  const row = item as ExistenciaDetalle & {
    producto?: { imagen_ruta?: string | null; imagen_url?: string | null };
    producto_imagen_ruta?: string | null;
    producto_imagen_url?: string | null;
    imagen_ruta?: string | null;
  };

  return (
    row.producto?.imagen_ruta ??
    row.producto?.imagen_url ??
    row.producto_imagen_ruta ??
    row.producto_imagen_url ??
    row.imagen_ruta ??
    null
  );
}

function getSucursalNombre(item: ExistenciaDetalle | null) {
  if (!item) return "-";

  const row = item as ExistenciaDetalle & {
    ubicacion?: {
      sucursal_nombre?: string | null;
      id_sucursal?: number | null;
    };
    sucursal_nombre?: string | null;
  };

  return (
    row.ubicacion?.sucursal_nombre ??
    row.sucursal_nombre ??
    `Sucursal #${row.ubicacion?.id_sucursal ?? "-"}`
  );
}

export default function InventarioExistenciasDetail({ item }: Props) {
  if (!item) {
    return (
      <div className="rounded-2xl border border-black/10 bg-black/5 p-6 text-center text-sm font-semibold text-slate-600">
        No hay información disponible para esta existencia.
      </div>
    );
  }

  const esRegistroVirtual = item.es_existencia_real === false;

  const nombreProducto = item.producto?.nombre ?? "Producto sin nombre";
  const modelo = getProductoModelo(item);
  const sku = getProductoSku(item);
  const codigoBarras = getProductoCodigoBarras(item);
  const sucursalNombre = getSucursalNombre(item);
  const ubicacionNombre = item.ubicacion?.nombre ?? "-";
  const ubicacionTipo = item.ubicacion?.tipo ?? "-";
  const ubicacionCodigo = item.ubicacion?.codigo ?? "-";
  const imgRaw = getProductoImagen(item);
  const imgSrc = imgRaw?.trim()
    ? normalizeImgSrc(String(imgRaw))
    : DEFAULT_IMAGE_URL;

  return (
    <div className="space-y-5">
      {esRegistroVirtual ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Este es un registro virtual de cobertura. Aún no existe una fila real
          en inventario para esta ubicación, pero actualmente su existencia es
          0.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex justify-center md:w-48">
          <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
            <img
              src={imgSrc}
              alt={nombreProducto}
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== DEFAULT_IMAGE_URL) {
                  img.src = DEFAULT_IMAGE_URL;
                }
              }}
              className="h-32 w-32 rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Producto" value={nombreProducto} strong />
          <Field label="Modelo" value={modelo || "-"} />
          <Field label="SKU" value={sku || "-"} />
          <Field label="Código de barras" value={codigoBarras || "-"} />
          <Field
            label="Existencia actual"
            value={String(item.existencia ?? 0)}
            strong
          />
          <Field label="Sucursal" value={sucursalNombre} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Ubicación" value={ubicacionNombre} />
        <Field label="Tipo de ubicación" value={ubicacionTipo} />
        <Field label="Código de ubicación" value={ubicacionCodigo} />
        <Field label="ID ubicación" value={String(item.id_ubicacion)} />
        <Field
          label="ID existencia"
          value={item.id_existencia != null ? String(item.id_existencia) : "-"}
        />
        <Field
          label="Tipo de registro"
          value={esRegistroVirtual ? "Virtual (cobertura)" : "Real"}
        />
        <Field label="Creado en" value={formatDate(item.creado_en)} />
        <Field label="Actualizado en" value={formatDate(item.actualizado_en)} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={[
          "mt-1 text-sm text-slate-900",
          strong ? "font-extrabold" : "font-semibold",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
