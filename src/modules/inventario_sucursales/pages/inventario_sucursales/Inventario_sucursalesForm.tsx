// src/modules/inventario_sucursales/pages/inventario-sucursales/Inventario_sucursalesForm.tsx
// Formulario de Inventario - Sucursales.
// Responsabilidades:
// - CREAR: registrar sucursal.
// - EDITAR: editar sucursal.
// - VER: solo lectura, muestra la información completa.

import { useMemo, useState } from "react";
import type {
  InventarioSucursal,
  InventarioSucursalCreate,
  InventarioSucursalUpdate,
} from "../../types";
import { inventarioSucursalesService } from "../../services";
import { getApiErrorMessage } from "../../../../services/http/getApiErrorMessage";

export type InventarioSucursalesFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: InventarioSucursalesFormModo;
  initialSucursal: InventarioSucursal | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  nombre: string;
  codigo: string;
  telefono: string;
  direccion: string;
};

function buildInitialForm(
  modo: InventarioSucursalesFormModo,
  sucursal: InventarioSucursal | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && sucursal) {
    return {
      nombre: sucursal.nombre ?? "",
      codigo: sucursal.codigo ?? "",
      telefono: sucursal.telefono ?? "",
      direccion: sucursal.direccion ?? "",
    };
  }

  return {
    nombre: "",
    codigo: "",
    telefono: "",
    direccion: "",
  };
}

export default function Inventario_sucursalesForm({
  modo,
  initialSucursal,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialSucursal),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar sucursal";
    if (modo === "EDITAR") {
      return `Editar sucursal: ${initialSucursal?.nombre ?? ""}`;
    }
    return `Visualizar sucursal: ${initialSucursal?.nombre ?? ""}`;
  }, [modo, initialSucursal]);

  function validarCrearEditar(): string {
    if (!form.nombre.trim()) return "Te falta registrar el nombre.";
    if (!form.codigo.trim()) return "Te falta registrar el código.";
    if (!form.telefono.trim()) return "Te falta registrar el teléfono.";
    if (!form.direccion.trim()) return "Te falta registrar la dirección.";
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
        const payload: InventarioSucursalCreate = {
          nombre: form.nombre.trim(),
          codigo: form.codigo.trim(),
          telefono: form.telefono.trim(),
          direccion: form.direccion.trim(),
        };

        await inventarioSucursalesService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialSucursal) {
        setMsgError("No se encontró la sucursal a editar.");
        return;
      }

      const payload: InventarioSucursalUpdate = {
        nombre: form.nombre.trim(),
        codigo: form.codigo.trim(),
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim(),
      };

      await inventarioSucursalesService.actualizar(
        initialSucursal.id_sucursal,
        payload,
      );
      onSuccess();
    } catch (e: unknown) {
      const msg = getApiErrorMessage(e, "No se pudo guardar la sucursal.");
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
        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Nombre</label>
          <input
            value={form.nombre}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nombre: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Código */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Código</label>
          <input
            value={form.codigo}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, codigo: e.target.value }))
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
              setForm((prev) => ({ ...prev, telefono: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Dirección</label>
          <input
            value={form.direccion}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, direccion: e.target.value }))
            }
            disabled={readOnly}
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
      {modo === "VER" && initialSucursal ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">Estatus</div>
            <div className="text-sm font-semibold text-black/80">
              {initialSucursal.activo ? "ACTIVO" : "INACTIVO"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha de creación
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialSucursal.creado_en ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Última actualización
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialSucursal.actualizado_en ?? "-"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
