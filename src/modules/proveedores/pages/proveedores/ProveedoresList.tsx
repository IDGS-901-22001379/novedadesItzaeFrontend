// src/modules/proveedores/pages/proveedores/ProveedoresList.tsx
// Vista principal del módulo Proveedores.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { proveedoresService } from "../../services/proveedores.service";
import type {
  Proveedor,
  ProveedorEstatus,
  ProveedorListItem,
} from "../../types/proveedores.types";
import ProveedoresForm from "./ProveedoresForm";

import { useProveedoresTheme } from "../../theme/useProveedoresTheme";
import ProveedoresHeader from "../../components/proveedores/ProveedoresHeader";
import ProveedoresFilters, {
  type ProveedoresFiltersState,
} from "../../components/proveedores/ProveedoresFilters";
import ProveedoresTable from "../../components/proveedores/ProveedoresTable";
import ProveedoresPagination from "../../components/proveedores/ProveedoresPagination";
import ProveedoresAlert from "../../components/proveedores/ProveedoresAlert";
import ProveedoresModalForm from "../../components/proveedores/ProveedoresModalForm";
import ConfirmActionModal from "../../components/proveedores/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: ProveedoresFiltersState = {
  q: "",
  estatus: "TODOS",
  tipo: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de proveedores.";
}

export default function ProveedoresList() {
  const theme = useProveedoresTheme();

  const [items, setItems] = useState<ProveedorListItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<ProveedoresFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(
    null,
  );

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // modal confirmación estatus
  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [proveedorEstatusTarget, setProveedorEstatusTarget] =
    useState<ProveedorListItem | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback(
    (patch: Partial<ProveedoresFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await proveedoresService.listar({ solo_activos: false });
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

        const data = await proveedoresService.listar({ solo_activos: false });
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

    const filtrarTexto = (p: ProveedorListItem) => {
      if (!q) return true;

      const full =
        `${p.id_proveedor} ${p.razon_social} ${p.telefono ?? ""} ${p.correo ?? ""}`.toLowerCase();

      return full.includes(q);
    };

    const filtrarEstatus = (p: ProveedorListItem) => {
      if (filters.estatus === "TODOS") return true;
      return p.estatus === (filters.estatus as ProveedorEstatus);
    };

    const filtrarTipo = (p: ProveedorListItem) => {
      if (filters.tipo === "TODOS") return true;
      return p.tipo === filters.tipo;
    };

    return items.filter(
      (p) => filtrarTexto(p) && filtrarEstatus(p) && filtrarTipo(p),
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
    setSelectedProveedor(null);
    setOpenNuevo(true);
  }

  async function onEditar(p: ProveedorListItem) {
    try {
      const detalle = await proveedoresService.obtener(p.id_proveedor);
      setSelectedProveedor(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del proveedor.";
      alert(msg);
    }
  }

  async function onVer(p: ProveedorListItem) {
    try {
      const detalle = await proveedoresService.obtener(p.id_proveedor);
      setSelectedProveedor(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del proveedor.";
      alert(msg);
    }
  }

  function onEliminar(p: ProveedorListItem) {
    setProveedorEstatusTarget(p);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!proveedorEstatusTarget) return;

    try {
      setSavingEstatus(true);

      const nuevoEstatus =
        proveedorEstatusTarget.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";

      await proveedoresService.cambiarEstatus(
        proveedorEstatusTarget.id_proveedor,
        {
          estatus: nuevoEstatus,
        },
      );

      setOpenConfirmEstatus(false);
      setProveedorEstatusTarget(null);
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
    proveedorEstatusTarget?.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";

  const confirmVariant = estatusNuevo === "INACTIVO" ? "danger" : "success";
  const confirmText = estatusNuevo === "INACTIVO" ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      {/* BLOQUE COMPLETO (TÍTULO + BOTÓN + FILTROS) CON EL MISMO COLOR QUE LA TABLA */}
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <ProveedoresHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={onNuevo}
        />

        {/* Solo una tarjeta blanca */}
        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <ProveedoresFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <ProveedoresAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      {/* TABLA SEPARADA */}
      <div className="mt-4">
        <ProveedoresTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <ProveedoresPagination
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
      <ProveedoresModalForm
        open={openNuevo}
        title="Nuevo proveedor"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <ProveedoresForm
          key="nuevo"
          modo="CREAR"
          initialProveedor={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </ProveedoresModalForm>

      {/* MODAL: EDITAR */}
      <ProveedoresModalForm
        open={openEditar}
        title="Editar proveedor"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <ProveedoresForm
          key={selectedProveedor?.id_proveedor ?? "editar"}
          modo="EDITAR"
          initialProveedor={selectedProveedor}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </ProveedoresModalForm>

      {/* MODAL: VER */}
      <ProveedoresModalForm
        open={openVer}
        title="Visualizar proveedor"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <ProveedoresForm
          key={selectedProveedor?.id_proveedor ?? "ver"}
          modo="VER"
          initialProveedor={selectedProveedor}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </ProveedoresModalForm>

      {/* CONFIRM: CAMBIAR ESTATUS */}
      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de{" "}
            <span className="font-extrabold">
              {proveedorEstatusTarget?.razon_social ?? ""}
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
          setProveedorEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
