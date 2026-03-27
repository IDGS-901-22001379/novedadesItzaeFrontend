// src/modules/ventas/pages/ventas/form/ventasFormAperturas/ventasFormAperturas.service.ts
// Service del flujo de aperturas para ventas.
// Responsabilidades:
// - Obtener la caja principal por defecto.
// - Consultar si la caja principal tiene apertura abierta.
// - Abrir una nueva apertura.
// - Mantener el mapeo del backend a estructuras útiles para el form.

import { httpClient } from "../../../../../../services/http/httpClient";
import { VENTAS_CAJA_DEFAULT } from "./ventasFormAperturas.constants";
import {
  buildAperturaLabel,
  buildCajaDefaultState,
  buildCajaLabel,
  isCajaAbierta,
} from "./ventasFormAperturas.utils";
import type {
  AbrirAperturaPayload,
  VentaAperturaActual,
  VentaCajaDefault,
  VentaCajaEstatus,
} from "./ventasFormAperturas.types";

type CajaApiItem = {
  id_caja: number;
  id_sucursal: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  creado_en?: string;
  actualizado_en?: string;
};

type AperturaApiItem = {
  id_apertura: number;
  id_caja: number;
  id_usuario: number;
  fecha_hora_apertura: string;
  monto_inicial?: string | number | null;
  estatus: "ABIERTA" | "CERRADA" | string;
  fecha_hora_cierre?: string | null;
  creado_en?: string | null;
  actualizado_en?: string | null;
};

function buildCajasQuery(params?: { solo_activos?: boolean }): string {
  const sp = new URLSearchParams();

  if (params?.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function normalizeAperturaEstatus(value?: string | null): VentaCajaEstatus {
  return String(value ?? "").trim().toUpperCase() === "ABIERTA"
    ? "ABIERTA"
    : "CERRADA";
}

function toCajaDefault(item: CajaApiItem): VentaCajaDefault {
  return buildCajaDefaultState({
    id_caja: item.id_caja,
    id_sucursal: item.id_sucursal,
    nombre: item.nombre,
    codigo: item.codigo,
    activo: item.activo,
    label: buildCajaLabel({
      nombre: item.nombre,
      codigo: item.codigo,
    }),
  });
}

function toAperturaActual(
  item: AperturaApiItem,
  caja?: VentaCajaDefault | null,
): VentaAperturaActual {
  const cajaUsada = caja ?? VENTAS_CAJA_DEFAULT;
  const estatus = normalizeAperturaEstatus(item.estatus);

  return {
    id_apertura: item.id_apertura ?? null,
    id_caja: item.id_caja ?? cajaUsada.id_caja,
    id_usuario: item.id_usuario ?? null,
    fecha_hora_apertura: item.fecha_hora_apertura ?? null,
    apertura_label: buildAperturaLabel({
      id_apertura: item.id_apertura,
      nombre_caja: cajaUsada.nombre,
      codigo_caja: cajaUsada.codigo,
    }),
    estatus: isCajaAbierta({
      id_apertura: item.id_apertura ?? null,
      estatus,
    })
      ? "ABIERTA"
      : "CERRADA",
  };
}

export const ventasFormAperturasService = {
  getCajaPrincipalDefault(): VentaCajaDefault {
    return buildCajaDefaultState(VENTAS_CAJA_DEFAULT);
  },

  async listarCajas(params?: {
    solo_activos?: boolean;
  }): Promise<VentaCajaDefault[]> {
    const qs = buildCajasQuery({
      solo_activos: params?.solo_activos ?? true,
    });

    const { data } = await httpClient.get<CajaApiItem[]>(`/caja/cajas${qs}`);

    return (Array.isArray(data) ? data : []).map(toCajaDefault);
  },

  async obtenerCajaPorId(id_caja: number): Promise<VentaCajaDefault | null> {
    if (!id_caja || id_caja <= 0) return null;

    const { data } = await httpClient.get<CajaApiItem>(`/caja/cajas/${id_caja}`);

    if (!data) return null;

    return toCajaDefault(data);
  },

  async obtenerCajaPrincipal(): Promise<VentaCajaDefault> {
    try {
      const caja = await this.obtenerCajaPorId(VENTAS_CAJA_DEFAULT.id_caja);
      if (caja) return caja;
    } catch {
      // sigue con fallback
    }

    try {
      const cajas = await this.listarCajas({ solo_activos: true });

      const cajaPrincipal =
        cajas.find((c) => c.id_caja === VENTAS_CAJA_DEFAULT.id_caja) ??
        cajas.find(
          (c) =>
            c.id_sucursal === VENTAS_CAJA_DEFAULT.id_sucursal &&
            c.nombre.trim().toUpperCase() ===
              VENTAS_CAJA_DEFAULT.nombre.trim().toUpperCase(),
        ) ??
        null;

      return cajaPrincipal ?? this.getCajaPrincipalDefault();
    } catch {
      return this.getCajaPrincipalDefault();
    }
  },

  async obtenerAperturaAbiertaPorCaja(
    id_caja: number,
  ): Promise<VentaAperturaActual | null> {
    if (!id_caja || id_caja <= 0) return null;

    try {
      const [aperturaRes, caja] = await Promise.all([
        httpClient.get<AperturaApiItem>(`/caja/aperturas/caja/${id_caja}/abierta`),
        this.obtenerCajaPorId(id_caja),
      ]);

      if (!aperturaRes.data) return null;

      return toAperturaActual(aperturaRes.data, caja);
    } catch {
      return null;
    }
  },

  async obtenerAperturaActivaCajaPrincipal(): Promise<VentaAperturaActual | null> {
    const cajaPrincipal = await this.obtenerCajaPrincipal();
    return this.obtenerAperturaAbiertaPorCaja(cajaPrincipal.id_caja);
  },

  async abrirApertura(
    payload: AbrirAperturaPayload,
  ): Promise<VentaAperturaActual | null> {
    const caja = await this.obtenerCajaPorId(payload.id_caja);

    const { data } = await httpClient.post<AperturaApiItem>(
      `/caja/aperturas/abrir`,
      {
        id_caja: Number(payload.id_caja),
        monto_inicial: Number(payload.monto_inicial),
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!data) return null;

    return toAperturaActual(data, caja);
  },

  async abrirAperturaCajaPrincipal(
    monto_inicial: number,
  ): Promise<VentaAperturaActual | null> {
    const cajaPrincipal = await this.obtenerCajaPrincipal();

    return this.abrirApertura({
      id_caja: cajaPrincipal.id_caja,
      monto_inicial,
    });
  },
};