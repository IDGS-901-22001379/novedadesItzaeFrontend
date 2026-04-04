// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/cancelacion/useFacturacionCfdiCancelarForm.ts
// Hook del formulario de cancelación CFDI.
// Responsabilidades:
// - centralizar estado del formulario de cancelación
// - cargar motivos de cancelación activos
// - validar datos
// - ejecutar la cancelación
// - exponer datos listos para render

import { useEffect, useMemo, useState } from "react";
import { facturacionCfdiService } from "../../../../services/facturacion_cfdi.service";
import { facturacionCfdiMotivosCancelacionService } from "../../../../services/facturacion_cfdi_motivos_cancelacion.service";
import { getApiErrorMessage } from "../../../../../../services/http/getApiErrorMessage";
import type { FacturaCancelacionPayload } from "../../../../types/facturacion_cfdi.types";
import type {
  FacturacionCfdiCancelarFormCatalogos,
  FacturacionCfdiCancelarFormProps,
  FacturacionCfdiCancelarFormState,
} from "./facturacionCfdiCancelarForm.types";
import {
  buildCancelarSubtitle,
  buildInitialCancelarForm,
} from "./facturacionCfdiCancelarForm.utils";
import { validarCancelarFactura } from "./facturacionCfdiCancelarForm.validators";

export function useFacturacionCfdiCancelarForm({
  factura,
  onSuccess,
}: Pick<FacturacionCfdiCancelarFormProps, "factura" | "onSuccess">) {
  // Temporal: luego puede salir del usuario autenticado real
  const idUsuarioActual = 1;

  const [form, setForm] = useState<FacturacionCfdiCancelarFormState>(() =>
    buildInitialCancelarForm(factura, idUsuarioActual),
  );
  const [saving, setSaving] = useState(false);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [msgInfo, setMsgInfo] = useState("");

  const [motivosCancelacion, setMotivosCancelacion] = useState<
    FacturacionCfdiCancelarFormCatalogos["motivosCancelacion"]
  >([]);

  useEffect(() => {
    setForm(buildInitialCancelarForm(factura, idUsuarioActual));
    setMsgError("");
    setMsgInfo("");
  }, [factura]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingCatalogos(true);
        setMsgError("");

        const data = await facturacionCfdiMotivosCancelacionService.listar({
          solo_activos: true,
        });

        if (!mounted) return;

        setMotivosCancelacion(data);

        setForm((prev) => {
          if (prev.id_motivo_cancelacion_cfdi) return prev;

          const primero = data[0];
          if (!primero) return prev;

          return {
            ...prev,
            id_motivo_cancelacion_cfdi: String(
              primero.id_motivo_cancelacion_cfdi,
            ),
          };
        });
      } catch (e: unknown) {
        if (!mounted) return;
        setMsgError(
          getApiErrorMessage(
            e,
            "No se pudieron cargar los motivos de cancelación.",
          ),
        );
      } finally {
        if (mounted) setLoadingCatalogos(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const subtitulo = useMemo(() => buildCancelarSubtitle(factura), [factura]);

  async function guardar() {
    const err = validarCancelarFactura(form, factura);
    if (err) {
      setMsgError(err);
      setMsgInfo("");
      return false;
    }

    try {
      setSaving(true);
      setMsgError("");
      setMsgInfo("");

      const payload: FacturaCancelacionPayload = {
        id_factura: Number(form.id_factura),
        id_motivo_cancelacion_cfdi: Number(form.id_motivo_cancelacion_cfdi),
        uuid_sustitucion: form.uuid_sustitucion.trim() || null,
        id_usuario: Number(form.id_usuario),
      };

      await facturacionCfdiService.cancelar(Number(form.id_factura), payload);

      setMsgInfo("La factura fue cancelada correctamente.");
      onSuccess();
      return true;
    } catch (e: unknown) {
      setMsgError(
        getApiErrorMessage(e, "No se pudo cancelar la factura."),
      );
      setMsgInfo("");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    setForm,
    saving,
    loadingCatalogos,
    msgError,
    msgInfo,
    motivosCancelacion,
    subtitulo,
    setMsgError,
    setMsgInfo,
    guardar,
  };
}