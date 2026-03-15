// src/modules/inventario_existencias/pages/inventario_existencias/list/inventarioExistenciasList.actions.ts

import { inventarioExistenciasService } from "../../../services/inventarioExistencias.service";

import type {
  ExistenciaDetalle,
  ExistenciaItem,
} from "../../../types/inventarioExistencias.types";

import type { ExistenciaRow } from "./inventarioExistenciasList.types";
import { buildSyntheticDetalle } from "./inventarioExistenciasList.utils";

type OpenDetalleParams = {
  item: ExistenciaItem | ExistenciaRow;
  ubicacionMap: Map<number, {
    id_ubicacion: number;
    id_sucursal: number;
    nombre: string;
    tipo: string;
    codigo: string;
  }>;
  sucursalMap: Map<number, string>;
};

export async function resolveDetalleExistencia({
  item,
  ubicacionMap,
  sucursalMap,
}: OpenDetalleParams): Promise<ExistenciaDetalle> {
  const hasRealId =
    item.id_existencia != null && Number(item.id_existencia) > 0;

  if (!hasRealId) {
    return buildSyntheticDetalle(item as ExistenciaRow);
  }

  const detalle = await inventarioExistenciasService.obtener(
    item.id_existencia as number,
  );

  const ubicacionCatalogo = ubicacionMap.get(detalle.id_ubicacion);
  const idSucursal =
    ubicacionCatalogo?.id_sucursal ?? detalle.ubicacion?.id_sucursal ?? 0;

  const sucursalNombre =
    sucursalMap.get(idSucursal) ??
    detalle.ubicacion?.sucursal_nombre ??
    "Sucursal no disponible";

  return {
    ...detalle,
    id_existencia: detalle.id_existencia ?? null,
    creado_en: detalle.creado_en ?? null,
    actualizado_en: detalle.actualizado_en ?? null,
    es_existencia_real: detalle.es_existencia_real ?? true,
    ubicacion: detalle.ubicacion
      ? {
          ...detalle.ubicacion,
          id_sucursal: idSucursal,
          nombre: ubicacionCatalogo?.nombre ?? detalle.ubicacion?.nombre ?? "-",
          tipo: ubicacionCatalogo?.tipo ?? detalle.ubicacion?.tipo ?? "",
          codigo: ubicacionCatalogo?.codigo ?? detalle.ubicacion?.codigo ?? "",
          sucursal_nombre: sucursalNombre,
        }
      : undefined,
  };
}