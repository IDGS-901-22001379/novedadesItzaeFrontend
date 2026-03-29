// src/modules/cortes_caja/services/cortes_caja.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  CorteCajaApertura,
  CorteCajaAperturaResumen,
  CorteCajaAbrirPayload,
  CorteCajaCerrarPayload,
  CorteCajaMovimiento,
  CorteCajaMovimientoCreate,
  CorteCajaMovimientoResumen,
  CortesCajaAperturasQuery,
  CortesCajaMovimientosQuery,
} from "../types";

// Convierte filtros de aperturas a querystring
function buildAperturasQuery(params?: CortesCajaAperturasQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id_caja !== undefined && params.id_caja !== null) {
    sp.set("id_caja", String(params.id_caja));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros de movimientos a querystring
function buildMovimientosQuery(params: CortesCajaMovimientosQuery): string {
  const sp = new URLSearchParams();

  sp.set("id_apertura", String(params.id_apertura));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const cortesCajaService = {
  // =========================
  // APERTURAS
  // =========================

  // GET /caja/aperturas
  async listarAperturas(
    params?: CortesCajaAperturasQuery
  ): Promise<CorteCajaAperturaResumen[]> {
    const qs = buildAperturasQuery(params);
    const { data } = await httpClient.get<CorteCajaAperturaResumen[]>(
      `/caja/aperturas${qs}`
    );
    return data;
  },

  // GET /caja/aperturas/{id_apertura}
  async obtenerApertura(id_apertura: number): Promise<CorteCajaApertura> {
    const { data } = await httpClient.get<CorteCajaApertura>(
      `/caja/aperturas/${id_apertura}`
    );
    return data;
  },

  // GET /caja/aperturas/caja/{id_caja}/abierta
  async obtenerAperturaAbiertaPorCaja(id_caja: number): Promise<CorteCajaApertura> {
    const { data } = await httpClient.get<CorteCajaApertura>(
      `/caja/aperturas/caja/${id_caja}/abierta`
    );
    return data;
  },

  // POST /caja/aperturas/abrir
  async abrirApertura(payload: CorteCajaAbrirPayload): Promise<CorteCajaApertura> {
    const { data } = await httpClient.post<CorteCajaApertura>(
      `/caja/aperturas/abrir`,
      payload
    );
    return data;
  },

  // POST /caja/aperturas/{id_apertura}/cerrar
  async cerrarApertura(
    id_apertura: number,
    payload: CorteCajaCerrarPayload
  ): Promise<CorteCajaApertura> {
    const { data } = await httpClient.post<CorteCajaApertura>(
      `/caja/aperturas/${id_apertura}/cerrar`,
      payload
    );
    return data;
  },

  // =========================
  // MOVIMIENTOS
  // =========================

  // GET /caja/movimientos?id_apertura=...
  async listarMovimientosPorApertura(
    params: CortesCajaMovimientosQuery
  ): Promise<CorteCajaMovimientoResumen[]> {
    const qs = buildMovimientosQuery(params);
    const { data } = await httpClient.get<CorteCajaMovimientoResumen[]>(
      `/caja/movimientos${qs}`
    );
    return data;
  },

  // POST /caja/movimientos
  async registrarMovimiento(
    payload: CorteCajaMovimientoCreate
  ): Promise<CorteCajaMovimiento> {
    const { data } = await httpClient.post<CorteCajaMovimiento>(
      `/caja/movimientos`,
      payload
    );
    return data;
  },
};