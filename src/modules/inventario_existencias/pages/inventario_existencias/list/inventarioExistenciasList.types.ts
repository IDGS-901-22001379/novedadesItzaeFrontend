import type { ExistenciaItem } from "../../../types/inventarioExistencias.types";

export type LoadState = "idle" | "loading" | "success" | "error";

export type ProductoListItem = {
  id_producto: number;
  nombre?: string | null;
  sku?: string | null;
  codigo_barras?: string | null;
  modelo?: string | null;
  imagen_ruta?: string | null;
  activo?: boolean;
};

export type SucursalApiItem = {
  id_sucursal: number;
  nombre: string;
};

export type ExistenciaRow = ExistenciaItem & {
  producto_nombre?: string | null;
  producto_sku?: string | null;
  producto_codigo_barras?: string | null;
  producto_modelo?: string | null;
  producto_imagen_ruta?: string | null;

  sucursal_nombre?: string | null;
  ubicacion_nombre?: string | null;
  ubicacion_tipo?: string | null;
};