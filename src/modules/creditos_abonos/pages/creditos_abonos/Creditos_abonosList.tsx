// src/modules/creditos_abonos/pages/creditos_abonos/Creditos_abonosList.tsx
// Vista principal del módulo Créditos Abonos.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { creditosAbonosService } from "../../services/creditos_abonos.service";
import type {
  AbonoCreditoEstatus,
  CreditoAbono,
  CreditoAbonoResumen,
} from "../../types/creditos_abonos.types";
import Creditos_abonosForm from "./Creditos_abonosForm";

import { useCreditosAbonosTheme } from "../../theme/useCreditosAbonosTheme";
import CreditosAbonosHeader from "../../components/creditos_abonos/CreditosAbonosHeader";
import CreditosAbonosFilters, {
  type CreditosAbonosFiltersState,
} from "../../components/creditos_abonos/CreditosAbonosFilters";
import CreditosAbonosTable from "../../components/creditos_abonos/CreditosAbonosTable";
import CreditosAbonosPagination from "../../components/creditos_abonos/CreditosAbonosPagination";
import CreditosAbonosAlert from "../../components/creditos_abonos/CreditosAbonosAlert";
import CreditosAbonosModalForm from "../../components/creditos_abonos/CreditosAbonosModalForm";
import ConfirmActionModal from "../../components/creditos_abonos/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: CreditosAbonosFiltersState = {
  q: "",
  estatus: "TODOS",
  idFormaPago: "TODOS",
  idCliente: "",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de abonos.";
}

export default function Creditos_abonosList() {
  const theme = useCreditosAbonosTheme();

  const [items, setItems] = useState<CreditoAbonoResumen[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] =
    useState<CreditosAbonosFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedAbono, setSelectedAbono] = useState<CreditoAbono | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // modal confirmación cancelación
  const [openConfirmCancelar, setOpenConfirmCancelar] = useState(false);
  const [abonoCancelarTarget, setAbonoCancelarTarget] =
    useState<CreditoAbonoResumen | null>(null);
  const [savingCancelar, setSavingCancelar] = useState(false);

  const updateFilters = useCallback(
    (patch: Partial<CreditosAbonosFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await creditosAbonosService.listarUltimos({
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

        const data = await creditosAbonosService.listarUltimos({
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

    const filtrarTexto = (a: CreditoAbonoResumen) => {
      if (!q) return true;
      const full =
        `${a.folio} ${a.id_abono} ${a.id_cliente} ${a.monto_total}`.toLowerCase();
      return full.includes(q);
    };

    const filtrarEstatus = (a: CreditoAbonoResumen) => {
      if (filters.estatus === "TODOS") return true;
      return a.estatus === (filters.estatus as AbonoCreditoEstatus);
    };

    const filtrarFormaPago = (a: CreditoAbonoResumen) => {
      if (filters.idFormaPago === "TODOS") return true;
      return a.id_forma_pago === Number(filters.idFormaPago);
    };

    const filtrarCliente = (a: CreditoAbonoResumen) => {
      if (!filters.idCliente.trim()) return true;
      return a.id_cliente === Number(filters.idCliente);
    };

    return items.filter(
      (a) =>
        filtrarTexto(a) &&
        filtrarEstatus(a) &&
        filtrarFormaPago(a) &&
        filtrarCliente(a),
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
    const registrados = itemsFiltrados.filter(
      (x) => x.estatus === "REGISTRADO",
    ).length;
    const cancelados = itemsFiltrados.filter(
      (x) => x.estatus === "CANCELADO",
    ).length;

    return { registrados, cancelados, total: itemsFiltrados.length };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedAbono(null);
    setOpenNuevo(true);
  }

  async function onEditar(a: CreditoAbonoResumen) {
    try {
      const detalle = await creditosAbonosService.obtener(a.id_abono);
      setSelectedAbono(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del abono.";
      alert(msg);
    }
  }

  async function onVer(a: CreditoAbonoResumen) {
    try {
      const detalle = await creditosAbonosService.obtener(a.id_abono);
      setSelectedAbono(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del abono.";
      alert(msg);
    }
  }

  function onCancelar(a: CreditoAbonoResumen) {
    setAbonoCancelarTarget(a);
    setOpenConfirmCancelar(true);
  }

  async function confirmarCancelacion() {
    if (!abonoCancelarTarget) return;

    try {
      setSavingCancelar(true);

      await creditosAbonosService.cancelar(abonoCancelarTarget.id_abono, {
        id_usuario_cancela: 1,
        motivo_cancelacion: "Cancelación administrativa",
      });

      setOpenConfirmCancelar(false);
      setAbonoCancelarTarget(null);
      void cargar();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "No se pudo cancelar el abono.";
      alert(msg);
    } finally {
      setSavingCancelar(false);
    }
  }

  return (
    <div className="p-4">
      {/* BLOQUE COMPLETO (TÍTULO + BOTÓN + FILTROS) CON EL MISMO COLOR QUE LA TABLA */}
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <CreditosAbonosHeader
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
          <CreditosAbonosFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <CreditosAbonosAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      {/* TABLA SEPARADA */}
      <div className="mt-4">
        <CreditosAbonosTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onEditar={onEditar}
          onCancelar={onCancelar}
        />

        <CreditosAbonosPagination
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
      <CreditosAbonosModalForm
        open={openNuevo}
        title="Nuevo abono"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <Creditos_abonosForm
          key="nuevo"
          modo="CREAR"
          initialAbono={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </CreditosAbonosModalForm>

      {/* MODAL: EDITAR */}
      <CreditosAbonosModalForm
        open={openEditar}
        title="Editar abono"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <Creditos_abonosForm
          key={selectedAbono?.id_abono ?? "editar"}
          modo="EDITAR"
          initialAbono={selectedAbono}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </CreditosAbonosModalForm>

      {/* MODAL: VER */}
      <CreditosAbonosModalForm
        open={openVer}
        title="Visualizar abono"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <Creditos_abonosForm
          key={selectedAbono?.id_abono ?? "ver"}
          modo="VER"
          initialAbono={selectedAbono}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </CreditosAbonosModalForm>

      {/* CONFIRM: CANCELAR */}
      <ConfirmActionModal
        open={openConfirmCancelar}
        title="¡Atención!"
        variant="danger"
        message={
          <span>
            ¿Estás seguro de cancelar el abono{" "}
            <span className="font-extrabold">
              {abonoCancelarTarget?.folio ?? ""}
            </span>
            ?
          </span>
        }
        cancelText="Cerrar"
        confirmText="Cancelar abono"
        loading={savingCancelar}
        onCancel={() => {
          if (savingCancelar) return;
          setOpenConfirmCancelar(false);
          setAbonoCancelarTarget(null);
        }}
        onConfirm={() => void confirmarCancelacion()}
      />
    </div>
  );
}
