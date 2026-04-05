// src/modules/devoluciones_cancelaciones/services/devoluciones_ubicaciones.service.ts
// Service auxiliar de sucursales y ubicaciones para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Obtener sucursales activas.
// - Obtener ubicaciones activas por sucursal.
// - Separar ubicaciones tipo TIENDA y BODEGA.
// - Exponer opciones listas para usar en formularios de devoluciones.
//
// Reglas de negocio:
// - Solo se consideran sucursales activas.
// - Solo se consideran ubicaciones activas.
// - "REGRESA_TIENDA" devuelve únicamente ubicaciones tipo tienda.
// - "ENVIA_BODEGA" y "MERMA" devuelven únicamente ubicaciones tipo bodega.

import { httpClient } from "../../../services/http/httpClient";
import type { DevolucionDisposicion } from "../types/devoluciones_cancelaciones.types";

type SucursalApiItem = {
  id_sucursal: number;
  nombre?: string | null;
  estatus?: string | null;
};

type UbicacionApiItem = {
  id_ubicacion: number;
  id_sucursal: number;
  nombre?: string | null;
  descripcion?: string | null;
  tipo?: string | null;
  tipo_ubicacion?: string | null;
  estatus?: string | null;
};

export type DevolucionSucursalOption = {
  id_sucursal: number;
  nombre: string;
  label: string;
};

export type DevolucionUbicacionOption = {
  id_ubicacion: number;
  id_sucursal: number;
  sucursal_nombre: string;
  nombre: string;
  tipo: "TIENDA" | "BODEGA" | "OTRO";
  label: string;
};

function normalizeText(value?: string | null): string {
  return (value ?? "").trim();
}

function normalizeUpper(value?: string | null): string {
  return normalizeText(value).toUpperCase();
}

function isSucursalActiva(item: SucursalApiItem): boolean {
  const estatus = normalizeUpper(item.estatus);
  if (!estatus) return true;
  return estatus === "ACTIVO";
}

function isUbicacionActiva(item: UbicacionApiItem): boolean {
  const estatus = normalizeUpper(item.estatus);
  if (!estatus) return true;
  return estatus === "ACTIVO";
}

function detectUbicacionTipo(item: UbicacionApiItem): "TIENDA" | "BODEGA" | "OTRO" {
  const tipo = normalizeUpper(item.tipo);
  const tipoUbicacion = normalizeUpper(item.tipo_ubicacion);
  const nombre = normalizeUpper(item.nombre);
  const descripcion = normalizeUpper(item.descripcion);

  const joined = [tipo, tipoUbicacion, nombre, descripcion].join(" ");

  if (joined.includes("TIENDA")) return "TIENDA";
  if (joined.includes("BODEGA")) return "BODEGA";

  return "OTRO";
}

function buildSucursalLabel(item: SucursalApiItem): string {
  return normalizeText(item.nombre) || `Sucursal #${item.id_sucursal}`;
}

function buildUbicacionLabel(
  sucursalNombre: string,
  ubicacionNombre: string,
  tipo: "TIENDA" | "BODEGA" | "OTRO",
): string {
  const nombreFinal = ubicacionNombre || tipo;
  return `${sucursalNombre} - ${nombreFinal}`;
}

async function listarSucursalesActivasApi(): Promise<SucursalApiItem[]> {
  const { data } = await httpClient.get<SucursalApiItem[]>(
    `/inventario/sucursales?solo_activos=true`,
  );

  return (Array.isArray(data) ? data : []).filter(isSucursalActiva);
}

async function listarUbicacionesActivasPorSucursalApi(
  id_sucursal: number,
): Promise<UbicacionApiItem[]> {
  const { data } = await httpClient.get<UbicacionApiItem[]>(
    `/inventario/ubicaciones?id_sucursal=${id_sucursal}&solo_activos=true`,
  );

  return (Array.isArray(data) ? data : []).filter(isUbicacionActiva);
}

export const devolucionesUbicacionesService = {
  async listarSucursalesActivas(): Promise<DevolucionSucursalOption[]> {
    const sucursales = await listarSucursalesActivasApi();

    return sucursales.map((item) => {
      const nombre = buildSucursalLabel(item);

      return {
        id_sucursal: item.id_sucursal,
        nombre,
        label: nombre,
      };
    });
  },

  async listarTiendasActivas(): Promise<DevolucionUbicacionOption[]> {
    const sucursales = await listarSucursalesActivasApi();
    const result: DevolucionUbicacionOption[] = [];

    for (const sucursal of sucursales) {
      const sucursalNombre = buildSucursalLabel(sucursal);
      const ubicaciones = await listarUbicacionesActivasPorSucursalApi(
        sucursal.id_sucursal,
      );

      for (const ubicacion of ubicaciones) {
        const tipo = detectUbicacionTipo(ubicacion);
        if (tipo !== "TIENDA") continue;

        const nombre = normalizeText(ubicacion.nombre) || "TIENDA";

        result.push({
          id_ubicacion: ubicacion.id_ubicacion,
          id_sucursal: ubicacion.id_sucursal,
          sucursal_nombre: sucursalNombre,
          nombre,
          tipo,
          label: buildUbicacionLabel(sucursalNombre, nombre, tipo),
        });
      }
    }

    return result;
  },

  async listarBodegasActivas(): Promise<DevolucionUbicacionOption[]> {
    const sucursales = await listarSucursalesActivasApi();
    const result: DevolucionUbicacionOption[] = [];

    for (const sucursal of sucursales) {
      const sucursalNombre = buildSucursalLabel(sucursal);
      const ubicaciones = await listarUbicacionesActivasPorSucursalApi(
        sucursal.id_sucursal,
      );

      for (const ubicacion of ubicaciones) {
        const tipo = detectUbicacionTipo(ubicacion);
        if (tipo !== "BODEGA") continue;

        const nombre = normalizeText(ubicacion.nombre) || "BODEGA";

        result.push({
          id_ubicacion: ubicacion.id_ubicacion,
          id_sucursal: ubicacion.id_sucursal,
          sucursal_nombre: sucursalNombre,
          nombre,
          tipo,
          label: buildUbicacionLabel(sucursalNombre, nombre, tipo),
        });
      }
    }

    return result;
  },

  async listarUbicacionesPorDisposicion(
    disposicion: DevolucionDisposicion,
  ): Promise<DevolucionUbicacionOption[]> {
    if (disposicion === "REGRESA_TIENDA") {
      return this.listarTiendasActivas();
    }

    return this.listarBodegasActivas();
  },
};