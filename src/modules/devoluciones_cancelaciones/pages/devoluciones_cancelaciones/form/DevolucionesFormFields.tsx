// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/DevolucionesFormFields.tsx
// Campos principales del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Renderizar venta, tipo, forma de pago, motivo, disposición, ubicación e importe.
// - Permitir búsqueda de venta por folio con autocomplete y navegación por teclado.

import type { KeyboardEvent } from "react";
import type {
  DevolucionTipo,
  DevolucionDisposicion,
} from "../../../types/devoluciones_cancelaciones.types";
import type { DevolucionVentaOption } from "../../../types/devoluciones_ventas.types";
import type { DevolucionFormaPagoOption } from "../../../types/devoluciones_catalogos.types";
import type { FormState, UbicacionOption } from "./devolucionesForm.types";

type Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  readOnly: boolean;
  isEditar: boolean;

  ventaQuery: string;
  setVentaQuery: (value: string) => void;
  ventasLoading: boolean;
  ventasOptions: DevolucionVentaOption[];
  ventaSeleccionada: DevolucionVentaOption | null;
  setVentaSeleccionada: (value: DevolucionVentaOption | null) => void;
  ventaOpen: boolean;
  setVentaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ventaActiveIndex: number;
  setVentaActiveIndex: React.Dispatch<React.SetStateAction<number>>;

  formasPagoLoading: boolean;
  formasPagoOptions: DevolucionFormaPagoOption[];
  ubicacionesLoading: boolean;
  ubicacionesOptions: UbicacionOption[];
};

export default function DevolucionesFormFields(props: Props) {
  const {
    form,
    setForm,
    readOnly,
    isEditar,
    ventaQuery,
    setVentaQuery,
    ventasLoading,
    ventasOptions,
    ventaSeleccionada,
    setVentaSeleccionada,
    ventaOpen,
    setVentaOpen,
    ventaActiveIndex,
    setVentaActiveIndex,
    formasPagoLoading,
    formasPagoOptions,
    ubicacionesLoading,
    ubicacionesOptions,
  } = props;

  function seleccionarVenta(item: DevolucionVentaOption) {
    setForm((p) => ({
      ...p,
      id_venta: String(item.id_venta),
    }));
    setVentaSeleccionada(item);
    setVentaQuery(item.label);
    setVentaOpen(false);
    setVentaActiveIndex(-1);
  }

  function limpiarVenta() {
    setForm((p) => ({
      ...p,
      id_venta: "",
    }));
    setVentaSeleccionada(null);
  }

  function onVentaKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!ventaOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (ventasOptions.length > 0) {
        setVentaOpen(true);
        setVentaActiveIndex(0);
      }
      return;
    }

    if (!ventaOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setVentaActiveIndex((prev) => {
        const next = prev + 1;
        return next >= ventasOptions.length ? 0 : next;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setVentaActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? ventasOptions.length - 1 : next;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (ventaActiveIndex >= 0 && ventaActiveIndex < ventasOptions.length) {
        seleccionarVenta(ventasOptions[ventaActiveIndex]);
      }
    }

    if (e.key === "Escape") {
      setVentaOpen(false);
      setVentaActiveIndex(-1);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Venta (folio)</label>

        {readOnly || isEditar ? (
          <input
            value={
              ventaSeleccionada?.label ||
              (form.id_venta ? `Venta seleccionada #${form.id_venta}` : "")
            }
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        ) : (
          <div className="relative">
            <input
              value={ventaQuery}
              onChange={(e) => {
                const value = e.target.value;
                setVentaQuery(value);
                setVentaOpen(true);
                setVentaActiveIndex(0);

                if (!value.trim()) {
                  limpiarVenta();
                }
              }}
              onFocus={() => {
                if (ventasOptions.length > 0) {
                  setVentaOpen(true);
                }
              }}
              onKeyDown={onVentaKeyDown}
              onBlur={() => {
                setTimeout(() => setVentaOpen(false), 150);
              }}
              placeholder="Buscar por folio..."
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            />

            {ventaOpen && (ventasOptions.length > 0 || ventasLoading) ? (
              <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-lg">
                {ventasLoading ? (
                  <div className="px-3 py-2 text-sm font-semibold text-slate-500">
                    Buscando ventas...
                  </div>
                ) : (
                  ventasOptions.map((item, index) => {
                    const isActive = index === ventaActiveIndex;

                    return (
                      <button
                        key={item.id_venta}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => seleccionarVenta(item)}
                        className={[
                          "block w-full px-3 py-2 text-left text-sm font-semibold",
                          isActive
                            ? "bg-[#E6F4EA] text-slate-900"
                            : "bg-white text-slate-900 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {item.label}
                      </button>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Tipo</label>
        <select
          value={form.tipo}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              tipo: e.target.value as DevolucionTipo,
            }))
          }
          disabled={readOnly || isEditar}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="TOTAL">TOTAL</option>
          <option value="PARCIAL">PARCIAL</option>
          <option value="CANCELACION">CANCELACION</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">
          Forma de pago reembolso
        </label>
        <select
          value={form.id_forma_pago_reembolso}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              id_forma_pago_reembolso: e.target.value,
            }))
          }
          disabled={readOnly || isEditar || formasPagoLoading}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="">
            {formasPagoLoading
              ? "Cargando formas de pago..."
              : "Selecciona una forma de pago"}
          </option>
          {formasPagoOptions.map((item) => (
            <option key={item.id_forma_pago} value={String(item.id_forma_pago)}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Motivo</label>
        <textarea
          value={form.motivo}
          onChange={(e) => setForm((p) => ({ ...p, motivo: e.target.value }))}
          disabled={readOnly}
          rows={3}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">
          Genera nota de crédito interna
        </label>
        <select
          value={form.genera_nota_credito_interna ? "SI" : "NO"}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              genera_nota_credito_interna: e.target.value === "SI",
            }))
          }
          disabled={readOnly || isEditar}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="NO">No</option>
          <option value="SI">Sí</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Disposición</label>
        <select
          value={form.disposicion}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              disposicion: e.target.value as DevolucionDisposicion,
              id_ubicacion_destino: "",
            }))
          }
          disabled={readOnly || isEditar}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="REGRESA_TIENDA">REGRESA_TIENDA</option>
          <option value="ENVIA_BODEGA">ENVIA_BODEGA</option>
          <option value="MERMA">MERMA</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Ubicación destino</label>
        <select
          value={form.id_ubicacion_destino}
          onChange={(e) =>
            setForm((p) => ({ ...p, id_ubicacion_destino: e.target.value }))
          }
          disabled={readOnly || isEditar || ubicacionesLoading}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="">
            {ubicacionesLoading
              ? "Cargando ubicaciones..."
              : "Selecciona una ubicación"}
          </option>
          {ubicacionesOptions.map((item) => (
            <option key={item.id_ubicacion} value={String(item.id_ubicacion)}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Importe devuelto</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.importe_devuelto}
          onChange={(e) =>
            setForm((p) => ({ ...p, importe_devuelto: e.target.value }))
          }
          disabled={readOnly || isEditar}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>
    </div>
  );
}
