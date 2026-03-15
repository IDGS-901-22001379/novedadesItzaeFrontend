// src/modules/inventario_existencias/pages/inventario_existencias/list/inventarioExistenciasList.catalogs.ts

import {
  inventarioExistenciasUbicacionesService,
  type InventarioExistenciasUbicacion as InventarioUbicacion,
} from "../../../services/inventarioExistenciasUbicaciones.service";
import { inventarioSucursalesService } from "../../../../inventario_sucursales/services";

import type {
  SucursalOption,
} from "../../../components/inventario_existencias/InventarioExistenciasFilters";

import {
  normalizeSucursalesResponse,
  sortSucursales,
  sortUbicaciones,
} from "./inventarioExistenciasList.utils";

type CargarCatalogosResult = {
  sucursales: SucursalOption[];
  ubicaciones: InventarioUbicacion[];
};

export async function cargarCatalogosExistencias(): Promise<CargarCatalogosResult> {
  const [sucursalesRaw, ubicacionesRaw] = await Promise.all([
    inventarioSucursalesService.listar({ solo_activos: false }),
    inventarioExistenciasUbicacionesService.listar({
      solo_activos: false,
    }),
  ]);

  const sucursalesNormalizadas = normalizeSucursalesResponse(sucursalesRaw);

  // Solo sucursales activas
  const sucursalesActivas = sucursalesNormalizadas.filter((s) => {
    const row = s as {
      activo?: boolean | null;
      estatus?: string | null;
    };

    if (typeof row.activo === "boolean") {
      return row.activo === true;
    }

    if (typeof row.estatus === "string") {
      return row.estatus.toUpperCase() === "ACTIVO";
    }

    return true;
  });

  const idsSucursalesActivas = new Set(
    sucursalesActivas.map((s) => s.id_sucursal),
  );

  const sucursales = sortSucursales(
    sucursalesActivas.map((s) => ({
      id: s.id_sucursal,
      nombre: s.nombre,
    })),
  );

  // Solo ubicaciones activas cuya sucursal también esté activa
  const ubicaciones = sortUbicaciones(
    (Array.isArray(ubicacionesRaw) ? ubicacionesRaw : []).filter((u) => {
      const row = u as {
        activo?: boolean | null;
        estatus?: string | null;
        id_sucursal: number;
      };

      const ubicacionActiva =
        typeof row.activo === "boolean"
          ? row.activo === true
          : typeof row.estatus === "string"
            ? row.estatus.toUpperCase() === "ACTIVO"
            : true;

      return ubicacionActiva && idsSucursalesActivas.has(row.id_sucursal);
    }),
  );

  return { sucursales, ubicaciones };
}