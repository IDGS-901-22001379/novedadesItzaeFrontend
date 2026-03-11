// src/modules/inventario_ubicaciones/pages/inventario_ubicaciones/InventarioUbicacionesList.tsx

import { useCallback, useEffect, useMemo, useState } from "react";

import { inventarioUbicacionesService } from "../../services/inventario_ubicaciones.service";
import type { InventarioUbicacion } from "../../types/inventario_ubicaciones.types";

import { useInventarioUbicacionesTheme } from "../../theme/useInventarioUbicacionesTheme";

import InventarioUbicacionesForm from "./InventarioUbicacionesForm";

import InventarioUbicacionesHeader from "../../components/inventario_ubicaciones/InventarioUbicacionesHeader";
import InventarioUbicacionesFilters, {
  type InventarioUbicacionesFiltersState,
  type SucursalOption,
} from "../../components/inventario_ubicaciones/InventarioUbicacionesFilters";
import InventarioUbicacionesTable from "../../components/inventario_ubicaciones/InventarioUbicacionesTable";
import InventarioUbicacionesPagination from "../../components/inventario_ubicaciones/InventarioUbicacionesPagination";
import InventarioUbicacionesAlert from "../../components/inventario_ubicaciones/InventarioUbicacionesAlert";
import InventarioUbicacionesModalForm from "../../components/inventario_ubicaciones/InventarioUbicacionesModalForm";
import ConfirmActionModal from "../../components/inventario_ubicaciones/ConfirmActionModal";

import { inventarioSucursalesService } from "../../../inventario_sucursales/services";

type LoadState = "idle" | "loading" | "success" | "error";
type FiltroEstatus = "TODOS" | "ACTIVO" | "INACTIVO";
type FiltroVendible = "TODOS" | "SI" | "NO";

const FILTERS_INITIAL: InventarioUbicacionesFiltersState = {
  q: "",
  idSucursal: "TODAS",
  estatus: "TODOS",
  tipo: "TODOS",
  vendible: "TODOS",
};

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
  return "No se pudo cargar la lista de ubicaciones.";
}

export default function InventarioUbicacionesList() {
  const theme = useInventarioUbicacionesTheme();

  const [items, setItems] = useState<InventarioUbicacion[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [sucursalesDisponibles, setSucursalesDisponibles] = useState<
    SucursalOption[]
  >([]);

  const [filters, setFilters] =
    useState<InventarioUbicacionesFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedItem, setSelectedItem] = useState<InventarioUbicacion | null>(
    null,
  );

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [ubicacionEstatusTarget, setUbicacionEstatusTarget] =
    useState<InventarioUbicacion | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");
  const [infoModalTitle, setInfoModalTitle] = useState("¡Atención!");
  const [infoModalVariant, setInfoModalVariant] = useState<
    "success" | "warning" | "danger" | "info"
  >("warning");

  const updateFilters = useCallback(
    (patch: Partial<InventarioUbicacionesFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await inventarioUbicacionesService.listar({
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
    void cargar();
  }, [cargar]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await inventarioSucursalesService.listar({
          solo_activos: false,
        });

        if (!mounted) return;

        setSucursalesDisponibles(
          Array.isArray(data)
            ? data.map((s) => ({
                id: s.id_sucursal,
                label: s.nombre,
              }))
            : [],
        );
      } catch {
        if (!mounted) return;
        setSucursalesDisponibles([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const sucursalMap = useMemo(() => {
    return new Map<number, string>(
      sucursalesDisponibles.map((s) => [s.id, s.label]),
    );
  }, [sucursalesDisponibles]);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (item: InventarioUbicacion) => {
      if (!q) return true;

      const nombreSucursal =
        sucursalMap.get(item.id_sucursal)?.toLowerCase() ?? "";

      const full = [item.nombre, item.codigo, item.tipo, nombreSucursal]
        .join(" ")
        .toLowerCase();

      return full.includes(q);
    };

    const filtrarSucursal = (item: InventarioUbicacion) => {
      if (filters.idSucursal === "TODAS") return true;
      return item.id_sucursal === Number(filters.idSucursal);
    };

    const filtrarEstatus = (item: InventarioUbicacion) => {
      const estatus = filters.estatus as FiltroEstatus;
      if (estatus === "TODOS") return true;
      if (estatus === "ACTIVO") return item.activo === true;
      return item.activo === false;
    };

    const filtrarTipo = (item: InventarioUbicacion) => {
      if (filters.tipo === "TODOS") return true;
      return item.tipo === filters.tipo;
    };

    const filtrarVendible = (item: InventarioUbicacion) => {
      const vendible = filters.vendible as FiltroVendible;
      if (vendible === "TODOS") return true;
      if (vendible === "SI") return item.vendible === true;
      return item.vendible === false;
    };

    return items.filter(
      (item) =>
        filtrarTexto(item) &&
        filtrarSucursal(item) &&
        filtrarEstatus(item) &&
        filtrarTipo(item) &&
        filtrarVendible(item),
    );
  }, [items, filters, sucursalMap]);

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
    return {
      activas,
      inactivas,
      total: itemsFiltrados.length,
    };
  }, [itemsFiltrados]);

  function openMessageModal(
    message: string,
    variant: "success" | "warning" | "danger" | "info" = "warning",
    title = "¡Atención!",
  ) {
    setInfoModalMessage(message);
    setInfoModalVariant(variant);
    setInfoModalTitle(title);
    setOpenInfoModal(true);
  }

  function onNuevo() {
    setSelectedItem(null);
    setOpenNuevo(true);
  }

  async function onEditar(item: InventarioUbicacion) {
    try {
      const detalle = await inventarioUbicacionesService.obtener(
        item.id_ubicacion,
      );
      setSelectedItem(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      openMessageModal(
        getErrorMessage(e) || "No se pudo cargar el detalle de la ubicación.",
        "danger",
      );
    }
  }

  async function onVer(item: InventarioUbicacion) {
    try {
      const detalle = await inventarioUbicacionesService.obtener(
        item.id_ubicacion,
      );
      setSelectedItem(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      openMessageModal(
        getErrorMessage(e) || "No se pudo cargar el detalle de la ubicación.",
        "danger",
      );
    }
  }

  function onEliminar(item: InventarioUbicacion) {
    setUbicacionEstatusTarget(item);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!ubicacionEstatusTarget) return;

    try {
      setSavingEstatus(true);

      await inventarioUbicacionesService.cambiarEstatus(
        ubicacionEstatusTarget.id_ubicacion,
        {
          activo: !ubicacionEstatusTarget.activo,
        },
      );

      setOpenConfirmEstatus(false);
      setUbicacionEstatusTarget(null);
      void cargar();
    } catch (e: unknown) {
      setOpenConfirmEstatus(false);

      openMessageModal(
        getErrorMessage(e),
        "warning",
        "No se pudo completar la acción",
      );
    } finally {
      setSavingEstatus(false);
    }
  }

  const estatusNuevo = ubicacionEstatusTarget?.activo ? "INACTIVO" : "ACTIVO";
  const confirmVariant = ubicacionEstatusTarget?.activo ? "danger" : "success";
  const confirmText = ubicacionEstatusTarget?.activo ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <InventarioUbicacionesHeader
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
          <InventarioUbicacionesFilters
            theme={theme}
            filters={filters}
            sucursalesDisponibles={sucursalesDisponibles}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <InventarioUbicacionesAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <InventarioUbicacionesTable
          theme={theme}
          items={itemsPagina}
          sucursalMap={sucursalMap}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <InventarioUbicacionesPagination
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

      <InventarioUbicacionesModalForm
        open={openNuevo}
        title="Nueva ubicación"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <InventarioUbicacionesForm
          key="nuevo"
          modo="CREAR"
          initialUbicacion={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </InventarioUbicacionesModalForm>

      <InventarioUbicacionesModalForm
        open={openEditar}
        title="Editar ubicación"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <InventarioUbicacionesForm
          key={selectedItem?.id_ubicacion ?? "editar"}
          modo="EDITAR"
          initialUbicacion={selectedItem}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </InventarioUbicacionesModalForm>

      <InventarioUbicacionesModalForm
        open={openVer}
        title="Visualizar ubicación"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <InventarioUbicacionesForm
          key={selectedItem?.id_ubicacion ?? "ver"}
          modo="VER"
          initialUbicacion={selectedItem}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </InventarioUbicacionesModalForm>

      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de{" "}
            <span className="font-extrabold">
              {ubicacionEstatusTarget?.nombre ?? ""}
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
          setUbicacionEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />

      <ConfirmActionModal
        open={openInfoModal}
        title={infoModalTitle}
        variant={infoModalVariant}
        message={<span>{infoModalMessage}</span>}
        cancelText="Cerrar"
        confirmText="Aceptar"
        onCancel={() => setOpenInfoModal(false)}
        onConfirm={() => setOpenInfoModal(false)}
      />
    </div>
  );
}
