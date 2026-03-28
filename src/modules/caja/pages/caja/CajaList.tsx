// src/modules/caja/pages/caja/CajaList.tsx
// Vista principal del módulo Caja.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// cargar catálogo de sucursales activas para mostrar nombres reales,
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { httpClient } from "../../../../services/http/httpClient";
import { cajaService } from "../../services/caja.service";
import type { Caja } from "../../types/caja.types";
import CajaForm from "./CajaForm";

import { useCajaTheme } from "../../theme/useCajaTheme";
import CajaHeader from "../../components/caja/CajaHeader";
import CajaFilters, {
  type CajaFiltersState,
} from "../../components/caja/CajaFilters";
import CajaTable from "../../components/caja/CajaTable";
import CajaPagination from "../../components/caja/CajaPagination";
import CajaAlert from "../../components/caja/CajaAlert";
import CajaModalForm from "../../components/caja/CajaModalForm";
import ConfirmActionModal from "../../components/caja/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

type SucursalApi = {
  id_sucursal: number;
  nombre: string;
  activo: boolean;
};

type SucursalOption = {
  id: number;
  label: string;
};

const FILTERS_INITIAL: CajaFiltersState = {
  q: "",
  activo: "TODAS",
  idSucursal: "TODAS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de cajas.";
}

export default function CajaList() {
  const theme = useCajaTheme();

  const [items, setItems] = useState<Caja[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [sucursalesDisponibles, setSucursalesDisponibles] = useState<
    SucursalOption[]
  >([]);

  const [filters, setFilters] = useState<CajaFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedCaja, setSelectedCaja] = useState<Caja | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const [openConfirmActivo, setOpenConfirmActivo] = useState(false);
  const [cajaActivoTarget, setCajaActivoTarget] = useState<Caja | null>(null);
  const [savingActivo, setSavingActivo] = useState(false);

  // Actualiza filtros y reinicia la paginación.
  const updateFilters = useCallback((patch: Partial<CajaFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  // Recarga el listado principal de cajas incluyendo activas e inactivas.
  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await cajaService.listar({ solo_activos: false });
      setItems(data);

      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function cargarListado() {
      try {
        setState("loading");
        setErrorMsg("");

        const data = await cajaService.listar({ solo_activos: false });
        if (!mounted) return;

        setItems(data);
        setState("success");
      } catch (error: unknown) {
        if (!mounted) return;
        setState("error");
        setErrorMsg(getErrorMessage(error));
      }
    }

    void cargarListado();

    return () => {
      mounted = false;
    };
  }, []);

  // Carga el catálogo real de sucursales activas para mostrar sus nombres.
  useEffect(() => {
    let mounted = true;

    async function cargarSucursales() {
      try {
        const { data } = await httpClient.get<SucursalApi[]>(
          "/inventario/sucursales?solo_activos=true",
        );

        if (!mounted) return;

        const opciones = Array.isArray(data)
          ? data.map((sucursal) => ({
              id: sucursal.id_sucursal,
              label: sucursal.nombre,
            }))
          : [];

        setSucursalesDisponibles(opciones);
      } catch {
        if (!mounted) return;
        setSucursalesDisponibles([]);
      }
    }

    void cargarSucursales();

    return () => {
      mounted = false;
    };
  }, []);

  // Aplica filtros en memoria para búsqueda, estado y sucursal.
  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (c: Caja) => {
      if (!q) return true;

      const full =
        `${c.nombre} ${c.codigo} ${c.id_caja} ${c.id_sucursal}`.toLowerCase();

      return full.includes(q);
    };

    const filtrarActivo = (c: Caja) => {
      if (filters.activo === "TODAS") return true;
      if (filters.activo === "ACTIVAS") return c.activo === true;
      if (filters.activo === "INACTIVAS") return c.activo === false;
      return true;
    };

    const filtrarSucursal = (c: Caja) => {
      if (filters.idSucursal === "TODAS") return true;
      return c.id_sucursal === Number(filters.idSucursal);
    };

    return items.filter(
      (c) => filtrarTexto(c) && filtrarActivo(c) && filtrarSucursal(c),
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

  // Calcula el resumen que se mostrará en el encabezado.
  const resumen = useMemo(() => {
    const activas = itemsFiltrados.filter((x) => x.activo).length;
    const inactivas = itemsFiltrados.filter((x) => !x.activo).length;

    return {
      activas,
      inactivas,
      total: itemsFiltrados.length,
    };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedCaja(null);
    setOpenNuevo(true);
  }

  // Carga el detalle completo de la caja antes de editar.
  async function onEditar(caja: Caja) {
    try {
      const detalle = await cajaService.obtener(caja.id_caja);
      setSelectedCaja(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la caja.";
      alert(msg);
    }
  }

  // Carga el detalle completo de la caja antes de visualizar.
  async function onVer(caja: Caja) {
    try {
      const detalle = await cajaService.obtener(caja.id_caja);
      setSelectedCaja(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la caja.";
      alert(msg);
    }
  }

  function onEliminar(caja: Caja) {
    setCajaActivoTarget(caja);
    setOpenConfirmActivo(true);
  }

  // Cambia el estado activo o inactivo de la caja seleccionada.
  async function confirmarCambioActivo() {
    if (!cajaActivoTarget) return;

    try {
      setSavingActivo(true);

      const nuevoActivo = !cajaActivoTarget.activo;

      await cajaService.cambiarActivo(cajaActivoTarget.id_caja, {
        activo: nuevoActivo,
      });

      setOpenConfirmActivo(false);
      setCajaActivoTarget(null);
      void cargar();
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cambiar el estado de la caja.";
      alert(msg);
    } finally {
      setSavingActivo(false);
    }
  }

  const textoNuevoEstado = cajaActivoTarget?.activo ? "INACTIVA" : "ACTIVA";
  const confirmVariant = cajaActivoTarget?.activo ? "danger" : "success";
  const confirmText = cajaActivoTarget?.activo ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <CajaHeader
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
          <CajaFilters
            theme={theme}
            filters={filters}
            sucursalesDisponibles={sucursalesDisponibles}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <CajaAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <CajaTable
          theme={theme}
          items={itemsPagina}
          sucursalesDisponibles={sucursalesDisponibles}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <CajaPagination
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

      <CajaModalForm
        open={openNuevo}
        title="Nueva caja"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <CajaForm
          key="nuevo"
          modo="CREAR"
          initialCaja={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </CajaModalForm>

      <CajaModalForm
        open={openEditar}
        title="Editar caja"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <CajaForm
          key={selectedCaja?.id_caja ?? "editar"}
          modo="EDITAR"
          initialCaja={selectedCaja}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </CajaModalForm>

      <CajaModalForm
        open={openVer}
        title="Visualizar caja"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <CajaForm
          key={selectedCaja?.id_caja ?? "ver"}
          modo="VER"
          initialCaja={selectedCaja}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </CajaModalForm>

      <ConfirmActionModal
        open={openConfirmActivo}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estado de{" "}
            <span className="font-extrabold">
              {cajaActivoTarget?.nombre ?? ""}
            </span>{" "}
            a <span className="font-extrabold">{textoNuevoEstado}</span>?
          </span>
        }
        cancelText="Cancelar"
        confirmText={confirmText}
        loading={savingActivo}
        onCancel={() => {
          if (savingActivo) return;
          setOpenConfirmActivo(false);
          setCajaActivoTarget(null);
        }}
        onConfirm={() => void confirmarCambioActivo()}
      />
    </div>
  );
}
