// src/modules/clientes_fiscales/pages/clientes/ClientesFiscalesList.tsx
// Vista principal del módulo Clientes Fiscales.
// MISMO diseño/patrón que UsuariosList, pero consumiendo API de clientes-fiscales.
// Ajuste: quitar la barra/selector de cliente comercial del listado.
// El cliente comercial se selecciona dentro del MODAL (ClientesFiscalesFields + Autocomplete).
// Ajuste tabla: mostrar primero nombre del cliente, luego RFC, predeterminado y estatus.
// Para lograrlo: resolvemos id_cliente -> nombre usando clientesComercialesService.listar().

import { useCallback, useEffect, useMemo, useState } from "react";

import { clientesFiscalesService } from "../../services/clientes_ficales.service";
import { clientesComercialesService } from "../../services/clientes_comerciales.service";

import type {
  ClienteFiscal,
  ClienteFiscalBuscarItem,
  EstatusGenerico,
} from "../../types/clientes_fiscales.types";

import ClientesFiscalesForm from "./ClientesFiscalesForm";

import { useClientesFiscalesTheme } from "../../theme/useClientesFiscalesTheme";

import ClientesFiscalesHeader from "../../components/clientes_fiscales/ClientesFiscalesHeader";
import ClientesFiscalesFilters, {
  type ClientesFiscalesFiltersState,
} from "../../components/clientes_fiscales/ClientesFiscalesFilters";
import ClientesFiscalesTable from "../../components/clientes_fiscales/ClientesFiscalesTable";
import ClientesFiscalesPagination from "../../components/clientes_fiscales/ClientesFiscalesPagination";
import ClientesFiscalesAlert from "../../components/clientes_fiscales/ClientesFiscalesAlert";
import ClientesFiscalesModalForm from "../../components/clientes_fiscales/ClientesFiscalesModalForm";
import ConfirmActionModal from "../../components/clientes_fiscales/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: ClientesFiscalesFiltersState = {
  q: "",
  estatus: "TODOS",
  soloActivos: true,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de clientes fiscales.";
}

export default function ClientesFiscalesList() {
  const theme = useClientesFiscalesTheme();

  const [items, setItems] = useState<ClienteFiscalBuscarItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<ClientesFiscalesFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Mapa id_cliente -> nombre (label) para mostrar en tabla
  const [clientesMap, setClientesMap] = useState<Record<number, string>>({});

  // detalle seleccionado para editar/ver
  const [selectedFiscal, setSelectedFiscal] = useState<ClienteFiscal | null>(
    null,
  );

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // modal confirmación estatus
  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [fiscalEstatusTarget, setFiscalEstatusTarget] =
    useState<ClienteFiscalBuscarItem | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback(
    (patch: Partial<ClientesFiscalesFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      // Buscar global (requiere q)
      const q = filters.q.trim();
      if (q.length < 1) {
        setItems([]);
        setState("success");
        return;
      }

      const data = await clientesFiscalesService.buscar({
        q,
        solo_activos: filters.soloActivos,
        limit: 50,
        offset: 0,
      });

      setItems(data);

      // Resolver id_cliente -> nombre para mostrar en tabla
      const ids = Array.from(
        new Set((data || []).map((x) => x.id_cliente).filter((id) => id > 0)),
      );

      const faltantes = ids.filter((id) => !clientesMap[id]);

      if (faltantes.length > 0) {
        try {
          const pairs = await Promise.all(
            faltantes.map(async (id) => {
              try {
                const opt = await clientesComercialesService.obtener(id);
                return opt ? ([id, opt.label] as const) : ([id, "—"] as const);
              } catch {
                return [id, "—"] as const;
              }
            }),
          );

          setClientesMap((prev) => {
            const next = { ...prev };
            for (const [id, label] of pairs) {
              if (label && label !== "—") next[id] = label;
            }
            return next;
          });
        } catch {
          // no truena
        }
      }

      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [filters.q, filters.soloActivos]);

  // carga inicial (igual patrón que usuarios)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        // Inicialmente: q está vacío => lista vacía (API exige q)
        if (!mounted) return;
        setItems([]);
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

  // Recalcular lista al cambiar filtros principales
  useEffect(() => {
    void cargar();
  }, [cargar]);

  const getClienteNombre = useCallback(
    (id_cliente: number) => clientesMap[id_cliente] || "—",
    [clientesMap],
  );

  // Filtro local (como usuarios) sobre lo que ya trajo el server
  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (x: ClienteFiscalBuscarItem) => {
      if (!q) return true;
      const full =
        `${getClienteNombre(x.id_cliente)} ${x.rfc} ${x.razon_social} ${x.id_cliente_fiscal} ${x.id_cliente}`.toLowerCase();
      return full.includes(q);
    };

    const filtrarEstatus = (x: ClienteFiscalBuscarItem) => {
      if (filters.estatus === "TODOS") return true;
      return x.estatus === (filters.estatus as EstatusGenerico);
    };

    return items.filter((x) => filtrarTexto(x) && filtrarEstatus(x));
  }, [items, filters, getClienteNombre]);

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
    const predeterminados = itemsFiltrados.filter(
      (x) => x.es_predeterminado,
    ).length;
    return {
      activos,
      inactivos,
      predeterminados,
      total: itemsFiltrados.length,
    };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedFiscal(null);
    setOpenNuevo(true);
  }

  async function onEditar(x: ClienteFiscalBuscarItem) {
    try {
      const detalle = await clientesFiscalesService.obtener(
        x.id_cliente_fiscal,
      );
      setSelectedFiscal(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del cliente fiscal.";
      alert(msg);
    }
  }

  async function onVer(x: ClienteFiscalBuscarItem) {
    try {
      const detalle = await clientesFiscalesService.obtener(
        x.id_cliente_fiscal,
      );
      setSelectedFiscal(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del cliente fiscal.";
      alert(msg);
    }
  }

  function onEliminar(x: ClienteFiscalBuscarItem) {
    setFiscalEstatusTarget(x);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!fiscalEstatusTarget) return;

    try {
      setSavingEstatus(true);

      const nuevoEstatus =
        fiscalEstatusTarget.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";

      await clientesFiscalesService.cambiarEstatus(
        fiscalEstatusTarget.id_cliente_fiscal,
        { estatus: nuevoEstatus },
      );

      setOpenConfirmEstatus(false);
      setFiscalEstatusTarget(null);
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
    fiscalEstatusTarget?.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
  const confirmVariant = estatusNuevo === "INACTIVO" ? "danger" : "success";
  const confirmText = estatusNuevo === "INACTIVO" ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      {/* BLOQUE COMPLETO (TÍTULO + BOTÓN + FILTROS) CON EL MISMO COLOR QUE LA TABLA */}
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <ClientesFiscalesHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={onNuevo}
        />

        {/* Solo una tarjeta blanca (forzamos textos negros aunque el header sea blanco en dark) */}
        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <ClientesFiscalesFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <ClientesFiscalesAlert type="error" message={errorMsg} />
            </div>
          ) : null}

          {filters.q.trim().length < 1 ? (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              Escribe algo en el buscador (RFC / razón social / correo /
              teléfono) para listar clientes fiscales.
            </div>
          ) : null}
        </div>
      </div>

      {/* TABLA SEPARADA */}
      <div className="mt-4">
        <ClientesFiscalesTable
          theme={theme}
          items={itemsPagina}
          getClienteNombre={getClienteNombre}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <ClientesFiscalesPagination
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

      {/* MODAL: NUEVO */}
      <ClientesFiscalesModalForm
        open={openNuevo}
        title="Nuevo cliente fiscal"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <ClientesFiscalesForm
          key="nuevo"
          modo="CREAR"
          initialFiscal={null}
          idClientePreseleccionado={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </ClientesFiscalesModalForm>

      {/* MODAL: EDITAR */}
      <ClientesFiscalesModalForm
        open={openEditar}
        title="Editar cliente fiscal"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <ClientesFiscalesForm
          key={selectedFiscal?.id_cliente_fiscal ?? "editar"}
          modo="EDITAR"
          initialFiscal={selectedFiscal}
          idClientePreseleccionado={selectedFiscal?.id_cliente ?? null}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </ClientesFiscalesModalForm>

      {/* MODAL: VER */}
      <ClientesFiscalesModalForm
        open={openVer}
        title="Visualizar cliente fiscal"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <ClientesFiscalesForm
          key={selectedFiscal?.id_cliente_fiscal ?? "ver"}
          modo="VER"
          initialFiscal={selectedFiscal}
          idClientePreseleccionado={selectedFiscal?.id_cliente ?? null}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </ClientesFiscalesModalForm>

      {/* CONFIRM: CAMBIAR ESTATUS */}
      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de{" "}
            <span className="font-extrabold">
              {fiscalEstatusTarget?.razon_social ??
                fiscalEstatusTarget?.rfc ??
                ""}
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
          setFiscalEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
