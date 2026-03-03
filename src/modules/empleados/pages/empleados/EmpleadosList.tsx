// src/modules/empleados/pages/empleados/EmpleadosList.tsx
// Vista principal del módulo Empleados.
// Responsabilidades: cargar listado desde API (paginado), mantener estado (loading/error),
// aplicar filtros + paginación (server-side) y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { empleadosService } from "../../services/empleados.service";
import type { Empleado, EmpleadoEstatus } from "../../types/empleados.types";

import EmpleadosForm from "./EmpleadosForm";

import { useEmpleadosTheme } from "../../theme/useEmpleadosTheme";
import EmpleadosHeader from "../../components/empleados/EmpleadosHeader";
import EmpleadosFilters, {
  type EmpleadosFiltersState,
} from "../../components/empleados/EmpleadosFilters";
import EmpleadosTable from "../../components/empleados/EmpleadosTable";
import EmpleadosPagination from "../../components/empleados/EmpleadosPagination";
import EmpleadosAlert from "../../components/empleados/EmpleadosAlert";
import EmpleadosModalForm from "../../components/empleados/EmpleadosModalForm";
import ConfirmActionModal from "../../components/empleados/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: EmpleadosFiltersState = {
  q: "",
  puesto: "",
  estatus: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de empleados.";
}

export default function EmpleadosList() {
  const theme = useEmpleadosTheme();

  const [items, setItems] = useState<Empleado[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<EmpleadosFiltersState>(FILTERS_INITIAL);

  // Paginación server-side (API es 1-based)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [total, setTotal] = useState(0);

  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null,
  );

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // Confirm estatus
  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [empleadoEstatusTarget, setEmpleadoEstatusTarget] =
    useState<Empleado | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback((patch: Partial<EmpleadosFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1); // al cambiar filtros, regresamos a la primera página
  }, []);

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const resp = await empleadosService.listar({
        q: filters.q?.trim() || undefined,
        puesto: filters.puesto?.trim() || undefined,
        estatus:
          filters.estatus === "TODOS"
            ? undefined
            : (filters.estatus as EmpleadoEstatus),
        page,
        page_size: pageSize,
      });

      setItems(resp.items);
      setTotal(resp.total);

      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const resp = await empleadosService.listar({
          q: filters.q?.trim() || undefined,
          puesto: filters.puesto?.trim() || undefined,
          estatus:
            filters.estatus === "TODOS"
              ? undefined
              : (filters.estatus as EmpleadoEstatus),
          page,
          page_size: pageSize,
        });

        if (!mounted) return;

        setItems(resp.items);
        setTotal(resp.total);
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
  }, [filters, page, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );

  const from = useMemo(() => {
    if (total === 0) return 0;
    return (page - 1) * pageSize + 1;
  }, [page, pageSize, total]);

  const to = useMemo(
    () => Math.min(page * pageSize, total),
    [page, pageSize, total],
  );

  // Resumen (con lo que tenemos a la mano)
  const resumen = useMemo(() => {
    const activos = items.filter((x) => x.estatus === "ACTIVO").length;
    const inactivos = items.filter((x) => x.estatus === "INACTIVO").length;
    return { activos, inactivos, total };
  }, [items, total]);

  function onNuevo() {
    setSelectedEmpleado(null);
    setOpenNuevo(true);
  }

  async function onEditar(e: Empleado) {
    try {
      const detalle = await empleadosService.obtener(e.id_empleado);
      setSelectedEmpleado(detalle);
      setOpenEditar(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo cargar el detalle del empleado.";
      alert(msg);
    }
  }

  async function onVer(e: Empleado) {
    try {
      const detalle = await empleadosService.obtener(e.id_empleado);
      setSelectedEmpleado(detalle);
      setOpenVer(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo cargar el detalle del empleado.";
      alert(msg);
    }
  }

  function onEliminar(e: Empleado) {
    setEmpleadoEstatusTarget(e);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!empleadoEstatusTarget) return;

    try {
      setSavingEstatus(true);

      const nuevoEstatus: EmpleadoEstatus =
        empleadoEstatusTarget.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";

      await empleadosService.cambiarEstatus(empleadoEstatusTarget.id_empleado, {
        estatus: nuevoEstatus,
      });

      setOpenConfirmEstatus(false);
      setEmpleadoEstatusTarget(null);

      // Si el cambio te deja una página vacía (ej. era el último item), intenta retroceder
      // (opcional, pero ayuda)
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
      else void cargar();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "No se pudo cambiar el estatus.";
      alert(msg);
    } finally {
      setSavingEstatus(false);
    }
  }

  const estatusNuevo: EmpleadoEstatus =
    empleadoEstatusTarget?.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
  const confirmVariant = estatusNuevo === "INACTIVO" ? "danger" : "success";
  const confirmText = estatusNuevo === "INACTIVO" ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      {/* BLOQUE COMPLETO (TÍTULO + BOTÓN + FILTROS) CON EL MISMO COLOR QUE LA TABLA */}
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <EmpleadosHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={onNuevo}
          onReload={() => void cargar()}
        />

        {/* Tarjeta blanca (forzamos textos negros aunque el header sea blanco en dark) */}
        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <EmpleadosFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <EmpleadosAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      {/* TABLA SEPARADA */}
      <div className="mt-4">
        <EmpleadosTable
          theme={theme}
          items={items}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <EmpleadosPagination
          theme={theme}
          page={page}
          totalPages={totalPages}
          from={from}
          to={to}
          total={total}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>

      {/* MODAL: NUEVO */}
      <EmpleadosModalForm
        open={openNuevo}
        title="Nuevo empleado"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <EmpleadosForm
          key="nuevo"
          modo="CREAR"
          initialEmpleado={null}
          onSuccess={() => {
            setOpenNuevo(false);
            setPage(1);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </EmpleadosModalForm>

      {/* MODAL: EDITAR */}
      <EmpleadosModalForm
        open={openEditar}
        title="Editar empleado"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <EmpleadosForm
          key={selectedEmpleado?.id_empleado ?? "editar"}
          modo="EDITAR"
          initialEmpleado={selectedEmpleado}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </EmpleadosModalForm>

      {/* MODAL: VER */}
      <EmpleadosModalForm
        open={openVer}
        title="Visualizar empleado"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <EmpleadosForm
          key={selectedEmpleado?.id_empleado ?? "ver"}
          modo="VER"
          initialEmpleado={selectedEmpleado}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </EmpleadosModalForm>

      {/* CONFIRM: CAMBIAR ESTATUS */}
      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de{" "}
            <span className="font-extrabold">
              {empleadoEstatusTarget
                ? `${empleadoEstatusTarget.nombre} ${empleadoEstatusTarget.apellido_paterno}`
                : ""}
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
          setEmpleadoEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
