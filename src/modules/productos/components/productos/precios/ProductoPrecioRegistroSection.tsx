// src/modules/productos/components/productos/precios/ProductoPrecioRegistroSection.tsx

import type { ProductosTheme } from "../../../theme/productosTheme";
import type {
  Moneda,
  PrecioProductoFormState,
  PresentacionPrecio,
  TipoClienteCatalogo,
} from "../../../types/productos.types";

import {
  MONEDAS_OPTIONS,
  PRESENTACIONES_PRECIO_OPTIONS,
} from "../../../types/productos.types";

import type { LoadState } from "./useProductoPreciosModal";
import { moneyMXN } from "./productoPreciosModal.utils";

type Props = {
  theme: ProductosTheme;
  onClose: () => void;

  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;

  form: PrecioProductoFormState;
  updateForm: <K extends keyof PrecioProductoFormState>(
    key: K,
    value: PrecioProductoFormState[K],
  ) => void;

  tiposClienteOrdenados: TipoClienteCatalogo[];
  tipoClienteNombreSeleccionado: string;

  loadTiposState: LoadState;
  errorTipos: string;
  saveError: string;
  saveSuccess: string;
  saving: boolean;

  onSubmit: (e: React.FormEvent) => Promise<void>;
  clearSaveMessages: () => void;
  resetAndCloseForm: () => void;
};

export default function ProductoPrecioRegistroSection({
  theme,
  onClose,
  formOpen,
  setFormOpen,
  form,
  updateForm,
  tiposClienteOrdenados,
  tipoClienteNombreSeleccionado,
  loadTiposState,
  errorTipos,
  saveError,
  saveSuccess,
  saving,
  onSubmit,
  clearSaveMessages,
  resetAndCloseForm,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-base font-extrabold text-slate-900">
            Registrar nuevo precio
          </div>
          <div className="text-sm font-semibold text-slate-500">
            El formulario se abre solo cuando quieras capturar un nuevo
            registro.
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            clearSaveMessages();
            setFormOpen((prev) => !prev);
          }}
          className={[
            "rounded-full px-4 py-2 text-sm font-extrabold shadow-sm transition",
            formOpen
              ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              : "border border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-600",
          ].join(" ")}
        >
          {formOpen ? "Cerrar registro" : "Nuevo registro"}
        </button>
      </div>

      {saveSuccess ? (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {saveSuccess}
        </div>
      ) : null}

      {formOpen ? (
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-extrabold text-slate-900">
                  Nuevo precio
                </div>
                <div className="text-sm font-semibold text-slate-500">
                  Captura tipo de cliente, presentación y vigencia.
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-extrabold ${theme.headerBg} ${theme.headerText}`}
              >
                Registro
              </span>
            </div>

            {saveError ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {saveError}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    disabled={saving || loadTiposState === "loading"}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    onChange={(e) =>
                      updateForm("vigente_desde", e.target.value)
                    }
                    disabled={saving}
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
                    onChange={(e) =>
                      updateForm("vigente_hasta", e.target.value)
                    }
                    disabled={saving}
                    className={[
                      "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:opacity-60",
                      theme.inputBorder,
                      theme.inputFocusRing,
                      theme.inputText,
                    ].join(" ")}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-slate-50 px-4 py-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => updateForm("activo", e.target.checked)}
                    disabled={saving}
                    className="h-4 w-4 rounded border-black/20"
                  />
                  <div className="text-sm font-semibold text-slate-700">
                    Registrar precio como{" "}
                    <span className="font-extrabold">activo</span>
                  </div>
                </label>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="text-xs font-extrabold uppercase tracking-wide text-blue-700">
                  Resumen del registro
                </div>

                <div className="mt-2 grid grid-cols-1 gap-2 text-sm font-semibold text-blue-900 sm:grid-cols-2">
                  <div>
                    Tipo de cliente:{" "}
                    <span className="font-extrabold">
                      {tipoClienteNombreSeleccionado || "-"}
                    </span>
                  </div>
                  <div>
                    Presentación:{" "}
                    <span className="font-extrabold">{form.presentacion}</span>
                  </div>
                  <div>
                    Moneda:{" "}
                    <span className="font-extrabold">{form.moneda}</span>
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
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving || loadTiposState === "loading"}
                  className="rounded-xl border border-emerald-600 bg-emerald-500 px-5 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
                >
                  {saving ? "Guardando..." : "Guardar precio"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-base font-extrabold text-slate-900">
              Cómo funciona
            </div>

            <div className="mt-3 space-y-3 text-sm font-semibold text-slate-700">
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3">
                Un mismo producto puede tener varios precios dependiendo del{" "}
                <span className="font-extrabold">tipo de cliente</span>.
              </div>

              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3">
                También puede variar por{" "}
                <span className="font-extrabold">presentación</span>: unidad o
                caja.
              </div>

              <div className="rounded-2xl border border-black/10 bg-slate-50 p-3">
                Ejemplo:
                <div className="mt-2 space-y-1 text-xs font-semibold text-slate-600">
                  <div>• Público general + UNIDAD = un precio</div>
                  <div>• Mayoreo + UNIDAD = otro precio</div>
                  <div>• Público general + CAJA = otro precio</div>
                  <div>• Mayoreo + CAJA = otro precio</div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
                Recomendación: usa fechas de vigencia para conservar historial y
                no perder cambios anteriores.
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Cerrar modal
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
