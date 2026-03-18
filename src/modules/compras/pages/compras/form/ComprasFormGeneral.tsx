// src/modules/compras/pages/compras/form/ComprasFormGeneral.tsx

import { FORMAS_PAGO } from "./comprasForm.utils";
import type {
  FormState,
  ProveedorBusquedaItem,
  UbicacionDestinoOption,
} from "./comprasForm.types";

type Props = {
  readOnly: boolean;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;

  ubicacionesDestino: UbicacionDestinoOption[];
  loadingUbicaciones: boolean;
  onSelectUbicacion: (idUbicacion: number) => void;

  proveedorQuery: string;
  setProveedorQuery: React.Dispatch<React.SetStateAction<string>>;
  escribirProveedorQuery: (value: string) => void;
  proveedoresEncontrados: ProveedorBusquedaItem[];
  loadingProveedores: boolean;
  onSelectProveedor: (proveedor: ProveedorBusquedaItem) => void;
  onClearProveedor: () => void;

  viewProveedorLabel?: string;
  viewUbicacionLabel?: string;
};

export default function ComprasFormGeneral({
  readOnly,
  form,
  setForm,

  ubicacionesDestino,
  loadingUbicaciones,
  onSelectUbicacion,

  proveedorQuery,
  escribirProveedorQuery,
  proveedoresEncontrados,
  loadingProveedores,
  onSelectProveedor,
  onClearProveedor,

  viewProveedorLabel,
  viewUbicacionLabel,
}: Props) {
  const showProveedorDropdown =
    !readOnly &&
    !form.usarProveedorExterno &&
    !form.id_proveedor &&
    proveedorQuery.trim().length > 0;

  const formaPagoLabel =
    FORMAS_PAGO.find((fp) => fp.id === form.id_forma_pago)?.label ?? "Sin dato";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Datos generales
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Forma de pago</label>

          {readOnly ? (
            <input
              value={formaPagoLabel}
              disabled
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          ) : (
            <select
              value={String(form.id_forma_pago)}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  id_forma_pago: Number(e.target.value),
                }))
              }
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            >
              {FORMAS_PAGO.map((fp) => (
                <option key={fp.id} value={String(fp.id)}>
                  {fp.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Ubicación destino</label>

          {readOnly ? (
            <input
              value={viewUbicacionLabel || "Sin ubicación registrada"}
              disabled
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          ) : (
            <select
              value={
                form.id_ubicacion_destino === ""
                  ? ""
                  : String(form.id_ubicacion_destino)
              }
              onChange={(e) =>
                onSelectUbicacion(
                  e.target.value === "" ? 0 : Number(e.target.value),
                )
              }
              disabled={loadingUbicaciones}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
            >
              <option value="">
                {loadingUbicaciones
                  ? "Cargando ubicaciones..."
                  : "Selecciona una ubicación"}
              </option>

              {ubicacionesDestino.map((ubicacion) => (
                <option
                  key={ubicacion.id_ubicacion}
                  value={String(ubicacion.id_ubicacion)}
                >
                  {ubicacion.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Documento de referencia
          </label>
          <input
            value={form.documento_referencia}
            onChange={(e) =>
              setForm((p) => ({ ...p, documento_referencia: e.target.value }))
            }
            disabled={readOnly}
            placeholder="Ej. FAC-1001"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Tipo proveedor</label>

          {readOnly ? (
            <input
              value={
                form.usarProveedorExterno
                  ? "Proveedor externo"
                  : "Proveedor registrado"
              }
              disabled
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          ) : (
            <select
              value={form.usarProveedorExterno ? "EXTERNO" : "CATALOGO"}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  usarProveedorExterno: e.target.value === "EXTERNO",
                  id_proveedor:
                    e.target.value === "EXTERNO" ? "" : p.id_proveedor,
                }))
              }
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            >
              <option value="CATALOGO">Proveedor registrado</option>
              <option value="EXTERNO">Proveedor externo</option>
            </select>
          )}
        </div>

        {!form.usarProveedorExterno ? (
          <div className="relative flex flex-col gap-1 md:col-span-2 xl:col-span-2">
            <label className="text-xs font-extrabold">Proveedor</label>

            {readOnly ? (
              <input
                value={viewProveedorLabel || "Sin proveedor registrado"}
                disabled
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
              />
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={proveedorQuery}
                    onChange={(e) => escribirProveedorQuery(e.target.value)}
                    placeholder="Buscar proveedor activo..."
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
                  />

                  <button
                    type="button"
                    onClick={onClearProveedor}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-black/70 hover:bg-black/5"
                  >
                    Limpiar
                  </button>
                </div>

                {showProveedorDropdown ? (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
                    {loadingProveedores ? (
                      <div className="px-3 py-3 text-sm font-semibold text-slate-600">
                        Buscando proveedores...
                      </div>
                    ) : proveedoresEncontrados.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {proveedoresEncontrados.map((proveedor) => (
                          <button
                            key={proveedor.id_proveedor}
                            type="button"
                            onClick={() => onSelectProveedor(proveedor)}
                            className="block w-full border-b border-black/5 px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 last:border-b-0"
                          >
                            {proveedor.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-3 text-sm font-semibold text-slate-500">
                        No se encontraron proveedores activos.
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-2">
              <label className="text-xs font-extrabold">
                Nombre proveedor externo
              </label>
              <input
                value={form.proveedor_externo_nombre}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    proveedor_externo_nombre: e.target.value,
                  }))
                }
                disabled={readOnly}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold">Contacto</label>
              <input
                value={form.proveedor_externo_contacto}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    proveedor_externo_contacto: e.target.value,
                  }))
                }
                disabled={readOnly}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold">Teléfono</label>
              <input
                value={form.proveedor_externo_telefono}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    proveedor_externo_telefono: e.target.value,
                  }))
                }
                disabled={readOnly}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-4">
              <label className="text-xs font-extrabold">Descripción</label>
              <textarea
                value={form.proveedor_externo_descripcion}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    proveedor_externo_descripcion: e.target.value,
                  }))
                }
                disabled={readOnly}
                rows={2}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-4">
          <label className="text-xs font-extrabold">Observaciones</label>
          <textarea
            value={form.observaciones}
            onChange={(e) =>
              setForm((p) => ({ ...p, observaciones: e.target.value }))
            }
            disabled={readOnly}
            rows={3}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>
      </div>
    </div>
  );
}
