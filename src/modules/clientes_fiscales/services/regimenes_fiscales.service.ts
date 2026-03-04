// src/modules/clientes_fiscales/services/regimenes_fiscales.service.ts
// Service de Regímenes Fiscales (Catálogo base) para Clientes Fiscales.

import { httpClient } from "../../../services/http/httpClient";
import type {
  RegimenFiscal,
  RegimenFiscalCreate,
  RegimenFiscalUpdate,
  RegimenesFiscalesQuery,
} from "../types/regimenes_fiscales.types";

function buildQuery(params?: RegimenesFiscalesQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) sp.set("solo_activos", String(params.solo_activos));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const regimenesFiscalesService = {
  // GET /catalogos/regimenes-fiscales?solo_activos=true
  async listar(params?: RegimenesFiscalesQuery): Promise<RegimenFiscal[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<RegimenFiscal[]>(`/catalogos/regimenes-fiscales${qs}`);
    return data;
  },

  // GET /catalogos/regimenes-fiscales/{id_regimen_fiscal}
  async obtener(id_regimen_fiscal: number): Promise<RegimenFiscal> {
    const { data } = await httpClient.get<RegimenFiscal>(
      `/catalogos/regimenes-fiscales/${id_regimen_fiscal}`
    );
    return data;
  },

  // POST /catalogos/regimenes-fiscales
  async crear(payload: RegimenFiscalCreate): Promise<RegimenFiscal> {
    const { data } = await httpClient.post<RegimenFiscal>(
      `/catalogos/regimenes-fiscales`,
      payload
    );
    return data;
  },

  // PUT /catalogos/regimenes-fiscales/{id_regimen_fiscal}
  async actualizar(id_regimen_fiscal: number, payload: RegimenFiscalUpdate): Promise<RegimenFiscal> {
    const { data } = await httpClient.put<RegimenFiscal>(
      `/catalogos/regimenes-fiscales/${id_regimen_fiscal}`,
      payload
    );
    return data;
  },

  // PATCH /catalogos/regimenes-fiscales/{id_regimen_fiscal}/desactivar
  async desactivar(id_regimen_fiscal: number): Promise<RegimenFiscal> {
    const { data } = await httpClient.patch<RegimenFiscal>(
      `/catalogos/regimenes-fiscales/${id_regimen_fiscal}/desactivar`,
      {}
    );
    return data;
  },
};