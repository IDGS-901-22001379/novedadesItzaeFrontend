// src/modules/inventario_sucursales/pages/inventario_sucursales/Inventario_sucursalesList.tsx
// Vista principal del módulo Inventario - Sucursales.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { inventarioSucursalesService } from "../../services";
import type {
  InventarioSucursal,
  InventarioSucursalListItem,
} from "../../types";
import Inventario_sucursalesForm from "./Inventario_sucursalesForm";

import { useInventarioSucursalesTheme } from "../../theme/useInventarioSucursalesTheme";
import InventarioSucursalesHeader from "../../components/inventario_sucursales/InventarioSucursalesHeader";
import InventarioSucursalesFilters, {
  type InventarioSucursalesFiltersState,
} from "../../components/inventario_sucursales/InventarioSucursalesFilters";
import InventarioSucursalesTable from "../../components/inventario_sucursales/InventarioSucursalesTable";
import InventarioSucursalesPagination from "../../components/inventario_sucursales/InventarioSucursalesPagination";
import InventarioSucursalesAlert from "../../components/inventario_sucursales/InventarioSucursalesAlert";
import InventarioSucursalesModalForm from "../../components/inventario_sucursales/InventarioSucursalesModalForm";
import ConfirmActionModal from "../../components/inventario_sucursales/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

export type InventarioSucursalFiltroEstatus = "TODOS" | "ACTIVO" | "INACTIVO";

const FILTERS_INITIAL: InventarioSucursalesFiltersState = {
  q: "",
  estatus: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de sucursales.";
}

export default function Inventario_sucursalesList() {
  const theme = useInventarioSucursalesTheme();

  const [items, setItems] = useState<InventarioSucursalListItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<InventarioSucursalesFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedSucursal, setSelectedSucursal] =
    useState<InventarioSucursal | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // modal confirmación estatus
  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [sucursalEstatusTarget, setSucursalEstatusTarget] =
    useState<InventarioSucursalListItem | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback(
    (patch: Partial<InventarioSucursalesFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await inventarioSucursalesService.listar({
        solo_activos: false,
      });
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

        const data = await inventarioSucursalesService.listar({
          solo_activos: false,
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
  }, []);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (s: InventarioSucursalListItem) => {
      if (!q) return true;
      const full = `${s.codigo} ${s.nombre} ${s.id_sucursal}`.toLowerCase();
      return full.includes(q);
    };

    const filtrarEstatus = (s: InventarioSucursalListItem) => {
      if (filters.estatus === "TODOS") return true;
      if (filters.estatus === "ACTIVO") return s.activo === true;
      return s.activo === false;
    };

    return items.filter((s) => filtrarTexto(s) && filtrarEstatus(s));
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
    const activas = itemsFiltrados.filter((x) => x.activo).length;
    const inactivas = itemsFiltrados.filter((x) => !x.activo).length;
    return { activas, inactivas, total: itemsFiltrados.length };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedSucursal(null);
    setOpenNuevo(true);
  }

  async function onEditar(sucursal: InventarioSucursalListItem) {
    try {
      const detalle = await inventarioSucursalesService.obtener(
        sucursal.id_sucursal,
      );
      setSelectedSucursal(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la sucursal.";
      alert(msg);
    }
  }

  async function onVer(sucursal: InventarioSucursalListItem) {
    try {
      const detalle = await inventarioSucursalesService.obtener(
        sucursal.id_sucursal,
      );
      setSelectedSucursal(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la sucursal.";
      alert(msg);
    }
  }

  function onEliminar(sucursal: InventarioSucursalListItem) {
    setSucursalEstatusTarget(sucursal);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!sucursalEstatusTarget) return;

    try {
      setSavingEstatus(true);

      const nuevoActivo = !sucursalEstatusTarget.activo;

      await inventarioSucursalesService.cambiarEstatus(
        sucursalEstatusTarget.id_sucursal,
        { activo: nuevoActivo },
      );

      setOpenConfirmEstatus(false);
      setSucursalEstatusTarget(null);
      void cargar();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "No se pudo cambiar el estatus.";
      alert(msg);
    } finally {
      setSavingEstatus(false);
    }
  }

  const estatusNuevo = sucursalEstatusTarget?.activo ? "INACTIVO" : "ACTIVO";
  const confirmVariant = sucursalEstatusTarget?.activo ? "danger" : "success";
  const confirmText = sucursalEstatusTarget?.activo ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      {/* BLOQUE COMPLETO (TÍTULO + BOTÓN + FILTROS) CON EL MISMO COLOR QUE LA TABLA */}
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <InventarioSucursalesHeader
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
          <InventarioSucursalesFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <InventarioSucursalesAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      {/* TABLA SEPARADA */}
      <div className="mt-4">
        <InventarioSucursalesTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <InventarioSucursalesPagination
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
      <InventarioSucursalesModalForm
        open={openNuevo}
        title="Nueva sucursal"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <Inventario_sucursalesForm
          key="nuevo"
          modo="CREAR"
          initialSucursal={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </InventarioSucursalesModalForm>

      {/* MODAL: EDITAR */}
      <InventarioSucursalesModalForm
        open={openEditar}
        title="Editar sucursal"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <Inventario_sucursalesForm
          key={selectedSucursal?.id_sucursal ?? "editar"}
          modo="EDITAR"
          initialSucursal={selectedSucursal}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </InventarioSucursalesModalForm>

      {/* MODAL: VER */}
      <InventarioSucursalesModalForm
        open={openVer}
        title="Visualizar sucursal"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <Inventario_sucursalesForm
          key={selectedSucursal?.id_sucursal ?? "ver"}
          modo="VER"
          initialSucursal={selectedSucursal}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </InventarioSucursalesModalForm>

      {/* CONFIRM: CAMBIAR ESTATUS */}
      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de{" "}
            <span className="font-extrabold">
              {sucursalEstatusTarget?.nombre ?? ""}
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
          setSucursalEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
