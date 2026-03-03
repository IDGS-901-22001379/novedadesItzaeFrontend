// src/modules/clientes/components/clientes/ClientesFormFields.tsx
// Campos del formulario de clientes comerciales.
// Responsabilidades: solo UI (inputs/selects) y actualizar el estado en el padre.

import type { TipoCliente } from "../../types/clientes.types";

export type ClientesFormModo = "CREAR" | "EDITAR" | "VER";

export type ClientesFormState = {
  numero_cliente: string;

  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;

  correo: string;
  telefono: string;
  direccion: string;

  id_tipo_cliente: number;

  credito_habilitado: boolean;
  credito_limite: string;
  credito_dias: string;
  credito_observaciones: string;
};

type Props = {
  modo: ClientesFormModo;
  readOnly: boolean;
  tiposDisponibles: TipoCliente[];

  form: ClientesFormState;
  setForm: React.Dispatch<React.SetStateAction<ClientesFormState>>;
};

export default function ClientesFormFields({
  modo,
  readOnly,
  tiposDisponibles,
  form,
  setForm,
}: Props) {
  const showNumeroCliente = modo === "CREAR" || modo === "VER";

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {showNumeroCliente ? (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">
              Número de cliente {modo === "CREAR" ? "(opcional)" : ""}
            </label>
            <input
              value={form.numero_cliente}
              onChange={(e) =>
                setForm((p) => ({ ...p, numero_cliente: e.target.value }))
              }
              disabled={readOnly || modo !== "CREAR"}
              placeholder={
                modo === "CREAR"
                  ? "Si lo dejas vacío, el sistema lo autogenera"
                  : ""
              }
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Tipo de cliente</label>
          <select
            value={String(form.id_tipo_cliente)}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                id_tipo_cliente: Number(e.target.value),
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          >
            {tiposDisponibles.map((t) => (
              <option key={t.id_tipo_cliente} value={String(t.id_tipo_cliente)}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Nombre</label>
          <input
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Apellido paterno</label>
          <input
            value={form.apellido_paterno}
            onChange={(e) =>
              setForm((p) => ({ ...p, apellido_paterno: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Apellido materno (opcional)
          </label>
          <input
            value={form.apellido_materno}
            onChange={(e) =>
              setForm((p) => ({ ...p, apellido_materno: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Correo (opcional)</label>
          <input
            value={form.correo}
            onChange={(e) => setForm((p) => ({ ...p, correo: e.target.value }))}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Teléfono (opcional)</label>
          <input
            value={form.telefono}
            onChange={(e) =>
              setForm((p) => ({ ...p, telefono: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Dirección (opcional)</label>
          <input
            value={form.direccion}
            onChange={(e) =>
              setForm((p) => ({ ...p, direccion: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>
      </div>

      <div className="mt-2 rounded-2xl border border-black/10 bg-black/5 p-4">
        <div className="text-sm font-extrabold text-black/70">Crédito</div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.credito_habilitado}
              onChange={(e) =>
                setForm((p) => ({ ...p, credito_habilitado: e.target.checked }))
              }
              disabled={readOnly}
              className="h-4 w-4"
            />
            <label className="text-sm font-semibold text-black/70">
              Crédito habilitado
            </label>
          </div>

          <div className="text-xs font-semibold text-black/50 md:text-right">
            Si está deshabilitado, el cliente no puede comprar a crédito.
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Límite</label>
            <input
              value={form.credito_limite}
              onChange={(e) =>
                setForm((p) => ({ ...p, credito_limite: e.target.value }))
              }
              disabled={readOnly || !form.credito_habilitado}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Días</label>
            <input
              value={form.credito_dias}
              onChange={(e) =>
                setForm((p) => ({ ...p, credito_dias: e.target.value }))
              }
              disabled={readOnly || !form.credito_habilitado}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-extrabold">
              Observaciones (opcional)
            </label>
            <input
              value={form.credito_observaciones}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  credito_observaciones: e.target.value,
                }))
              }
              disabled={readOnly || !form.credito_habilitado}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </>
  );
}
