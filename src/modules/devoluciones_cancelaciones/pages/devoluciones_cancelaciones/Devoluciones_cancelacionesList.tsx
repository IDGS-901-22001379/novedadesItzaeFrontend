// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/Devoluciones_cancelacionesList.tsx
// Vista principal del módulo Devoluciones/Cancelaciones.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { devolucionesCancelacionesService } from "../../services/devoluciones_cancelaciones.service";
import type {
  Devolucion,
  DevolucionDetail,
  DevolucionEstatus,
  DevolucionTipo,
} from "../../types/devoluciones_cancelaciones.types";
import Devoluciones_cancelacionesForm from "./Devoluciones_cancelacionesForm";

import { useDevolucionesCancelacionesTheme } from "../../theme/useDevolucionesCancelacionesTheme";
import DevolucionesHeader from "../../components/devoluciones_cancelaciones/DevolucionesHeader";
import DevolucionesFilters, {
  type DevolucionesFiltersState,
} from "../../components/devoluciones_cancelaciones/DevolucionesFilters";
import DevolucionesTable from "../../components/devoluciones_cancelaciones/DevolucionesTable";
import DevolucionesPagination from "../../components/devoluciones_cancelaciones/DevolucionesPagination";
import DevolucionesAlert from "../../components/devoluciones_cancelaciones/DevolucionesAlert";
import DevolucionesModalForm from "../../components/devoluciones_cancelaciones/DevolucionesModalForm";
import ConfirmActionModal from "../../components/devoluciones_cancelaciones/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: DevolucionesFiltersState = {
  q: "",
  tipo: "TODOS",
  desde: "",
  hasta: "",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de devoluciones.";
}

export default function Devoluciones_cancelacionesList() {
  const theme = useDevolucionesCancelacionesTheme();

  const [items, setItems] = useState<Devolucion[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<DevolucionesFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedItem, setSelectedItem] = useState<DevolucionDetail | null>(
    null,
  );

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [estatusTarget, setEstatusTarget] = useState<DevolucionDetail | null>(
    null,
  );
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback(
    (patch: Partial<DevolucionesFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const offset = page * pageSize;

      const data = await devolucionesCancelacionesService.listar({
        // q ya permite buscar por folio de venta, nombre de cliente o motivo
        q: filters.q.trim() || undefined,
        tipo:
          filters.tipo === "TODOS"
            ? undefined
            : (filters.tipo as DevolucionTipo),
        desde: filters.desde || undefined,
        hasta: filters.hasta || undefined,
        limit: pageSize,
        offset,
      });

      setItems(data);
      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [filters, page]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const offset = page * pageSize;

        const data = await devolucionesCancelacionesService.listar({
          // q ya permite buscar por folio de venta, nombre de cliente o motivo
          q: filters.q.trim() || undefined,
          tipo:
            filters.tipo === "TODOS"
              ? undefined
              : (filters.tipo as DevolucionTipo),
          desde: filters.desde || undefined,
          hasta: filters.hasta || undefined,
          limit: pageSize,
          offset,
        });

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
  }, [filters, page]);

  const total = useMemo(() => {
    return page * pageSize + items.length;
  }, [items, page]);

  const totalPages = useMemo(() => {
    if (items.length < pageSize) return Math.max(1, page + 1);
    return page + 2;
  }, [items.length, page]);

  const from = items.length === 0 ? 0 : page * pageSize + 1;
  const to = page * pageSize + items.length;

  const resumen = useMemo(() => {
    const totalActual = items.length;
    const totalDevoluciones = items.filter((x) => x.tipo === "TOTAL").length;
    const parciales = items.filter((x) => x.tipo === "PARCIAL").length;
    const cancelaciones = items.filter((x) => x.tipo === "CANCELACION").length;

    return {
      total: totalActual,
      totalDevoluciones,
      parciales,
      cancelaciones,
    };
  }, [items]);

  function onNuevo() {
    setSelectedItem(null);
    setOpenNuevo(true);
  }

  async function onEditar(item: Devolucion) {
    try {
      const detalle = await devolucionesCancelacionesService.obtener(
        item.id_devolucion,
      );
      setSelectedItem(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la devolución.";
      alert(msg);
    }
  }

  async function onVer(item: Devolucion) {
    try {
      const detalle = await devolucionesCancelacionesService.obtener(
        item.id_devolucion,
      );
      setSelectedItem(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la devolución.";
      alert(msg);
    }
  }

  async function onCambiarEstatus(item: Devolucion) {
    try {
      const detalle = await devolucionesCancelacionesService.obtener(
        item.id_devolucion,
      );
      setEstatusTarget(detalle);
      setOpenConfirmEstatus(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar la devolución para cambiar estatus.";
      alert(msg);
    }
  }

  async function confirmarCambioEstatus() {
    if (!estatusTarget) return;

    try {
      setSavingEstatus(true);

      const estatusActual = (
        estatusTarget as DevolucionDetail & { estatus?: DevolucionEstatus }
      ).estatus;

      const nuevoEstatus: DevolucionEstatus =
        estatusActual === "ANULADA" ? "APLICADA" : "ANULADA";

      await devolucionesCancelacionesService.cambiarEstatus(
        estatusTarget.id_devolucion,
        { estatus: nuevoEstatus },
      );

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

  const estatusActual =
    (
      estatusTarget as
        | (DevolucionDetail & { estatus?: DevolucionEstatus })
        | null
    )?.estatus ?? "APLICADA";

  const estatusNuevo: DevolucionEstatus =
    estatusActual === "ANULADA" ? "APLICADA" : "ANULADA";

  const confirmVariant = estatusNuevo === "ANULADA" ? "danger" : "success";
  const confirmText = estatusNuevo === "ANULADA" ? "Anular" : "Aplicar";

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <DevolucionesHeader
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
          <DevolucionesFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <DevolucionesAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <DevolucionesTable
          theme={theme}
          items={items}
          loading={state === "loading"}
          onVer={onVer}
          onEditar={onEditar}
          onCambiarEstatus={onCambiarEstatus}
        />

        <DevolucionesPagination
          theme={theme}
          page={page}
          totalPages={totalPages}
          from={from}
          to={to}
          total={total}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => {
            if (items.length < pageSize) return;
            setPage((p) => p + 1);
          }}
        />
      </div>

      <DevolucionesModalForm
        open={openNuevo}
        title="Nueva devolución"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <Devoluciones_cancelacionesForm
          key="nuevo"
          modo="CREAR"
          initialDevolucion={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </DevolucionesModalForm>

      <DevolucionesModalForm
        open={openEditar}
        title="Editar devolución"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <Devoluciones_cancelacionesForm
          key={selectedItem?.id_devolucion ?? "editar"}
          modo="EDITAR"
          initialDevolucion={selectedItem}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </DevolucionesModalForm>

      <DevolucionesModalForm
        open={openVer}
        title="Visualizar devolución"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <Devoluciones_cancelacionesForm
          key={selectedItem?.id_devolucion ?? "ver"}
          modo="VER"
          initialDevolucion={selectedItem}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </DevolucionesModalForm>

      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de la devolución{" "}
            <span className="font-extrabold">
              #{estatusTarget?.id_devolucion ?? ""}
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
