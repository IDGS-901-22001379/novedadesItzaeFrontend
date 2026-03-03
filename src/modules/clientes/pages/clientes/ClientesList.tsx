// src/modules/clientes/pages/clientes/ClientesList.tsx
// Vista principal del módulo Clientes Comerciales.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { clientesService } from "../../services/clientes.service";
import { tiposClienteService } from "../../services/tiposCliente.service";

import type {
  Cliente,
  ClienteEstatus,
  ClienteListItem,
  TipoCliente,
} from "../../types/clientes.types";
import ClientesForm from "./ClientesForm";

import { useClientesTheme } from "../../theme/useClientesTheme";
import ClientesHeader from "../../components/clientes/ClientesHeader";
import ClientesFilters, {
  type ClientesFiltersState,
} from "../../components/clientes/ClientesFilters";
import ClientesTable from "../../components/clientes/ClientesTable";
import ClientesPagination from "../../components/clientes/ClientesPagination";
import ClientesAlert from "../../components/clientes/ClientesAlert";
import ClientesModalForm from "../../components/clientes/ClientesModalForm";
import ConfirmActionModal from "../../components/clientes/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: ClientesFiltersState = {
  q: "",
  estatus: "TODOS",
  idTipoCliente: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de clientes.";
}

export default function ClientesList() {
  const theme = useClientesTheme();

  const [items, setItems] = useState<ClienteListItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] = useState<ClientesFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const [tiposCliente, setTiposCliente] = useState<TipoCliente[]>([]);

  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [clienteEstatusTarget, setClienteEstatusTarget] =
    useState<ClienteListItem | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback((patch: Partial<ClientesFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await clientesService.listar();
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

        const [dataClientes, dataTipos] = await Promise.all([
          clientesService.listar(),
          tiposClienteService.listar(true),
        ]);

        if (!mounted) return;

        setItems(dataClientes);
        setTiposCliente(dataTipos);
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

  const tiposDisponibles = useMemo(() => tiposCliente, [tiposCliente]);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (c: ClienteListItem) => {
      if (!q) return true;
      const full =
        `${c.numero_cliente} ${c.nombre} ${c.apellido_paterno} ${c.apellido_materno ?? ""} ${c.id_cliente}`.toLowerCase();
      return full.includes(q);
    };

    const filtrarEstatus = (c: ClienteListItem) => {
      if (filters.estatus === "TODOS") return true;
      return c.estatus === (filters.estatus as ClienteEstatus);
    };

    const filtrarTipo = (c: ClienteListItem) => {
      if (filters.idTipoCliente === "TODOS") return true;
      return c.id_tipo_cliente === Number(filters.idTipoCliente);
    };

    return items.filter(
      (c) => filtrarTexto(c) && filtrarEstatus(c) && filtrarTipo(c),
    );
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
    const activos = itemsFiltrados.filter((x) => x.estatus === "ACTIVO").length;
    const inactivos = itemsFiltrados.filter(
      (x) => x.estatus === "INACTIVO",
    ).length;
    return { activos, inactivos, total: itemsFiltrados.length };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedCliente(null);
    setOpenNuevo(true);
  }

  async function onEditar(c: ClienteListItem) {
    try {
      const detalle = await clientesService.obtener(c.id_cliente);
      setSelectedCliente(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del cliente.";
      alert(msg);
    }
  }

  async function onVer(c: ClienteListItem) {
    try {
      const detalle = await clientesService.obtener(c.id_cliente);
      setSelectedCliente(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del cliente.";
      alert(msg);
    }
  }

  function onEliminar(c: ClienteListItem) {
    setClienteEstatusTarget(c);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!clienteEstatusTarget) return;

    try {
      setSavingEstatus(true);

      const nuevoEstatus =
        clienteEstatusTarget.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      await clientesService.cambiarEstatus(clienteEstatusTarget.id_cliente, {
        estatus: nuevoEstatus,
      });

      setOpenConfirmEstatus(false);
      setClienteEstatusTarget(null);
      void cargar();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "No se pudo cambiar el estatus.";
      alert(msg);
    } finally {
      setSavingEstatus(false);
    }
  }

  const estatusNuevo =
    clienteEstatusTarget?.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
  const confirmVariant = estatusNuevo === "INACTIVO" ? "danger" : "success";
  const confirmText = estatusNuevo === "INACTIVO" ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <ClientesHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={onNuevo}
        />

        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <ClientesFilters
            theme={theme}
            filters={filters}
            tiposDisponibles={tiposDisponibles}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <ClientesAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <ClientesTable
          theme={theme}
          items={itemsPagina}
          tiposDisponibles={tiposDisponibles}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <ClientesPagination
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

      <ClientesModalForm
        open={openNuevo}
        title="Nuevo cliente"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <ClientesForm
          key="nuevo"
          modo="CREAR"
          initialCliente={null}
          tiposDisponibles={tiposDisponibles}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </ClientesModalForm>

      <ClientesModalForm
        open={openEditar}
        title="Editar cliente"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <ClientesForm
          key={selectedCliente?.id_cliente ?? "editar"}
          modo="EDITAR"
          initialCliente={selectedCliente}
          tiposDisponibles={tiposDisponibles}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </ClientesModalForm>

      <ClientesModalForm
        open={openVer}
        title="Visualizar cliente"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <ClientesForm
          key={selectedCliente?.id_cliente ?? "ver"}
          modo="VER"
          initialCliente={selectedCliente}
          tiposDisponibles={tiposDisponibles}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </ClientesModalForm>

      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus del cliente{" "}
            <span className="font-extrabold">
              {`${clienteEstatusTarget?.nombre ?? ""} ${clienteEstatusTarget?.apellido_paterno ?? ""}`}
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
          setClienteEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
