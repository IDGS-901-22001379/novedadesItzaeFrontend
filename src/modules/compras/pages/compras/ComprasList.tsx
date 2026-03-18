// src/modules/compras/pages/compras/ComprasList.tsx
// Vista principal del módulo Compras.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { comprasService } from "../../services/compras.service";
import type {
  Compra,
  CompraDetalle,
  CompraListItem,
} from "../../types/compras.types";
import ComprasForm from "./ComprasForm";

import { useComprasTheme } from "../../theme/useComprasTheme";
import ComprasHeader from "../../components/compras/ComprasHeader";
import ComprasFilters, {
  type ComprasFiltersState,
} from "../../components/compras/ComprasFilters";
import ComprasTable from "../../components/compras/ComprasTable";
import ComprasPagination from "../../components/compras/ComprasPagination";
import ComprasAlert from "../../components/compras/ComprasAlert";
import ComprasModalForm from "../../components/compras/ComprasModalForm";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: ComprasFiltersState = {
  q: "",
  idProveedor: "TODOS",
  idUbicacionDestino: "TODOS",
  desde: "",
  hasta: "",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de compras.";
}

export default function ComprasList() {
  const theme = useComprasTheme();

  const [items, setItems] = useState<CompraListItem[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [ubicacionesMap, setUbicacionesMap] = useState<Record<number, string>>(
    {},
  );

  const [filters, setFilters] = useState<ComprasFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [selectedDetalles, setSelectedDetalles] = useState<CompraDetalle[]>([]);
  const [selectedProveedorLabel, setSelectedProveedorLabel] = useState("");
  const [selectedUbicacionLabel, setSelectedUbicacionLabel] = useState("");

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const updateFilters = useCallback((patch: Partial<ComprasFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  const cargarUbicacionesMap = useCallback(async () => {
    const sucursalesActivas = await comprasService.listarSucursalesActivas();

    const ubicacionesPorSucursal = await Promise.all(
      sucursalesActivas.map((sucursal) =>
        comprasService.listarUbicacionesActivasPorSucursal(
          sucursal.id_sucursal,
        ),
      ),
    );

    const todasLasUbicaciones = ubicacionesPorSucursal.flat();

    const nextMap: Record<number, string> = {};
    for (const ubicacion of todasLasUbicaciones) {
      nextMap[ubicacion.id_ubicacion] = ubicacion.label;
    }

    setUbicacionesMap(nextMap);
  }, []);

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const [data] = await Promise.all([
        comprasService.listar({
          q: filters.q.trim() || undefined,
          id_proveedor:
            filters.idProveedor === "TODOS"
              ? undefined
              : Number(filters.idProveedor),
          id_ubicacion_destino:
            filters.idUbicacionDestino === "TODOS"
              ? undefined
              : Number(filters.idUbicacionDestino),
          desde: filters.desde || undefined,
          hasta: filters.hasta || undefined,
          limit: 100,
          offset: 0,
        }),
        cargarUbicacionesMap(),
      ]);

      setItems(data);
      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [filters, cargarUbicacionesMap]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void cargar();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [cargar]);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const itemsPagina = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  const resumen = useMemo(() => {
    const montoTotal = items.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0,
    );
    const subtotalTotal = items.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0,
    );

    return {
      totalCompras: items.length,
      montoTotal,
      subtotalTotal,
    };
  }, [items]);

  function onNuevo() {
    setOpenNuevo(true);
  }

  async function onVer(item: CompraListItem) {
    try {
      const [detalle, detalles] = await Promise.all([
        comprasService.obtener(item.id_compra),
        comprasService.listarDetalles(item.id_compra),
      ]);

      setSelectedCompra(detalle);
      setSelectedDetalles(detalles);
      setSelectedProveedorLabel(item.proveedor || "");
      setSelectedUbicacionLabel(
        ubicacionesMap[item.id_ubicacion_destino] ||
          `Ubicación #${item.id_ubicacion_destino}`,
      );
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle de la compra.";
      alert(msg);
    }
  }

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <ComprasHeader
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
          <ComprasFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <ComprasAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <ComprasTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          ubicacionesMap={ubicacionesMap}
        />

        <ComprasPagination
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

      <ComprasModalForm
        open={openNuevo}
        title="Nueva compra"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <ComprasForm
          key="nuevo"
          modo="CREAR"
          initialCompra={null}
          initialDetalles={[]}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </ComprasModalForm>

      <ComprasModalForm
        open={openVer}
        title="Visualizar compra"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <ComprasForm
          key={selectedCompra?.id_compra ?? "ver"}
          modo="VER"
          initialCompra={selectedCompra}
          initialDetalles={selectedDetalles}
          initialProveedorLabel={selectedProveedorLabel}
          initialUbicacionLabel={selectedUbicacionLabel}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </ComprasModalForm>
    </div>
  );
}
