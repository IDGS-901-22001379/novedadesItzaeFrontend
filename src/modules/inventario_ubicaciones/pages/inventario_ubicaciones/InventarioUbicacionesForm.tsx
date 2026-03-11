// src/modules/inventario_ubicaciones/pages/inventario_ubicaciones/InventarioUbicacionesForm.tsx

import { useEffect, useMemo, useState } from "react";
import type {
  InventarioUbicacion,
  InventarioUbicacionCreate,
  InventarioUbicacionTipo,
  InventarioUbicacionUpdate,
} from "../../types/inventario_ubicaciones.types";
import { inventarioUbicacionesService } from "../../services/inventario_ubicaciones.service";
import { inventarioSucursalesService } from "../../../inventario_sucursales/services";

export type InventarioUbicacionesFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: InventarioUbicacionesFormModo;
  initialUbicacion: InventarioUbicacion | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  id_sucursal: number;
  tipo: InventarioUbicacionTipo;
  nombre: string;
  codigo: string;
  vendible: boolean;
};

type SucursalOption = {
  id: number;
  nombre: string;
};

function buildInitialForm(
  modo: InventarioUbicacionesFormModo,
  ubicacion: InventarioUbicacion | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && ubicacion) {
    return {
      id_sucursal: ubicacion.id_sucursal ?? 0,
      tipo: ubicacion.tipo ?? "TIENDA",
      nombre: ubicacion.nombre ?? "",
      codigo: ubicacion.codigo ?? "",
      vendible: Boolean(ubicacion.vendible),
    };
  }

  return {
    id_sucursal: 0,
    tipo: "TIENDA",
    nombre: "",
    codigo: "",
    vendible: true,
  };
}

function getErrorMessage(error: unknown): string {
  const maybeAxios = error as {
    response?: { data?: { detail?: unknown } };
    message?: string;
  };

  const detail = maybeAxios?.response?.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string };
    if (typeof first?.msg === "string" && first.msg.trim()) {
      return first.msg;
    }
  }

  if (error instanceof Error) return error.message;
  return "Ocurrió un error al guardar la ubicación.";
}

export default function InventarioUbicacionesForm({
  modo,
  initialUbicacion,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialUbicacion),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const [sucursales, setSucursales] = useState<SucursalOption[]>([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);

  const esBodega = form.tipo === "BODEGA";

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar ubicación";
    if (modo === "EDITAR") {
      return `Editar ubicación: ${initialUbicacion?.nombre ?? ""}`;
    }
    return `Visualizar ubicación: ${initialUbicacion?.nombre ?? ""}`;
  }, [modo, initialUbicacion]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingSucursales(true);

        const data = await inventarioSucursalesService.listar({
          solo_activos: false,
        });

        if (!mounted) return;

        setSucursales(
          Array.isArray(data)
            ? data.map((s) => ({
                id: s.id_sucursal,
                nombre: s.nombre,
              }))
            : [],
        );
      } catch {
        if (!mounted) return;
        setSucursales([]);
      } finally {
        if (mounted) setLoadingSucursales(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (form.tipo === "BODEGA" && form.vendible) {
      setForm((prev) => ({ ...prev, vendible: false }));
    }
  }, [form.tipo, form.vendible]);

  function validar(): string {
    if (!form.id_sucursal || form.id_sucursal <= 0) {
      return "Te falta seleccionar la sucursal.";
    }

    if (!form.tipo) {
      return "Te falta seleccionar el tipo de ubicación.";
    }

    if (!form.nombre.trim()) {
      return "Te falta registrar el nombre de la ubicación.";
    }

    if (!form.codigo.trim()) {
      return "Te falta registrar el código de la ubicación.";
    }

    return "";
  }

  async function guardar() {
    const err = validar();
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      if (modo === "CREAR") {
        const payload: InventarioUbicacionCreate = {
          id_sucursal: form.id_sucursal,
          tipo: form.tipo,
          nombre: form.nombre.trim(),
          codigo: form.codigo.trim(),
          vendible: form.tipo === "BODEGA" ? false : form.vendible,
        };

        await inventarioUbicacionesService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialUbicacion) {
        setMsgError("No se encontró la ubicación a editar.");
        return;
      }

      const payload: InventarioUbicacionUpdate = {
        id_sucursal: form.id_sucursal,
        tipo: form.tipo,
        nombre: form.nombre.trim(),
        codigo: form.codigo.trim(),
        vendible: form.tipo === "BODEGA" ? false : form.vendible,
      };

      await inventarioUbicacionesService.actualizar(
        initialUbicacion.id_ubicacion,
        payload,
      );

      onSuccess();
    } catch (e: unknown) {
      setMsgError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 text-slate-900">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Sucursal</label>
          <select
            value={String(form.id_sucursal)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                id_sucursal: Number(e.target.value),
              }))
            }
            disabled={readOnly || loadingSucursales}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          >
            <option value="0">
              {loadingSucursales
                ? "Cargando sucursales..."
                : "Selecciona una sucursal"}
            </option>

            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={String(sucursal.id)}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Tipo</label>
          <select
            value={form.tipo}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                tipo: e.target.value as InventarioUbicacionTipo,
                vendible: e.target.value === "BODEGA" ? false : prev.vendible,
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          >
            <option value="TIENDA">Tienda</option>
            <option value="BODEGA">Bodega</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Nombre</label>
          <input
            value={form.nombre}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nombre: e.target.value }))
            }
            disabled={readOnly}
            placeholder="Ej. Bodega central"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Código</label>
          <input
            value={form.codigo}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, codigo: e.target.value }))
            }
            disabled={readOnly}
            placeholder="Ej. LEON-01-BODEGA-01"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Visible / Vendible</label>
          <select
            value={form.vendible ? "SI" : "NO"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                vendible: e.target.value === "SI",
              }))
            }
            disabled={readOnly || esBodega}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          >
            <option value="SI">Sí</option>
            <option value="NO">No</option>
          </select>

          {esBodega ? (
            <div className="mt-2 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-800">
              Las bodegas no son visibles/vendibles. Este valor se establece
              automáticamente en “No”.
            </div>
          ) : null}
        </div>
      </div>

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

      {modo === "VER" && initialUbicacion ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-slate-900">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">Estatus</div>
            <div className="text-sm font-semibold text-black/80">
              {initialUbicacion.activo ? "ACTIVO" : "INACTIVO"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha de creación
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialUbicacion.creado_en ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Última actualización
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialUbicacion.actualizado_en ?? "-"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
