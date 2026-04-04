// src/modules/facturacion_cfdi/services/facturacion_cfdi_motivos_cancelacion.service.ts
// Service de motivos de cancelación CFDI para el módulo de facturación.
// Responsabilidades:
// - listar motivos de cancelación CFDI
// - filtrar motivos activos
// - preparar opciones para el formulario de cancelación

import { httpClient } from "../../../services/http/httpClient";
import type {
  MotivoCancelacionCfdi,
  MotivosCancelacionCfdiQuery,
} from "../types/facturacion_cfdi.types";

// Convierte filtros de motivos de cancelación a querystring
function buildMotivosCancelacionQuery(
  params?: MotivosCancelacionCfdiQuery,
): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const facturacionCfdiMotivosCancelacionService = {
  // GET /catalogos/motivos-cancelacion-cfdi
  async listar(
    params?: MotivosCancelacionCfdiQuery,
  ): Promise<MotivoCancelacionCfdi[]> {
    const qs = buildMotivosCancelacionQuery(params);
    const { data } = await httpClient.get<MotivoCancelacionCfdi[]>(
      `/catalogos/motivos-cancelacion-cfdi${qs}`,
    );
    return data;
  },
};