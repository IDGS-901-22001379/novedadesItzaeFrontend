// src/modules/devoluciones_cancelaciones/services/devoluciones_cancelaciones.service.ts
// Service del módulo de devoluciones/cancelaciones.
// Responsabilidades:
// - Consumir endpoints de devoluciones.
// - Consumir endpoints de devoluciones detalle.
// - Convertir filtros a querystring para listados y consultas.
// - Exponer funciones listas para usar en páginas, tablas, widgets y modales.
// - Enriquecer devoluciones con el folio real de venta para UI.

import { httpClient } from "../../../services/http/httpClient";
import { devolucionesVentasService } from "./devoluciones_ventas.service";
import type {
  Devolucion,
  DevolucionCreate,
  DevolucionDetail,
  DevolucionDetalle,
  DevolucionDetalleDetail,
  DevolucionEstatusUpdate,
  DevolucionMotivoUpdate,
  DevolucionesDetalleQuery,
  DevolucionesQuery,
  DevolucionesUltimasQuery,
} from "../types/devoluciones_cancelaciones.types";

// Convierte filtros de devoluciones a querystring (listado)
function buildDevolucionesQuery(params?: DevolucionesQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.id_cliente !== undefined) {
    sp.set("id_cliente", String(params.id_cliente));
  }
  if (params.id_venta !== undefined) {
    sp.set("id_venta", String(params.id_venta));
  }
  if (params.tipo) sp.set("tipo", params.tipo);
  if (params.desde) sp.set("desde", params.desde);
  if (params.hasta) sp.set("hasta", params.hasta);
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros de últimas devoluciones a querystring
function buildUltimasQuery(params?: DevolucionesUltimasQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.limit !== undefined) sp.set("limit", String(params.limit));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros de devoluciones detalle a querystring
function buildDevolucionesDetalleQuery(params: DevolucionesDetalleQuery): string {
  const sp = new URLSearchParams();

  sp.set("id_devolucion", String(params.id_devolucion));

  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

type DevolucionWithVentaFolio = Devolucion & {
  venta_folio?: string | null;
  folio_venta?: string | null;
  numero_venta?: string | null;
};

type DevolucionDetailWithVentaFolio = DevolucionDetail & {
  venta_folio?: string | null;
  folio_venta?: string | null;
  numero_venta?: string | null;
};

async function enriquecerDevolucionesConVentaFolio(
  devoluciones: Devolucion[],
): Promise<DevolucionWithVentaFolio[]> {
  const idsVenta = Array.from(
    new Set(
      devoluciones
        .map((item) => item.id_venta)
        .filter((idVenta) => Number.isFinite(idVenta) && idVenta > 0),
    ),
  );

  if (idsVenta.length === 0) {
    return devoluciones;
  }

  const mapaFoliosVenta = new Map<number, string>();

  await Promise.all(
    idsVenta.map(async (idVenta) => {
      try {
        const venta = await devolucionesVentasService.obtenerOpcion(idVenta);
        if (venta?.folio) {
          mapaFoliosVenta.set(idVenta, venta.folio);
        }
      } catch {
        // fallback silencioso
      }
    }),
  );

  return devoluciones.map((item) => ({
    ...item,
    venta_folio:
      (item as DevolucionWithVentaFolio).venta_folio ||
      (item as DevolucionWithVentaFolio).folio_venta ||
      (item as DevolucionWithVentaFolio).numero_venta ||
      mapaFoliosVenta.get(item.id_venta) ||
      null,
  }));
}

async function enriquecerDevolucionConVentaFolio(
  devolucion: DevolucionDetail,
): Promise<DevolucionDetailWithVentaFolio> {
  const actual = devolucion as DevolucionDetailWithVentaFolio;

  if (actual.venta_folio || actual.folio_venta || actual.numero_venta) {
    return actual;
  }

  if (!devolucion.id_venta || devolucion.id_venta <= 0) {
    return actual;
  }

  try {
    const venta = await devolucionesVentasService.obtenerOpcion(devolucion.id_venta);

    return {
      ...actual,
      venta_folio: venta?.folio || null,
    };
  } catch {
    return actual;
  }
}

export const devolucionesCancelacionesService = {
  // =========================
  // DEVOLUCIONES
  // =========================

  // GET /devoluciones
  async listar(params?: DevolucionesQuery): Promise<DevolucionWithVentaFolio[]> {
    const qs = buildDevolucionesQuery(params);
    const { data } = await httpClient.get<Devolucion[]>(`/devoluciones${qs}`);
    return enriquecerDevolucionesConVentaFolio(Array.isArray(data) ? data : []);
  },

  // GET /devoluciones/ultimas
  async listarUltimas(
    params?: DevolucionesUltimasQuery,
  ): Promise<DevolucionWithVentaFolio[]> {
    const qs = buildUltimasQuery(params);
    const { data } = await httpClient.get<Devolucion[]>(`/devoluciones/ultimas${qs}`);
    return enriquecerDevolucionesConVentaFolio(Array.isArray(data) ? data : []);
  },

  // GET /devoluciones/{id_devolucion}
  async obtener(id_devolucion: number): Promise<DevolucionDetailWithVentaFolio> {
    const { data } = await httpClient.get<DevolucionDetail>(
      `/devoluciones/${id_devolucion}`,
    );
    return enriquecerDevolucionConVentaFolio(data);
  },

  // POST /devoluciones
  async crear(payload: DevolucionCreate): Promise<DevolucionDetailWithVentaFolio> {
    const { data } = await httpClient.post<DevolucionDetail>(`/devoluciones`, payload);
    return enriquecerDevolucionConVentaFolio(data);
  },

  // PATCH /devoluciones/{id_devolucion}/motivo
  async actualizarMotivo(
    id_devolucion: number,
    payload: DevolucionMotivoUpdate,
  ): Promise<DevolucionDetailWithVentaFolio> {
    const { data } = await httpClient.patch<DevolucionDetail>(
      `/devoluciones/${id_devolucion}/motivo`,
      payload,
    );
    return enriquecerDevolucionConVentaFolio(data);
  },

  // PATCH /devoluciones/{id_devolucion}/estatus
  async cambiarEstatus(
    id_devolucion: number,
    payload: DevolucionEstatusUpdate,
  ): Promise<DevolucionDetailWithVentaFolio> {
    const { data } = await httpClient.patch<DevolucionDetail>(
      `/devoluciones/${id_devolucion}/estatus`,
      payload,
    );
    return enriquecerDevolucionConVentaFolio(data);
  },

  // =========================
  // DEVOLUCIONES DETALLE
  // =========================

  // GET /devoluciones-detalle?id_devolucion=...
  async listarDetalles(params: DevolucionesDetalleQuery): Promise<DevolucionDetalle[]> {
    const qs = buildDevolucionesDetalleQuery(params);
    const { data } = await httpClient.get<DevolucionDetalle[]>(
      `/devoluciones-detalle${qs}`,
    );
    return Array.isArray(data) ? data : [];
  },

  // GET /devoluciones-detalle/{id_devolucion_detalle}
  async obtenerDetalle(
    id_devolucion_detalle: number,
  ): Promise<DevolucionDetalleDetail> {
    const { data } = await httpClient.get<DevolucionDetalleDetail>(
      `/devoluciones-detalle/${id_devolucion_detalle}`,
    );
    return data;
  },
};