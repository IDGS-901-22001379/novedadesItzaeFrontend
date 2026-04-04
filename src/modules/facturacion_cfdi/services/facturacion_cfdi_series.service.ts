// src/modules/facturacion_cfdi/services/facturacion_cfdi_series.service.ts
// Service de series de facturación para el módulo CFDI.
// Responsabilidades:
// - listar series por sucursal
// - filtrar series activas
// - preparar opciones de serie para emisión

import { httpClient } from "../../../services/http/httpClient";
import type {
  SerieFacturacion,
  SeriesFacturacionQuery,
} from "../types/facturacion_cfdi.types";

// Convierte filtros de series a querystring
function buildSeriesQuery(params?: SeriesFacturacionQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.solo_activas !== undefined) {
    sp.set("solo_activas", String(params.solo_activas));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const facturacionCfdiSeriesService = {
  // GET /configuracion-facturacion/series
  async listar(params?: SeriesFacturacionQuery): Promise<SerieFacturacion[]> {
    const qs = buildSeriesQuery(params);
    const { data } = await httpClient.get<SerieFacturacion[]>(
      `/configuracion-facturacion/series${qs}`,
    );
    return data;
  },
};