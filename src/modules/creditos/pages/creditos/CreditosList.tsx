// src/modules/creditos/pages/creditos/CreditosList.tsx
// Vista principal del módulo Créditos.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { creditosService } from "../../services/creditos.service";
import type {
  Credito,
  CreditoListItem,
  CreditoEstado,
} from "../../types/creditos.types";
import CreditosForm from "./CreditosForm";

import { useCreditosTheme } from "../../theme/useCreditosTheme";
import CreditosHeader from "../../components/creditos/CreditosHeader";
import CreditosFilters, {
  type CreditosFiltersState,
} from "../../components/creditos/CreditosFilters";
import CreditosTable from "../../components/creditos/CreditosTable";
import CreditosPagination from "../../components/creditos/CreditosPagination";
import CreditosAlert from "../../components/creditos/CreditosAlert";
import CreditosModalForm from "../../components/creditos/CreditosModalForm";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: CreditosFiltersState = {
  q: "",
  estado: "TODOS",
  idCliente: "",
  idVenta: "",
  vencidosSolo: false,
  fechaVencimientoDesde: "",
  fechaVencimientoHasta: "",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de créditos.";
}

function isCreditoVencido(item: CreditoListItem): boolean {
  if (Number(item.saldo_pendiente) <= 0) return false;
  if (!item.fecha_vencimiento) return false;

  const hoy = new Date();
  const vencimiento = new Date(`${item.fecha_vencimiento}T23:59:59`);

  return vencimiento.getTime() < hoy.getTime();
}

export default function CreditosList() {
  const theme = useCreditosTheme();

  const [items, setItems] = useState<CreditoListItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] = useState<CreditosFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedCredito, setSelectedCredito] = useState<Credito | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const updateFilters = useCallback((patch: Partial<CreditosFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await creditosService.listarUltimos({
        limit: 100,
        offset: 0,
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

        const data = await creditosService.listarUltimos({
          limit: 100,
          offset: 0,
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

    const filtrarTexto = (c: CreditoListItem) => {
      if (!q) return true;
      const full =
        `${c.id_venta_credito} ${c.id_venta} ${c.id_cliente} ${c.estado}`.toLowerCase();
      return full.includes(q);
    };

    const filtrarEstado = (c: CreditoListItem) => {
      if (filters.estado === "TODOS") return true;
      return c.estado === (filters.estado as CreditoEstado);
    };

    const filtrarCliente = (c: CreditoListItem) => {
      if (!filters.idCliente.trim()) return true;
      return c.id_cliente === Number(filters.idCliente);
    };

    const filtrarVenta = (c: CreditoListItem) => {
      if (!filters.idVenta.trim()) return true;
      return c.id_venta === Number(filters.idVenta);
    };

    const filtrarVencidos = (c: CreditoListItem) => {
      if (!filters.vencidosSolo) return true;
      return isCreditoVencido(c);
    };

    const filtrarFechaDesde = (c: CreditoListItem) => {
      if (!filters.fechaVencimientoDesde) return true;
      return c.fecha_vencimiento >= filters.fechaVencimientoDesde;
    };

    const filtrarFechaHasta = (c: CreditoListItem) => {
      if (!filters.fechaVencimientoHasta) return true;
      return c.fecha_vencimiento <= filters.fechaVencimientoHasta;
    };

    return items.filter(
      (c) =>
        filtrarTexto(c) &&
        filtrarEstado(c) &&
        filtrarCliente(c) &&
        filtrarVenta(c) &&
        filtrarVencidos(c) &&
        filtrarFechaDesde(c) &&
        filtrarFechaHasta(c),
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
    const pendientes = itemsFiltrados.filter(
      (x) => x.estado === "PENDIENTE",
    ).length;
    const parciales = itemsFiltrados.filter(
      (x) => x.estado === "PARCIAL",
    ).length;
    const pagados = itemsFiltrados.filter((x) => x.estado === "PAGADO").length;
    const vencidos = itemsFiltrados.filter((x) => isCreditoVencido(x)).length;

    return {
      pendientes,
      parciales,
      pagados,
      vencidos,
      total: itemsFiltrados.length,
    };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedCredito(null);
    setOpenNuevo(true);
  }

  async function onEditar(item: CreditoListItem) {
    try {
      const detalle = await creditosService.obtener(item.id_venta_credito);
      setSelectedCredito(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del crédito.";
      alert(msg);
    }
  }

  async function onVer(item: CreditoListItem) {
    try {
      const detalle = await creditosService.obtener(item.id_venta_credito);
      setSelectedCredito(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del crédito.";
      alert(msg);
    }
  }

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <CreditosHeader
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
          <CreditosFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <CreditosAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <CreditosTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onEditar={onEditar}
        />

        <CreditosPagination
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

      <CreditosModalForm
        open={openNuevo}
        title="Nuevo crédito"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <CreditosForm
          key="nuevo"
          modo="CREAR"
          initialCredito={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </CreditosModalForm>

      <CreditosModalForm
        open={openEditar}
        title="Editar crédito"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <CreditosForm
          key={selectedCredito?.id_venta_credito ?? "editar"}
          modo="EDITAR"
          initialCredito={selectedCredito}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </CreditosModalForm>

      <CreditosModalForm
        open={openVer}
        title="Visualizar crédito"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <CreditosForm
          key={selectedCredito?.id_venta_credito ?? "ver"}
          modo="VER"
          initialCredito={selectedCredito}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </CreditosModalForm>
    </div>
  );
}
