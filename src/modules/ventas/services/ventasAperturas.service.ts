// src/modules/ventas/services/ventasAperturas.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type { VentaAperturaOption } from "../types";

type CajaApiItem = {
  id_caja: number;
  id_sucursal: number;
  nombre: string;
  codigo: string;
  activo: boolean;
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

type AbrirAperturaPayload = {
  id_caja: number;
  monto_inicial: number;
};

export type VentaCajaOption = {
  id_caja: number;
  id_sucursal: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  label: string;
};

function safeTrim(value?: string | null): string {
  return value?.trim() ?? "";
}

function toCajaOption(item: CajaApiItem): VentaCajaOption {
  return {
    id_caja: item.id_caja,
    id_sucursal: item.id_sucursal,
    nombre: item.nombre,
    codigo: item.codigo,
    activo: item.activo,
    label: `${item.nombre} • ${item.codigo}`,
  };
}

function toVentaAperturaOption(
  apertura: AperturaApiItem,
  cajaNombre?: string | null,
  cajaCodigo?: string | null,
): VentaAperturaOption {
  const nombreCaja = safeTrim(cajaNombre);
  const codigoCaja = safeTrim(cajaCodigo);

  return {
    id_apertura: apertura.id_apertura,
    id_usuario: apertura.id_usuario ?? null,
    nombre_usuario: null,
    fecha_apertura: apertura.fecha_hora_apertura ?? null,
    apertura_label:
      nombreCaja || codigoCaja
        ? `${nombreCaja || "Caja"}${codigoCaja ? ` • ${codigoCaja}` : ""}`
        : `Apertura #${apertura.id_apertura}`,
  };
}

export const ventasAperturasService = {
  // Caja principal fija para el flujo actual de ventas.
  getCajaPrincipalDefault(): VentaCajaOption {
    return {
      id_caja: 1,
      id_sucursal: 1,
      nombre: "CAJA PRINCIPAL",
      codigo: "CAJA01",
      activo: true,
      label: "CAJA PRINCIPAL • CAJA01",
    };
  },

  async listarCajas(params?: {
    solo_activos?: boolean;
  }): Promise<VentaCajaOption[]> {
    const soloActivos = params?.solo_activos ?? true;

    const { data } = await httpClient.get<CajaApiItem[]>(
      `/caja/cajas?solo_activos=${soloActivos}`,
    );

    return (Array.isArray(data) ? data : []).map(toCajaOption);
  },

  async obtenerCajaPorId(id_caja: number): Promise<VentaCajaOption | null> {
    if (!id_caja || id_caja <= 0) return null;

    const { data } = await httpClient.get<CajaApiItem>(`/caja/cajas/${id_caja}`);

    if (!data) return null;

    return toCajaOption(data);
  },

  async obtenerCajaPrincipal(): Promise<VentaCajaOption | null> {
    try {
      const caja = await this.obtenerCajaPorId(1);
      if (caja) return caja;
    } catch {
      // si falla, intenta por listado
    }

    try {
      const cajas = await this.listarCajas({ solo_activos: true });

      const exacta =
        cajas.find((caja) => caja.id_caja === 1) ??
        cajas.find(
          (caja) =>
            caja.id_sucursal === 1 &&
            safeTrim(caja.nombre).toUpperCase() === "CAJA PRINCIPAL",
        ) ??
        null;

      return exacta ?? this.getCajaPrincipalDefault();
    } catch {
      return this.getCajaPrincipalDefault();
    }
  },

  async obtenerAperturaAbiertaPorCaja(
    id_caja: number,
  ): Promise<VentaAperturaOption | null> {
    if (!id_caja || id_caja <= 0) return null;

    try {
      const [aperturaRes, caja] = await Promise.all([
        httpClient.get<AperturaApiItem>(`/caja/aperturas/caja/${id_caja}/abierta`),
        this.obtenerCajaPorId(id_caja),
      ]);

      const apertura = aperturaRes.data;
      if (!apertura) return null;

      return toVentaAperturaOption(
        apertura,
        caja?.nombre ?? null,
        caja?.codigo ?? null,
      );
    } catch {
      return null;
    }
  },

  // Para el formulario de ventas, la apertura activa por defecto
  // será la abierta en la CAJA PRINCIPAL.
  async listarAperturasActivas(): Promise<VentaAperturaOption[]> {
    const cajaPrincipal = await this.obtenerCajaPrincipal();
    const idCaja = cajaPrincipal?.id_caja ?? 1;

    const apertura = await this.obtenerAperturaAbiertaPorCaja(idCaja);

    return apertura ? [apertura] : [];
  },

  async abrirAperturaCajaPrincipal(
    monto_inicial: number,
  ): Promise<VentaAperturaOption | null> {
    const cajaPrincipal = await this.obtenerCajaPrincipal();
    const idCaja = cajaPrincipal?.id_caja ?? 1;

    const { data } = await httpClient.post<AperturaApiItem>(
      `/caja/aperturas/abrir`,
      {
        id_caja: idCaja,
        monto_inicial: Number(monto_inicial),
      } satisfies AbrirAperturaPayload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!data) return null;

    return toVentaAperturaOption(
      data,
      cajaPrincipal?.nombre ?? "CAJA PRINCIPAL",
      cajaPrincipal?.codigo ?? "CAJA01",
    );
  },

  async abrirApertura(params: {
    id_caja: number;
    monto_inicial: number;
  }): Promise<VentaAperturaOption | null> {
    const caja = await this.obtenerCajaPorId(params.id_caja);

    const { data } = await httpClient.post<AperturaApiItem>(
      `/caja/aperturas/abrir`,
      {
        id_caja: Number(params.id_caja),
        monto_inicial: Number(params.monto_inicial),
      } satisfies AbrirAperturaPayload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!data) return null;

    return toVentaAperturaOption(
      data,
      caja?.nombre ?? null,
      caja?.codigo ?? null,
    );
  },

  async cajaPrincipalEstaAbierta(): Promise<boolean> {
    const apertura = await this.obtenerAperturaAbiertaPorCaja(1);
    return Boolean(apertura?.id_apertura);
  },
};