// src/modules/ventas/pages/ventas/form/ventasFormAperturas/useVentasFormAperturas.ts
// Hook del flujo de aperturas para ventas.
// Responsabilidades:
// - Cargar la caja principal y su apertura actual.
// - Exponer el estado de caja abierta/cerrada.
// - Controlar modal de alerta por caja cerrada.
// - Controlar modal pequeño para abrir apertura.
// - Abrir apertura y refrescar estado.
// - Traducir errores comunes del backend, como conflicto 409 por apertura ya existente.

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadVentasFormAperturaContext } from "./ventasFormAperturas.catalogs";
import { VENTAS_APERTURA_DEFAULT_FORM } from "./ventasFormAperturas.constants";
import { ventasFormAperturasService } from "./ventasFormAperturas.service";
import { buildAbrirAperturaFormState } from "./ventasFormAperturas.utils";
import type {
  AbrirAperturaFormState,
  VentaAperturaActual,
  VentaCajaDefault,
} from "./ventasFormAperturas.types";

export type UseVentasFormAperturasVm = {
  loadingApertura: boolean;
  msgAperturaError: string;

  cajaDefault: VentaCajaDefault | null;
  aperturaActual: VentaAperturaActual | null;
  cajaAbierta: boolean;

  modalCajaCerradaOpen: boolean;
  modalAbrirAperturaOpen: boolean;

  abrirAperturaForm: AbrirAperturaFormState;
  setAbrirAperturaForm: React.Dispatch<
    React.SetStateAction<AbrirAperturaFormState>
  >;

  recargarApertura: () => Promise<void>;

  abrirModalCajaCerrada: () => void;
  cerrarModalCajaCerrada: () => void;

  abrirModalNuevaApertura: () => void;
  cerrarModalNuevaApertura: () => void;

  confirmarAbrirApertura: () => Promise<VentaAperturaActual | null>;
};

function traducirErrorApertura(error: unknown): string {
  const rawMsg =
    error instanceof Error ? error.message : "No se pudo abrir la caja.";

  const normalized = rawMsg.toLowerCase();

  if (normalized.includes("409") || normalized.includes("conflict")) {
    return "Ya existe una apertura activa para esta caja.";
  }

  if (normalized.includes("422")) {
    return "Los datos para abrir la caja no son válidos.";
  }

  if (normalized.includes("404")) {
    return "No se encontró la caja seleccionada.";
  }

  return rawMsg;
}

export function useVentasFormAperturas(): UseVentasFormAperturasVm {
  const [loadingApertura, setLoadingApertura] = useState(true);
  const [msgAperturaError, setMsgAperturaError] = useState("");

  const [cajaDefault, setCajaDefault] = useState<VentaCajaDefault | null>(null);
  const [aperturaActual, setAperturaActual] =
    useState<VentaAperturaActual | null>(null);

  const [modalCajaCerradaOpen, setModalCajaCerradaOpen] = useState(false);
  const [modalAbrirAperturaOpen, setModalAbrirAperturaOpen] = useState(false);

  const [abrirAperturaForm, setAbrirAperturaForm] =
    useState<AbrirAperturaFormState>(VENTAS_APERTURA_DEFAULT_FORM);

  const cajaAbierta = useMemo(() => {
    return Boolean(
      aperturaActual?.id_apertura &&
        String(aperturaActual.estatus).toUpperCase() === "ABIERTA",
    );
  }, [aperturaActual]);

  const recargarApertura = useCallback(async () => {
    try {
      setLoadingApertura(true);
      setMsgAperturaError("");

      const ctx = await loadVentasFormAperturaContext();

      setCajaDefault(ctx.cajaDefault);
      setAperturaActual(ctx.aperturaActual);
      setAbrirAperturaForm(buildAbrirAperturaFormState(ctx.cajaDefault));
    } catch {
      setMsgAperturaError(
        "No se pudo cargar el estado de la caja para ventas.",
      );
      setCajaDefault(null);
      setAperturaActual(null);
      setAbrirAperturaForm(VENTAS_APERTURA_DEFAULT_FORM);
    } finally {
      setLoadingApertura(false);
    }
  }, []);

  useEffect(() => {
    void recargarApertura();
  }, [recargarApertura]);

  function abrirModalCajaCerrada() {
    setMsgAperturaError("");
    setModalCajaCerradaOpen(true);
  }

  function cerrarModalCajaCerrada() {
    setModalCajaCerradaOpen(false);
  }

  function abrirModalNuevaApertura() {
    setMsgAperturaError("");
    setModalCajaCerradaOpen(false);
    setAbrirAperturaForm(buildAbrirAperturaFormState(cajaDefault));
    setModalAbrirAperturaOpen(true);
  }

  function cerrarModalNuevaApertura() {
    if (loadingApertura) return;
    setModalAbrirAperturaOpen(false);
  }

  async function confirmarAbrirApertura(): Promise<VentaAperturaActual | null> {
    const monto = Number(abrirAperturaForm.monto_inicial || 0);

    if (!abrirAperturaForm.id_caja || abrirAperturaForm.id_caja <= 0) {
      setMsgAperturaError("No se encontró la caja para abrir la apertura.");
      return null;
    }

    if (!monto || monto <= 0) {
      setMsgAperturaError("Te falta registrar un monto inicial válido.");
      return null;
    }

    try {
      setLoadingApertura(true);
      setMsgAperturaError("");

      const apertura = await ventasFormAperturasService.abrirApertura({
        id_caja: abrirAperturaForm.id_caja,
        monto_inicial: monto,
      });

      if (!apertura) {
        setMsgAperturaError("No se pudo abrir la caja.");
        return null;
      }

      setAperturaActual(apertura);
      setModalAbrirAperturaOpen(false);
      setModalCajaCerradaOpen(false);

      await recargarApertura();

      return apertura;
    } catch (e: unknown) {
      setMsgAperturaError(traducirErrorApertura(e));
      return null;
    } finally {
      setLoadingApertura(false);
    }
  }

  return {
    loadingApertura,
    msgAperturaError,

    cajaDefault,
    aperturaActual,
    cajaAbierta,

    modalCajaCerradaOpen,
    modalAbrirAperturaOpen,

    abrirAperturaForm,
    setAbrirAperturaForm,

    recargarApertura,

    abrirModalCajaCerrada,
    cerrarModalCajaCerrada,

    abrirModalNuevaApertura,
    cerrarModalNuevaApertura,

    confirmarAbrirApertura,
  };
}