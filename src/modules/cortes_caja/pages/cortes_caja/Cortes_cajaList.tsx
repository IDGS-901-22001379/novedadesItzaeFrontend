// src/modules/cortes_caja/pages/cortes_caja/Cortes_cajaList.tsx
// Vista principal del módulo Cortes de Caja.
// Se encarga de cargar aperturas desde la API, aplicar filtros y paginación,
// y conectar la tabla, los modales y la vista de detalle del corte.

import { useCallback, useEffect, useMemo, useState } from "react";
import { cortesCajaService } from "../../services";
import type {
  AperturaCajaEstatus,
  CorteCajaApertura,
  CorteCajaAperturaResumen,
} from "../../types";
import { useCortesCajaTheme } from "../../theme";

import Cortes_cajaHeader from "../../components/cortes_caja/Cortes_cajaHeader";
import Cortes_cajaFilters, {
  type CortesCajaFiltersState,
} from "../../components/cortes_caja/Cortes_cajaFilters";
import Cortes_cajaTable from "../../components/cortes_caja/Cortes_cajaTable";
import Cortes_cajaPagination from "../../components/cortes_caja/Cortes_cajaPagination";
import Cortes_cajaAlert from "../../components/cortes_caja/Cortes_cajaAlert";
import Cortes_cajaModalForm from "../../components/cortes_caja/Cortes_cajaModalForm";

import Cortes_cajaForm from "./Cortes_cajaForm";
import Cortes_cajaDetail from "./Cortes_cajaDetail";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: CortesCajaFiltersState = {
  q: "",
  estatus: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la información de cortes de caja.";
}

export default function Cortes_cajaList() {
  const theme = useCortesCajaTheme();

  const [items, setItems] = useState<CorteCajaAperturaResumen[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<CortesCajaFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedApertura, setSelectedApertura] =
    useState<CorteCajaApertura | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openCerrar, setOpenCerrar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // Actualiza filtros y reinicia la paginación.
  const updateFilters = useCallback(
    (patch: Partial<CortesCajaFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  // Carga el listado principal de aperturas.
  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await cortesCajaService.listarAperturas();
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

        const data = await cortesCajaService.listarAperturas();
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

  // Aplica filtros locales al listado cargado.
  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (a: CorteCajaAperturaResumen) => {
      if (!q) return true;

      const full = [
        a.id_apertura,
        a.id_caja,
        a.id_usuario,
        a.estatus,
        a.fecha_hora_apertura,
        a.fecha_hora_cierre ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return full.includes(q);
    };

    const filtrarEstatus = (a: CorteCajaAperturaResumen) => {
      if (filters.estatus === "TODOS") return true;
      return a.estatus === (filters.estatus as AperturaCajaEstatus);
    };

    return items.filter((a) => filtrarTexto(a) && filtrarEstatus(a));
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
    const abiertas = itemsFiltrados.filter(
      (x) => x.estatus === "ABIERTA",
    ).length;
    const cerradas = itemsFiltrados.filter(
      (x) => x.estatus === "CERRADA",
    ).length;

    return {
      abiertas,
      cerradas,
      total: itemsFiltrados.length,
    };
  }, [itemsFiltrados]);

  // Abre el modal para registrar una nueva apertura.
  function onNuevo() {
    setSelectedApertura(null);
    setOpenNuevo(true);
  }

  // Carga el detalle completo y abre la vista de solo lectura.
  async function onVer(a: CorteCajaAperturaResumen) {
    try {
      const detalle = await cortesCajaService.obtenerApertura(a.id_apertura);
      setSelectedApertura(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del corte de caja.";
      alert(msg);
    }
  }

  // Carga el detalle completo y abre el modal para cerrar la apertura.
  async function onCerrar(a: CorteCajaAperturaResumen) {
    try {
      const detalle = await cortesCajaService.obtenerApertura(a.id_apertura);
      setSelectedApertura(detalle);
      setOpenCerrar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar la apertura para realizar el cierre.";
      alert(msg);
    }
  }

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <Cortes_cajaHeader
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
          <Cortes_cajaFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <Cortes_cajaAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <Cortes_cajaTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onCerrar={onCerrar}
        />

        <Cortes_cajaPagination
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

      <Cortes_cajaModalForm
        open={openNuevo}
        title="Abrir caja"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <Cortes_cajaForm
          key="nuevo"
          modo="ABRIR"
          initialApertura={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </Cortes_cajaModalForm>

      <Cortes_cajaModalForm
        open={openCerrar}
        title="Cerrar caja"
        theme={theme}
        onClose={() => setOpenCerrar(false)}
      >
        <Cortes_cajaForm
          key={selectedApertura?.id_apertura ?? "cerrar"}
          modo="CERRAR"
          initialApertura={selectedApertura}
          onSuccess={() => {
            setOpenCerrar(false);
            void cargar();
          }}
          onCancel={() => setOpenCerrar(false)}
        />
      </Cortes_cajaModalForm>

      <Cortes_cajaModalForm
        open={openVer}
        title="Visualizar corte de caja"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <Cortes_cajaDetail
          apertura={selectedApertura}
          onClose={() => setOpenVer(false)}
        />
      </Cortes_cajaModalForm>
    </div>
  );
}
