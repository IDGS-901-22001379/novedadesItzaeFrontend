// src/modules/productos/components/productos/precios/ProductoPrecioRegistroPanel.tsx

import type { ProductosTheme } from "../../../theme/productosTheme";
import type {
  Moneda,
  PrecioProductoFormState,
  PresentacionPrecio,
  ProductoLite,
  TipoClienteCatalogo,
} from "../../../types/productos.types";
import {
  MONEDAS_OPTIONS,
  PRESENTACIONES_PRECIO_OPTIONS,
} from "../../../types/productos.types";
import type { LoadState, PrecioFormMode } from "./useProductoPreciosModal";
import { moneyMXN } from "./productoPreciosModal.utils";

type Props = {
  theme: ProductosTheme;
  producto: ProductoLite;
  tiposClienteOrdenados: TipoClienteCatalogo[];
  formOpen: boolean;
  formMode: PrecioFormMode;
  form: PrecioProductoFormState;
  updateForm: <K extends keyof PrecioProductoFormState>(
    key: K,
    value: PrecioProductoFormState[K],
  ) => void;
  tipoClienteNombreSeleccionado: string;
  loadTiposState: LoadState;
  errorTipos: string;
  saveError: string;
  saveSuccess: string;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  resetAndCloseForm: () => void;
};

export default function ProductoPrecioRegistroPanel({
  theme,
  producto,
  tiposClienteOrdenados,
  formOpen,
  formMode,
  form,
  updateForm,
  tipoClienteNombreSeleccionado,
  loadTiposState,
  errorTipos,
  saveError,
  saveSuccess,
  saving,
  onSubmit,
  resetAndCloseForm,
}: Props) {
  if (!formOpen && !saveSuccess) return null;

  const isViewMode = formMode === "VER";
  const isEditMode = formMode === "EDITAR";

  const title =
    formMode === "VER"
      ? "Detalle de precio"
      : formMode === "EDITAR"
        ? "Editar precio"
        : "Registro de precio";

  const badgeText =
    formMode === "VER"
      ? "Consulta"
      : formMode === "EDITAR"
        ? "Edición"
        : "Captura";

  return (
    <>
      {saveSuccess ? (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {saveSuccess}
        </div>
      ) : null}

      {formOpen ? (
        <div className="mb-4 rounded-2xl border border-black/10 bg-slate-50 p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                {title}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Producto:{" "}
                <span className="font-extrabold">{producto.nombre}</span>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ${theme.headerBg} ${theme.headerText}`}
            >
              {badgeText}
            </span>
          </div>

          {saveError ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {saveError}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-900">
                  Tipo de cliente
                </label>
                <select
                  value={form.id_tipo_cliente}
                  onChange={(e) =>
                    updateForm(
                      "id_tipo_cliente",
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                  disabled={
                    saving || loadTiposState === "loading" || isViewMode
                  }
                  className={[
                    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-60",
                    theme.inputBorder,
                    theme.inputFocusRing,
                    theme.inputText,
                  ].join(" ")}
                >
                  <option value="">Selecciona un tipo de cliente</option>
                  {tiposClienteOrdenados.map((tipo) => (
                    <option
                      key={tipo.id_tipo_cliente}
                      value={tipo.id_tipo_cliente}
                    >
                      {tipo.nombre}
                    </option>
                  ))}
                </select>

                {loadTiposState === "loading" ? (
                  <div className="text-xs font-semibold text-slate-500">
                    Cargando tipos de cliente...
                  </div>
                ) : null}

                {errorTipos ? (
                  <div className="text-xs font-semibold text-red-600">
                    {errorTipos}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-900">
                  Presentación
                </label>
                <select
                  value={form.presentacion}
                  onChange={(e) =>
                    updateForm(
                      "presentacion",
                      e.target.value as PresentacionPrecio,
                    )
                  }
                  disabled={saving || isViewMode}
                  className={[
                    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-60",
                    theme.inputBorder,
                    theme.inputFocusRing,
                    theme.inputText,
                  ].join(" ")}
                >
                  {PRESENTACIONES_PRECIO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-900">
                  Moneda
                </label>
                <select
                  value={form.moneda}
                  onChange={(e) =>
                    updateForm("moneda", e.target.value as Moneda)
                  }
                  disabled={saving || isViewMode}
                  className={[
                    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-60",
                    theme.inputBorder,
                    theme.inputFocusRing,
                    theme.inputText,
                  ].join(" ")}
                >
                  {MONEDAS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-900">
                  Precio
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => updateForm("precio", e.target.value)}
                  placeholder="Ej. 129.90"
                  disabled={saving || isViewMode}
                  className={[
                    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-60",
                    theme.inputBorder,
                    theme.inputFocusRing,
                    theme.inputText,
                    theme.inputPlaceholder,
                  ].join(" ")}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-900">
                  Vigente desde
                </label>
                <input
                  type="date"
                  value={form.vigente_desde}
                  onChange={(e) => updateForm("vigente_desde", e.target.value)}
                  disabled={saving || isViewMode}
                  className={[
                    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-60",
                    theme.inputBorder,
                    theme.inputFocusRing,
                    theme.inputText,
                  ].join(" ")}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-slate-900">
                  Vigente hasta
                </label>
                <input
                  type="date"
                  value={form.vigente_hasta}
                  onChange={(e) => updateForm("vigente_hasta", e.target.value)}
                  disabled={saving || isViewMode}
                  className={[
                    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-60",
                    theme.inputBorder,
                    theme.inputFocusRing,
                    theme.inputText,
                  ].join(" ")}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => updateForm("activo", e.target.checked)}
                  disabled={saving || isViewMode}
                  className="h-4 w-4 rounded border-black/20"
                />
                <div className="text-sm font-semibold text-slate-700">
                  {isViewMode
                    ? "Precio marcado como "
                    : "Registrar precio como "}
                  <span className="font-extrabold">activo</span>
                </div>
              </label>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="text-xs font-extrabold uppercase tracking-wide text-blue-700">
                Resumen del registro
              </div>

              <div className="mt-2 grid grid-cols-1 gap-2 text-sm font-semibold text-blue-900 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  Cliente:{" "}
                  <span className="font-extrabold">
                    {tipoClienteNombreSeleccionado || "-"}
                  </span>
                </div>
                <div>
                  Presentación:{" "}
                  <span className="font-extrabold">{form.presentacion}</span>
                </div>
                <div>
                  Moneda: <span className="font-extrabold">{form.moneda}</span>
                </div>
                <div>
                  Precio:{" "}
                  <span className="font-extrabold">
                    {form.precio ? moneyMXN(Number(form.precio)) : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetAndCloseForm}
                disabled={saving}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                {isViewMode ? "Cerrar" : "Cancelar"}
              </button>

              {!isViewMode ? (
                <button
                  type="submit"
                  disabled={saving || loadTiposState === "loading"}
                  className="rounded-xl border border-emerald-600 bg-emerald-500 px-5 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
                >
                  {saving
                    ? "Guardando..."
                    : isEditMode
                      ? "Guardar cambios"
                      : "Guardar precio"}
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
