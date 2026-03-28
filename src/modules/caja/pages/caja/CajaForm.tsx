// src/modules/caja/pages/caja/CajaForm.tsx
// Formulario de cajas.
// Responsabilidades:
// - CREAR: registrar caja con sucursal, nombre y código.
// - EDITAR: editar caja con los datos precargados.
// - VER: mostrar la información en solo lectura.
// Nota: el catálogo de sucursales carga únicamente sucursales activas.

import { useEffect, useMemo, useState } from "react";
import type { Caja, CajaCreate, CajaUpdate } from "../../types/caja.types";
import { cajaService } from "../../services/caja.service";
import { httpClient } from "../../../../services/http/httpClient";

export type CajaFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: CajaFormModo;
  initialCaja: Caja | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  id_sucursal: number;
  nombre: string;
  codigo: string;
};

type SucursalActiva = {
  id_sucursal: number;
  nombre: string;
  activo?: boolean;
};

function buildInitialForm(modo: CajaFormModo, caja: Caja | null): FormState {
  if ((modo === "EDITAR" || modo === "VER") && caja) {
    return {
      id_sucursal: caja.id_sucursal ?? 0,
      nombre: caja.nombre ?? "",
      codigo: caja.codigo ?? "",
    };
  }

  return {
    id_sucursal: 0,
    nombre: "",
    codigo: "",
  };
}

function formatFecha(value?: string): string {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString("es-MX");
}

export default function CajaForm({
  modo,
  initialCaja,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialCaja),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const [sucursales, setSucursales] = useState<SucursalActiva[]>([]);
  const [loadingSucursales, setLoadingSucursales] = useState(false);

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar caja";
    if (modo === "EDITAR") return `Editar caja: ${initialCaja?.nombre ?? ""}`;
    return `Visualizar caja: ${initialCaja?.nombre ?? ""}`;
  }, [modo, initialCaja]);

  useEffect(() => {
    let mounted = true;

    async function cargarSucursalesActivas() {
      try {
        setLoadingSucursales(true);

        const { data } = await httpClient.get<SucursalActiva[]>(
          "/inventario/sucursales?solo_activos=true",
        );

        if (!mounted) return;
        setSucursales(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setSucursales([]);
      } finally {
        if (mounted) {
          setLoadingSucursales(false);
        }
      }
    }

    void cargarSucursalesActivas();

    return () => {
      mounted = false;
    };
  }, []);

  function validar(): string {
    if (!form.id_sucursal || form.id_sucursal <= 0) {
      return "Te falta seleccionar la sucursal.";
    }

    if (!form.nombre.trim()) {
      return "Te falta registrar el nombre de la caja.";
    }

    if (!form.codigo.trim()) {
      return "Te falta registrar el código de la caja.";
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
        const payload: CajaCreate = {
          id_sucursal: form.id_sucursal,
          nombre: form.nombre.trim(),
          codigo: form.codigo.trim(),
        };

        await cajaService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialCaja) {
        setMsgError("No se encontró la caja a editar.");
        return;
      }

      const payload: CajaUpdate = {
        id_sucursal: form.id_sucursal,
        nombre: form.nombre.trim(),
        codigo: form.codigo.trim(),
      };

      await cajaService.actualizar(initialCaja.id_caja, payload);
      onSuccess();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Ocurrió un error al guardar la caja.";
      setMsgError(msg);
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
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold text-slate-900">
            Sucursal
          </label>
          <select
            value={String(form.id_sucursal)}
            onChange={(e) =>
              setForm((p) => ({ ...p, id_sucursal: Number(e.target.value) }))
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
              <option
                key={sucursal.id_sucursal}
                value={String(sucursal.id_sucursal)}
              >
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold text-slate-900">
            Nombre
          </label>
          <input
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold text-slate-900">
            Código
          </label>
          <input
            value={form.codigo}
            onChange={(e) => setForm((p) => ({ ...p, codigo: e.target.value }))}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
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

      {modo === "VER" && initialCaja ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-slate-900">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">ID Caja</div>
            <div className="text-sm font-semibold text-black/80">
              {initialCaja.id_caja}
            </div>

            <div className="text-xs font-extrabold text-black/50">Estado</div>
            <div className="text-sm font-semibold text-black/80">
              {initialCaja.activo ? "ACTIVA" : "INACTIVA"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Creado en
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formatFecha(initialCaja.creado_en)}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Actualizado en
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formatFecha(initialCaja.actualizado_en)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
