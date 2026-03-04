// src/modules/clientes_fiscales/components/clientes_fiscales/form/ClientesFiscalesFields.tsx
// Campos del formulario Clientes Fiscales (UI).
// MISMO estilo de inputs que UsuariosForm.
// Ajuste solicitado:
// - El cliente comercial se selecciona AQUÍ (en el modal) con autocomplete.
// - NO mostrar "Cliente #id" ni número/id.

import type { ClientesFiscalesFormState } from "../../pages/clientes/ClientesFiscalesForm";
import ClientesFiscalesClienteAutocomplete, {
  type ClienteComercialOption,
} from "../clientes_fiscales/ClientesFiscalesClienteAutocomplete";

type Props = {
  form: ClientesFiscalesFormState;
  readOnly: boolean;
  onChange: (patch: Partial<ClientesFiscalesFormState>) => void;

  // Estos catálogos los pasamos desde el padre (luego los conectamos a API real)
  regimenes: { id: number; label: string }[];
  usosCfdi: { id: number; label: string }[];
};

export default function ClientesFiscalesFields({
  form,
  readOnly,
  onChange,
  regimenes,
  usosCfdi,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* Cliente comercial (SELECCIÓN EN MODAL) */}
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Cliente comercial</label>

        {readOnly ? (
          <input
            value={form.cliente_nombre || "—"}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        ) : (
          <ClientesFiscalesClienteAutocomplete
            value={
              form.id_cliente > 0 && form.cliente_nombre
                ? ({
                    id_cliente: form.id_cliente,
                    label: form.cliente_nombre,
                  } as ClienteComercialOption)
                : null
            }
            onChange={(c) => {
              onChange({
                id_cliente: c?.id_cliente ?? 0,
                cliente_nombre: c?.label ?? "",
              });
            }}
          />
        )}
      </div>

      {/* RFC */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">RFC</label>
        <input
          value={form.rfc}
          onChange={(e) => onChange({ rfc: e.target.value })}
          disabled={readOnly}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      {/* Razón social */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Razón social</label>
        <input
          value={form.razon_social}
          onChange={(e) => onChange({ razon_social: e.target.value })}
          disabled={readOnly}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      {/* Régimen fiscal */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Régimen fiscal</label>
        <select
          value={String(form.id_regimen_fiscal)}
          onChange={(e) =>
            onChange({ id_regimen_fiscal: Number(e.target.value) })
          }
          disabled={readOnly}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="0">Selecciona...</option>
          {regimenes.map((r) => (
            <option key={r.id} value={String(r.id)}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Código postal fiscal */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Código postal fiscal</label>
        <input
          value={form.codigo_postal_fiscal}
          onChange={(e) => onChange({ codigo_postal_fiscal: e.target.value })}
          disabled={readOnly}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      {/* Correo envío */}
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Correo de envío</label>
        <input
          value={form.correo_envio}
          onChange={(e) => onChange({ correo_envio: e.target.value })}
          disabled={readOnly}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      {/* Uso CFDI */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Uso CFDI</label>
        <select
          value={String(form.id_uso_cfdi)}
          onChange={(e) => onChange({ id_uso_cfdi: Number(e.target.value) })}
          disabled={readOnly}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="0">Selecciona...</option>
          {usosCfdi.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      {/* Teléfono */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Teléfono</label>
        <input
          value={form.telefono}
          onChange={(e) => onChange({ telefono: e.target.value })}
          disabled={readOnly}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      {/* Predeterminado */}
      <div className="flex items-center gap-3 md:col-span-2">
        <input
          id="pred"
          type="checkbox"
          checked={form.es_predeterminado}
          onChange={(e) => onChange({ es_predeterminado: e.target.checked })}
          disabled={readOnly}
          className="h-4 w-4"
        />
        <label htmlFor="pred" className="text-sm font-extrabold text-black/70">
          Es predeterminado para facturación
        </label>
      </div>
    </div>
  );
}
