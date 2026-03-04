// src/modules/clientes_fiscales/services/usos_cfdi.service.ts
// Service de Usos CFDI (Catálogo base) para Clientes Fiscales.

import { httpClient } from "../../../services/http/httpClient";
import type {
  UsoCfdi,
  UsoCfdiCreate,
  UsoCfdiUpdate,
  UsosCfdiQuery,
} from "../types/usos_cfdi.types";

function buildQuery(params?: UsosCfdiQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) sp.set("solo_activos", String(params.solo_activos));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const usosCfdiService = {
  // GET /catalogos/usos-cfdi?solo_activos=true
  async listar(params?: UsosCfdiQuery): Promise<UsoCfdi[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<UsoCfdi[]>(`/catalogos/usos-cfdi${qs}`);
    return data;
  },

  // GET /catalogos/usos-cfdi/{id_uso_cfdi}
  async obtener(id_uso_cfdi: number): Promise<UsoCfdi> {
    const { data } = await httpClient.get<UsoCfdi>(`/catalogos/usos-cfdi/${id_uso_cfdi}`);
    return data;
  },

  // POST /catalogos/usos-cfdi
  async crear(payload: UsoCfdiCreate): Promise<UsoCfdi> {
    const { data } = await httpClient.post<UsoCfdi>(`/catalogos/usos-cfdi`, payload);
    return data;
  },

  // PUT /catalogos/usos-cfdi/{id_uso_cfdi}
  async actualizar(id_uso_cfdi: number, payload: UsoCfdiUpdate): Promise<UsoCfdi> {
    const { data } = await httpClient.put<UsoCfdi>(`/catalogos/usos-cfdi/${id_uso_cfdi}`, payload);
    return data;
  },

  // PATCH /catalogos/usos-cfdi/{id_uso_cfdi}/desactivar
  async desactivar(id_uso_cfdi: number): Promise<UsoCfdi> {
    const { data } = await httpClient.patch<UsoCfdi>(`/catalogos/usos-cfdi/${id_uso_cfdi}/desactivar`, {});
    return data;
  },
};