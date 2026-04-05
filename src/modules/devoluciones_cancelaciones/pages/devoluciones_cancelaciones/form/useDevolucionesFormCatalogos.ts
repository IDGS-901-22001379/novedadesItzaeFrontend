// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/useDevolucionesFormCatalogos.ts
// Hook de catálogos del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Cargar formas de pago.
// - Cargar ubicaciones según disposición.
// - Sincronizar selección actual de ubicación.

import { useEffect, useState } from "react";
import { devolucionesCatalogosService } from "../../../services/devolucionesCatalogos.service";
import { devolucionesUbicacionesService } from "../../../services/devoluciones_ubicaciones.service";
import type { DevolucionFormaPagoOption } from "../../../types/devoluciones_catalogos.types";
import type { FormState, UbicacionOption } from "./devolucionesForm.types";

type Params = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  setMsgError: React.Dispatch<React.SetStateAction<string>>;
};

export function useDevolucionesFormCatalogos({
  form,
  setForm,
  setMsgError,
}: Params) {
  const [formasPagoLoading, setFormasPagoLoading] = useState(false);
  const [formasPagoOptions, setFormasPagoOptions] = useState<
    DevolucionFormaPagoOption[]
  >([]);
  const [ubicacionesLoading, setUbicacionesLoading] = useState(false);
  const [ubicacionesOptions, setUbicacionesOptions] = useState<UbicacionOption[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setFormasPagoLoading(true);
        const formas = await devolucionesCatalogosService.listarFormasPago();
        if (!mounted) return;
        setFormasPagoOptions(formas);
      } catch (e: unknown) {
        if (!mounted) return;
        setMsgError(
          e instanceof Error ? e.message : "No se pudieron cargar las formas de pago.",
        );
      } finally {
        if (mounted) setFormasPagoLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setMsgError]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setUbicacionesLoading(true);
        const ubicaciones =
          await devolucionesUbicacionesService.listarUbicacionesPorDisposicion(
            form.disposicion,
          );
        if (!mounted) return;

        setUbicacionesOptions(ubicaciones);
        const currentId = Number(form.id_ubicacion_destino);
        const existeActual = ubicaciones.some((x) => x.id_ubicacion === currentId);

        if (!existeActual) {
          setForm((prev) => ({ ...prev, id_ubicacion_destino: "" }));
        }
      } catch (e: unknown) {
        if (!mounted) return;
        setMsgError(
          e instanceof Error ? e.message : "No se pudieron cargar las ubicaciones.",
        );
      } finally {
        if (mounted) setUbicacionesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [form.disposicion, form.id_ubicacion_destino, setForm, setMsgError]);

  return {
    formasPagoLoading,
    formasPagoOptions,
    ubicacionesLoading,
    ubicacionesOptions,
  };
}   