// src/modules/clientes_tipos/pages/clientes_tipos/Clientes_tiposList.tsx
// Vista principal del módulo Clientes Tipos.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { clientesTiposService } from "../../services/clientes_tipos.service";
import type { ClienteTipo } from "../../types/clientes.types";
import Clientes_tiposForm from "./Clientes_tiposForm";

import { useClientesTiposTheme } from "../../theme/useClientesTiposTheme";
import ClientesTiposHeader from "../../components/clientes_tipos/ClientesTiposHeader";
import ClientesTiposFilters, {
  type ClientesTiposFiltersState,
} from "../../components/clientes_tipos/ClientesTiposFilters";
import ClientesTiposTable from "../../components/clientes_tipos/ClientesTiposTable";
import ClientesTiposPagination from "../../components/clientes_tipos/ClientesTiposPagination";
import ClientesTiposAlert from "../../components/clientes_tipos/ClientesTiposAlert";
import ClientesTiposModalForm from "../../components/clientes_tipos/ClientesTiposModalForm";
import ConfirmActionModal from "../../components/clientes_tipos/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";
type TipoActivoFiltro = "TODOS" | "ACTIVOS" | "INACTIVOS";

const FILTERS_INITIAL: ClientesTiposFiltersState = {
  q: "",
  activo: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de tipos de cliente.";
}

export default function Clientes_tiposList() {
  const theme = useClientesTiposTheme();

  const [items, setItems] = useState<ClienteTipo[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<ClientesTiposFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedItem, setSelectedItem] = useState<ClienteTipo | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [estatusTarget, setEstatusTarget] = useState<ClienteTipo | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback(
    (patch: Partial<ClientesTiposFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await clientesTiposService.listar({ solo_activos: false });
      setItems(data);

      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const data = await clientesTiposService.listar({ solo_activos: false });
        if (!mounted) return;

        setItems(data);
        setState("success");
      } catch (error: unknown) {
        if (!mounted) return;
        setState("error");
        setErrorMsg(getErrorMessage(error));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (item: ClienteTipo) => {
      if (!q) return true;

      const full =
        `${item.id_tipo_cliente} ${item.nombre} ${item.descripcion ?? ""}`.toLowerCase();

      return full.includes(q);
    };

    const filtrarActivo = (item: ClienteTipo) => {
      const estado = filters.activo as TipoActivoFiltro;

      if (estado === "TODOS") return true;
      if (estado === "ACTIVOS") return item.activo === true;
      if (estado === "INACTIVOS") return item.activo === false;

      return true;
    };

    return items.filter((item) => filtrarTexto(item) && filtrarActivo(item));
  }, [items, filters]);

  const total = itemsFiltrados.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const itemsPagina = useMemo(() => {
    const start = page * pageSize;
    return itemsFiltrados.slice(start, start + pageSize);
  }, [itemsFiltrados, page]);

  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  const resumen = useMemo(() => {
    const activos = itemsFiltrados.filter((x) => x.activo).length;
    const inactivos = itemsFiltrados.filter((x) => !x.activo).length;

    return {
      activos,
      inactivos,
      total: itemsFiltrados.length,
    };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedItem(null);
    setOpenNuevo(true);
  }

  async function onEditar(item: ClienteTipo) {
    try {
      const detalle = await clientesTiposService.obtener(item.id_tipo_cliente);
      setSelectedItem(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del tipo de cliente.";
      alert(msg);
    }
  }

  async function onVer(item: ClienteTipo) {
    try {
      const detalle = await clientesTiposService.obtener(item.id_tipo_cliente);
      setSelectedItem(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del tipo de cliente.";
      alert(msg);
    }
  }

  function onEliminar(item: ClienteTipo) {
    setEstatusTarget(item);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!estatusTarget) return;

    try {
      setSavingEstatus(true);

      if (estatusTarget.activo) {
        await clientesTiposService.desactivar(estatusTarget.id_tipo_cliente);
      } else {
        const detalle = await clientesTiposService.obtener(
          estatusTarget.id_tipo_cliente,
        );

        await clientesTiposService.actualizar(detalle.id_tipo_cliente, {
          nombre: detalle.nombre,
          descripcion: detalle.descripcion ?? "",
          activo: true,
        });
      }

      setOpenConfirmEstatus(false);
      setEstatusTarget(null);
      void cargar();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "No se pudo cambiar el estatus.";
      alert(msg);
    } finally {
      setSavingEstatus(false);
    }
  }

  const estatusNuevo = estatusTarget?.activo ? "INACTIVO" : "ACTIVO";
  const confirmVariant = estatusNuevo === "INACTIVO" ? "danger" : "success";
  const confirmText = estatusNuevo === "INACTIVO" ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      <div
        className={`mx-auto max-w-5xl rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <ClientesTiposHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={onNuevo}
        />

        <div
          className={[
            "mx-auto mt-4 max-w-4xl rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <ClientesTiposFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <ClientesTiposAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <ClientesTiposTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <ClientesTiposPagination
          theme={theme}
          page={page}
          totalPages={totalPages}
          from={from}
          to={to}
          total={total}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      </div>

      <ClientesTiposModalForm
        open={openNuevo}
        title="Nuevo tipo de cliente"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <Clientes_tiposForm
          key="nuevo"
          modo="CREAR"
          initialTipoCliente={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </ClientesTiposModalForm>

      <ClientesTiposModalForm
        open={openEditar}
        title="Editar tipo de cliente"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <Clientes_tiposForm
          key={selectedItem?.id_tipo_cliente ?? "editar"}
          modo="EDITAR"
          initialTipoCliente={selectedItem}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </ClientesTiposModalForm>

      <ClientesTiposModalForm
        open={openVer}
        title="Visualizar tipo de cliente"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <Clientes_tiposForm
          key={selectedItem?.id_tipo_cliente ?? "ver"}
          modo="VER"
          initialTipoCliente={selectedItem}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </ClientesTiposModalForm>

      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus del tipo de cliente{" "}
            <span className="font-extrabold">
              {estatusTarget?.nombre ?? ""}
            </span>{" "}
            a <span className="font-extrabold">{estatusNuevo}</span>?
          </span>
        }
        cancelText="Cancelar"
        confirmText={confirmText}
        loading={savingEstatus}
        onCancel={() => {
          if (savingEstatus) return;
          setOpenConfirmEstatus(false);
          setEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
