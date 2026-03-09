// src/modules/proveedores/pages/proveedores/ProveedoresForm.tsx
// Formulario de proveedores.
// Responsabilidades:
// - CREAR: registrar proveedor.
// - EDITAR: editar proveedor con el mismo diseño, precargado.
// - VER: solo lectura, muestra toda la información del proveedor.

import { useMemo, useState } from "react";
import type {
  Proveedor,
  ProveedorCreate,
  ProveedorTipo,
  ProveedorUpdate,
} from "../../types/proveedores.types";
import { proveedoresService } from "../../services/proveedores.service";

export type ProveedoresFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: ProveedoresFormModo;
  initialProveedor: Proveedor | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  tipo: ProveedorTipo;
  razon_social: string;
  nombre_contacto: string;
  telefono: string;
  correo: string;
  direccion: string;
  condiciones_pago: string;
  notas: string;
};

function buildInitialForm(
  modo: ProveedoresFormModo,
  proveedor: Proveedor | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && proveedor) {
    return {
      tipo: proveedor.tipo ?? "REGISTRADO",
      razon_social: proveedor.razon_social ?? "",
      nombre_contacto: proveedor.nombre_contacto ?? "",
      telefono: proveedor.telefono ?? "",
      correo: proveedor.correo ?? "",
      direccion: proveedor.direccion ?? "",
      condiciones_pago: proveedor.condiciones_pago ?? "",
      notas: proveedor.notas ?? "",
    };
  }

  return {
    tipo: "REGISTRADO",
    razon_social: "",
    nombre_contacto: "",
    telefono: "",
    correo: "",
    direccion: "",
    condiciones_pago: "",
    notas: "",
  };
}

export default function ProveedoresForm({
  modo,
  initialProveedor,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialProveedor),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar proveedor";
    if (modo === "EDITAR") {
      return `Editar proveedor: ${initialProveedor?.razon_social ?? ""}`;
    }
    return `Visualizar proveedor: ${initialProveedor?.razon_social ?? ""}`;
  }, [modo, initialProveedor]);

  function validarCrearEditar(): string {
    if (!form.tipo) return "Te falta seleccionar el tipo de proveedor.";
    if (!form.razon_social.trim()) return "Te falta registrar la razón social.";
    if (!form.nombre_contacto.trim()) {
      return "Te falta registrar el nombre de contacto.";
    }
    if (!form.telefono.trim()) return "Te falta registrar el teléfono.";

    return "";
  }

  async function guardar() {
    const err = validarCrearEditar();
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      if (modo === "CREAR") {
        const payload: ProveedorCreate = {
          tipo: form.tipo,
          razon_social: form.razon_social.trim(),
          nombre_contacto: form.nombre_contacto.trim(),
          telefono: form.telefono.trim(),
          correo: form.correo.trim() || null,
          direccion: form.direccion.trim(),
          condiciones_pago: form.condiciones_pago.trim(),
          notas: form.notas.trim(),
        };

        await proveedoresService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialProveedor) {
        setMsgError("No se encontró el proveedor a editar.");
        return;
      }

      const payload: ProveedorUpdate = {
        tipo: form.tipo,
        razon_social: form.razon_social.trim(),
        nombre_contacto: form.nombre_contacto.trim(),
        telefono: form.telefono.trim(),
        correo: form.correo.trim() || null,
        direccion: form.direccion.trim(),
        condiciones_pago: form.condiciones_pago.trim(),
        notas: form.notas.trim(),
      };

      await proveedoresService.actualizar(
        initialProveedor.id_proveedor,
        payload,
      );
      onSuccess();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Ocurrió un error al guardar.";
      setMsgError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Tipo</label>
          <select
            value={form.tipo}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                tipo: e.target.value as ProveedorTipo,
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          >
            <option value="REGISTRADO">Registrado</option>
            <option value="EXTERNO">Externo</option>
          </select>
        </div>

        {/* Razón social */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Razón social</label>
          <input
            value={form.razon_social}
            onChange={(e) =>
              setForm((p) => ({ ...p, razon_social: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Nombre de contacto */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Nombre de contacto</label>
          <input
            value={form.nombre_contacto}
            onChange={(e) =>
              setForm((p) => ({ ...p, nombre_contacto: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Teléfono</label>
          <input
            value={form.telefono}
            onChange={(e) =>
              setForm((p) => ({ ...p, telefono: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Correo */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Correo (opcional)</label>
          <input
            value={form.correo}
            onChange={(e) => setForm((p) => ({ ...p, correo: e.target.value }))}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Dirección</label>
          <input
            value={form.direccion}
            onChange={(e) =>
              setForm((p) => ({ ...p, direccion: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Condiciones de pago */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Condiciones de pago</label>
          <input
            value={form.condiciones_pago}
            onChange={(e) =>
              setForm((p) => ({ ...p, condiciones_pago: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Notas</label>
          <textarea
            value={form.notas}
            onChange={(e) => setForm((p) => ({ ...p, notas: e.target.value }))}
            disabled={readOnly}
            rows={4}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>
      </div>

      {/* Footer: en VER no hay botones */}
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
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : modo === "CREAR"
                ? "Crear"
                : "Actualizar"}
          </button>
        </div>
      ) : null}

      {/* Visualización extra */}
      {modo === "VER" && initialProveedor ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">Estatus</div>
            <div className="text-sm font-semibold text-black/80">
              {initialProveedor.estatus}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha de creación
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialProveedor.creado_en ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Última actualización
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialProveedor.actualizado_en ?? "-"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
