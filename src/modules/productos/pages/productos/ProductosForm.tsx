import { useProductosTheme } from "../../theme/useProductosTheme";

import ProductosBasicFields from "../../components/productos/form/ProductosBasicFields";
import ProductosCatalogFields from "../../components/productos/form/ProductosCatalogFields";
import ProductosInventarioFields from "../../components/productos/form/ProductosInventarioFields";
import ProductosImagenFields from "../../components/productos/form/ProductosImagenFields";
import ProductosFacturacionFields from "../../components/productos/form/ProductosFacturacionFields";
import ProductosSection from "../../components/productos/form/ProductosSection";

import type { ProductosFormProps } from "./form/productosForm.types";
import { useProductosForm } from "./form/useProductosForm";

export default function ProductosForm({
  modo,
  initialProducto,
  onSuccess,
  onCancel,
}: ProductosFormProps) {
  const theme = useProductosTheme();

  const {
    readOnly,
    subtitulo,
    form,
    setForm,
    saving,
    msgError,
    tipos,
    categorias,
    marcas,
    unidades,
    openImagen,
    setOpenImagen,
    openClasificacion,
    setOpenClasificacion,
    openInventario,
    setOpenInventario,
    openFacturacion,
    setOpenFacturacion,
    guardar,
  } = useProductosForm({ modo, initialProducto, onSuccess });

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      {/* Datos generales */}
      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="mb-3 text-sm font-extrabold text-black/70">
          Datos generales
        </div>

        <ProductosBasicFields
          readOnly={readOnly}
          form={form}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        />
      </div>

      {/* Imagen */}
      <ProductosSection
        theme={theme}
        title="Imagen (opcional)"
        open={openImagen}
        onToggle={() => setOpenImagen((v) => !v)}
      >
        <ProductosImagenFields
          readOnly={readOnly}
          form={form}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
          assetsBaseUrl="http://127.0.0.1:8000"
        />
      </ProductosSection>

      {/* Clasificación */}
      <ProductosSection
        theme={theme}
        title="Clasificación"
        open={openClasificacion}
        onToggle={() => setOpenClasificacion((v) => !v)}
      >
        <ProductosCatalogFields
          readOnly={readOnly}
          form={form}
          tipos={tipos}
          categorias={categorias}
          marcas={marcas}
          unidades={unidades}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        />
      </ProductosSection>

      {/* Inventario y caja */}
      <ProductosSection
        theme={theme}
        title="Inventario y caja"
        open={openInventario}
        onToggle={() => setOpenInventario((v) => !v)}
      >
        <ProductosInventarioFields
          readOnly={readOnly}
          form={form}
          unidades={unidades}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        />
      </ProductosSection>

      {/* Facturación */}
      <ProductosSection
        theme={theme}
        title="Facturación (CFDI)"
        open={openFacturacion}
        onToggle={() => setOpenFacturacion((v) => !v)}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-black/70">
            ¿Este producto es facturable?
          </div>

          <label className="flex items-center gap-2 text-sm font-extrabold text-black/70">
            <input
              type="checkbox"
              checked={form.facturable}
              disabled={readOnly}
              onChange={(e) =>
                setForm((p) => ({ ...p, facturable: e.target.checked }))
              }
              className="h-4 w-4"
            />
            Facturable
          </label>
        </div>

        <ProductosFacturacionFields
          readOnly={readOnly}
          facturable={form.facturable}
          form={form}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
        />
      </ProductosSection>

      {/* Footer */}
      {modo !== "VER" ? (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void guardar()}
            disabled={saving}
            className={[
              "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition disabled:opacity-50",
              "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
            ].join(" ")}
          >
            {saving
              ? "Guardando..."
              : modo === "CREAR"
                ? "Crear"
                : "Actualizar"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
