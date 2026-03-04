// src/modules/clientes_fiscales/pages/clientes/ClientesFiscalesForm.tsx
// Orquestador del formulario Clientes Fiscales (corto).
// UI de inputs está en components/.../form
// Validación está en constants/...

import { useEffect, useMemo, useState } from "react";

import type {
  ClienteFiscal,
  ClienteFiscalCreate,
  ClienteFiscalUpdate,
} from "../../types/clientes_fiscales.types";

import { clientesFiscalesService } from "../../services/clientes_ficales.service";
import { regimenesFiscalesService } from "../../services/regimenes_fiscales.service";
import { usosCfdiService } from "../../services/usos_cfdi.service";

import { validarClienteFiscal } from "../../constants/clientes_fiscales.validation";

import ClientesFiscalesFields from "../../components/clientes_fiscales/ClientesFiscalesFields";
import ClientesFiscalesReadOnly from "../../components/clientes_fiscales/ClientesFiscalesReadOnly";

export type ClientesFiscalesFormModo = "CREAR" | "EDITAR" | "VER";

export type ClientesFiscalesFormState = {
  id_cliente: number;
  cliente_nombre: string;

  rfc: string;
  razon_social: string;

  id_regimen_fiscal: number;
  codigo_postal_fiscal: string;

  correo_envio: string;
  id_uso_cfdi: number;

  telefono: string;

  es_predeterminado: boolean;
};

type Props = {
  modo: ClientesFiscalesFormModo;
  initialFiscal: ClienteFiscal | null;

  // si ya seleccionaste un cliente comercial en la lista (ya no se usa, pero lo dejamos por compatibilidad)
  idClientePreseleccionado: number | null;

  onSuccess: () => void;
  onCancel: () => void;
};

function buildInitialForm(
  modo: ClientesFiscalesFormModo,
  item: ClienteFiscal | null,
  idClientePreseleccionado: number | null,
): ClientesFiscalesFormState {
  if ((modo === "EDITAR" || modo === "VER") && item) {
    return {
      id_cliente: item.id_cliente ?? 0,
      // NO mostramos "Cliente #id"; nombre real se selecciona/carga en el autocomplete del modal
      cliente_nombre: "",

      rfc: item.rfc ?? "",
      razon_social: item.razon_social ?? "",

      id_regimen_fiscal: item.id_regimen_fiscal ?? 0,
      codigo_postal_fiscal: item.codigo_postal_fiscal ?? "",

      correo_envio: item.correo_envio ?? "",
      id_uso_cfdi: item.id_uso_cfdi ?? 0,

      telefono: item.telefono ?? "",

      es_predeterminado: !!item.es_predeterminado,
    };
  }

  return {
    id_cliente: idClientePreseleccionado ?? 0,
    cliente_nombre: "",

    rfc: "",
    razon_social: "",

    id_regimen_fiscal: 0,
    codigo_postal_fiscal: "",

    correo_envio: "",
    id_uso_cfdi: 0,

    telefono: "",

    es_predeterminado: false,
  };
}

export default function ClientesFiscalesForm({
  modo,
  initialFiscal,
  idClientePreseleccionado,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<ClientesFiscalesFormState>(() =>
    buildInitialForm(modo, initialFiscal, idClientePreseleccionado),
  );

  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  // Catálogos reales
  const [regimenes, setRegimenes] = useState<{ id: number; label: string }[]>(
    [],
  );
  const [usosCfdi, setUsosCfdi] = useState<{ id: number; label: string }[]>([]);

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar cliente fiscal";
    if (modo === "EDITAR")
      return `Editar cliente fiscal: ${initialFiscal?.rfc ?? ""}`;
    return `Visualizar cliente fiscal: ${initialFiscal?.rfc ?? ""}`;
  }, [modo, initialFiscal]);

  // Cargar catálogos desde BD (solo activos)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [regs, usos] = await Promise.all([
          regimenesFiscalesService.listar({ solo_activos: true }),
          usosCfdiService.listar({ solo_activos: true }),
        ]);

        if (!mounted) return;

        setRegimenes(
          (Array.isArray(regs) ? regs : []).map((r) => ({
            id: r.id_regimen_fiscal,
            label: `${r.codigo} - ${r.descripcion}`,
          })),
        );

        setUsosCfdi(
          (Array.isArray(usos) ? usos : []).map((u) => ({
            id: u.id_uso_cfdi,
            label: `${u.codigo} - ${u.descripcion}`,
          })),
        );
      } catch {
        // si falla, no tronamos el modal; los selects quedarán vacíos
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function guardar() {
    const err = validarClienteFiscal(modo, form);
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      if (modo === "CREAR") {
        const payload: ClienteFiscalCreate = {
          rfc: form.rfc.trim(),
          razon_social: form.razon_social.trim(),
          id_regimen_fiscal: form.id_regimen_fiscal,
          codigo_postal_fiscal: form.codigo_postal_fiscal.trim(),
          correo_envio: form.correo_envio.trim(),
          id_uso_cfdi: form.id_uso_cfdi,
          telefono: form.telefono.trim(),
          id_cliente: form.id_cliente,
          es_predeterminado: form.es_predeterminado,
        };

        await clientesFiscalesService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialFiscal) {
        setMsgError("No se encontró el cliente fiscal a editar.");
        return;
      }

      const payload: ClienteFiscalUpdate = {
        rfc: form.rfc.trim(),
        razon_social: form.razon_social.trim(),
        id_regimen_fiscal: form.id_regimen_fiscal,
        codigo_postal_fiscal: form.codigo_postal_fiscal.trim(),
        correo_envio: form.correo_envio.trim(),
        id_uso_cfdi: form.id_uso_cfdi,
        telefono: form.telefono.trim(),
        es_predeterminado: form.es_predeterminado,
      };

      await clientesFiscalesService.actualizar(
        initialFiscal.id_cliente_fiscal,
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

      <ClientesFiscalesFields
        form={form}
        readOnly={readOnly}
        regimenes={regimenes}
        usosCfdi={usosCfdi}
        onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
      />

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
            className={[
              "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition disabled:opacity-50",
              "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
            ].join(" ")}
          >
            {saving
              ? "Guardando..."
              : modo === "CREAR"
                ? "Crear"
                : "Actualizar"}
          </button>
        </div>
      ) : null}

      {/* Visualización extra (info completa) */}
      {modo === "VER" && initialFiscal ? (
        <ClientesFiscalesReadOnly item={initialFiscal} />
      ) : null}
    </div>
  );
}
