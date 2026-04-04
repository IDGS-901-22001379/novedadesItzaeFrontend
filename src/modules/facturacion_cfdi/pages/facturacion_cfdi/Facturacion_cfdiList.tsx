// src/modules/facturacion_cfdi/pages/facturacion_cfdi/FacturacionCfdiList.tsx
// Vista principal del módulo Facturación CFDI.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { facturacionCfdiService } from "../../services/facturacion_cfdi.service";
import type {
  Factura,
  FacturaEstado,
} from "../../types/facturacion_cfdi.types";
import { useFacturacionCfdiTheme } from "../../theme/useFacturacionCfdiTheme";
import Facturacion_cfdiForm from "./Facturacion_cfdiForm";

import FacturacionCfdiHeader from "../../components/facturacion_cfdi/FacturacionCfdiHeader";
import FacturacionCfdiFilters, {
  type FacturacionCfdiFiltersState,
} from "../../components/facturacion_cfdi/FacturacionCfdiFilters";
import FacturacionCfdiTable from "../../components/facturacion_cfdi/FacturacionCfdiTable";
import FacturacionCfdiPagination from "../../components/facturacion_cfdi/FacturacionCfdiPagination";
import FacturacionCfdiAlert from "../../components/facturacion_cfdi/FacturacionCfdiAlert";
import FacturacionCfdiModalForm from "../../components/facturacion_cfdi/FacturacionCfdiModalForm";
import ConfirmActionModal from "../../components/facturacion_cfdi/ConfirmActionModal";
import FacturacionCfdiCancelarForm from "./form/cancelacion/FacturacionCfdiCancelarForm";
import { getApiErrorMessage } from "../../../../services/http/getApiErrorMessage";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: FacturacionCfdiFiltersState = {
  q: "",
  estado: "TODOS",
  desde: "",
  hasta: "",
};

function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "No se pudo cargar la lista de facturas.");
}

export default function FacturacionCfdiList() {
  const theme = useFacturacionCfdiTheme();

  const [items, setItems] = useState<Factura[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<FacturacionCfdiFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);

  const [openEmitir, setOpenEmitir] = useState(false);
  const [openVer, setOpenVer] = useState(false);
  const [openEnviar, setOpenEnviar] = useState(false);
  const [openCancelar, setOpenCancelar] = useState(false);

  const [openConfirmTimbrar, setOpenConfirmTimbrar] = useState(false);
  const [facturaTimbrarTarget, setFacturaTimbrarTarget] =
    useState<Factura | null>(null);
  const [savingTimbrar, setSavingTimbrar] = useState(false);
  const [timbrarErrorMsg, setTimbrarErrorMsg] = useState("");

  const updateFilters = useCallback(
    (patch: Partial<FacturacionCfdiFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await facturacionCfdiService.listar();
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

        const data = await facturacionCfdiService.listar();
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

    const filtrarTexto = (f: Factura) => {
      if (!q) return true;

      const full =
        `${f.id_factura} ${f.id_venta} ${f.uuid ?? ""} ${f.serie ?? ""} ${f.folio ?? ""}`.toLowerCase();

      return full.includes(q);
    };

    const filtrarEstado = (f: Factura) => {
      if (filters.estado === "TODOS") return true;
      return f.estado === (filters.estado as FacturaEstado);
    };

    const filtrarDesde = (f: Factura) => {
      if (!filters.desde) return true;
      return f.fecha_emision.slice(0, 10) >= filters.desde;
    };

    const filtrarHasta = (f: Factura) => {
      if (!filters.hasta) return true;
      return f.fecha_emision.slice(0, 10) <= filters.hasta;
    };

    return items.filter(
      (f) =>
        filtrarTexto(f) &&
        filtrarEstado(f) &&
        filtrarDesde(f) &&
        filtrarHasta(f),
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
    const emitidas = itemsFiltrados.filter(
      (x) => x.estado === "EMITIDA",
    ).length;
    const canceladas = itemsFiltrados.filter(
      (x) => x.estado === "CANCELADA",
    ).length;
    const error = itemsFiltrados.filter((x) => x.estado === "ERROR").length;

    return {
      emitidas,
      canceladas,
      error,
      total: itemsFiltrados.length,
    };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedFactura(null);
    setOpenEmitir(true);
  }

  async function onVer(f: Factura) {
    try {
      const detalle = await facturacionCfdiService.obtener(f.id_factura);
      setSelectedFactura(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      setErrorMsg(
        getApiErrorMessage(e, "No se pudo cargar el detalle de la factura."),
      );
    }
  }

  function onTimbrar(f: Factura) {
    setFacturaTimbrarTarget(f);
    setTimbrarErrorMsg("");
    setOpenConfirmTimbrar(true);
  }

  async function confirmarTimbrar() {
    if (!facturaTimbrarTarget) return;

    try {
      setSavingTimbrar(true);
      setTimbrarErrorMsg("");

      await facturacionCfdiService.timbrarSandbox(
        facturaTimbrarTarget.id_factura,
      );

      setOpenConfirmTimbrar(false);
      setFacturaTimbrarTarget(null);
      setTimbrarErrorMsg("");
      void cargar();
    } catch (e: unknown) {
      const msg = getApiErrorMessage(e, "No se pudo timbrar la factura.");
      setTimbrarErrorMsg(msg);
    } finally {
      setSavingTimbrar(false);
    }
  }

  async function onEnviar(f: Factura) {
    try {
      const detalle = await facturacionCfdiService.obtener(f.id_factura);
      setSelectedFactura(detalle);
      setOpenEnviar(true);
    } catch (e: unknown) {
      setErrorMsg(
        getApiErrorMessage(e, "No se pudo cargar la factura para envío."),
      );
    }
  }

  async function onCancelar(f: Factura) {
    try {
      const detalle = await facturacionCfdiService.obtener(f.id_factura);
      setSelectedFactura(detalle);
      setOpenCancelar(true);
    } catch (e: unknown) {
      setErrorMsg(
        getApiErrorMessage(e, "No se pudo cargar la factura para cancelar."),
      );
    }
  }

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <FacturacionCfdiHeader
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
          <FacturacionCfdiFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" || errorMsg ? (
            <div className="mt-3">
              <FacturacionCfdiAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <FacturacionCfdiTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onTimbrar={onTimbrar}
          onEnviar={onEnviar}
          onCancelar={onCancelar}
        />

        <FacturacionCfdiPagination
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

      <FacturacionCfdiModalForm
        open={openEmitir}
        title="Emitir factura CFDI"
        theme={theme}
        onClose={() => setOpenEmitir(false)}
      >
        <Facturacion_cfdiForm
          key="emitir"
          modo="EMITIR"
          initialFactura={null}
          onSuccess={() => {
            setOpenEmitir(false);
            void cargar();
          }}
          onCancel={() => setOpenEmitir(false)}
        />
      </FacturacionCfdiModalForm>

      <FacturacionCfdiModalForm
        open={openVer}
        title="Visualizar factura"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <Facturacion_cfdiForm
          key={selectedFactura?.id_factura ?? "ver"}
          modo="VER"
          initialFactura={selectedFactura}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </FacturacionCfdiModalForm>

      <FacturacionCfdiModalForm
        open={openEnviar}
        title="Enviar factura por correo"
        theme={theme}
        onClose={() => setOpenEnviar(false)}
      >
        <Facturacion_cfdiForm
          key={selectedFactura?.id_factura ?? "enviar"}
          modo="ENVIAR"
          initialFactura={selectedFactura}
          onSuccess={() => {
            setOpenEnviar(false);
          }}
          onCancel={() => setOpenEnviar(false)}
        />
      </FacturacionCfdiModalForm>

      <FacturacionCfdiModalForm
        open={openCancelar}
        title="Cancelar factura CFDI"
        theme={theme}
        onClose={() => setOpenCancelar(false)}
      >
        <FacturacionCfdiCancelarForm
          factura={selectedFactura}
          onSuccess={() => {
            setOpenCancelar(false);
            setSelectedFactura(null);
            void cargar();
          }}
          onCancel={() => {
            setOpenCancelar(false);
            setSelectedFactura(null);
          }}
        />
      </FacturacionCfdiModalForm>

      <ConfirmActionModal
        open={openConfirmTimbrar}
        title="¡Atención!"
        variant="warning"
        message={
          <div className="space-y-3">
            {timbrarErrorMsg ? (
              <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {timbrarErrorMsg}
              </div>
            ) : null}

            <span>
              ¿Estás seguro de timbrar la factura{" "}
              <span className="font-extrabold">
                {facturaTimbrarTarget?.serie ?? ""}
                {facturaTimbrarTarget?.folio ?? ""}
              </span>
              ?
            </span>
          </div>
        }
        cancelText="Cancelar"
        confirmText="Timbrar factura"
        loading={savingTimbrar}
        onCancel={() => {
          if (savingTimbrar) return;
          setOpenConfirmTimbrar(false);
          setFacturaTimbrarTarget(null);
          setTimbrarErrorMsg("");
        }}
        onConfirm={() => void confirmarTimbrar()}
      />
    </div>
  );
}
