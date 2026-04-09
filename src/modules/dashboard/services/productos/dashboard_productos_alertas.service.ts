// src/modules/dashboard/services/productos/dashboard_productos_alertas.service.ts

import { dashboardProductosRotacionAlertasService } from "./dashboard_productos_rotacion_alertas.service";

import type {
  DashboardProductosAltaRotacionSinStockItem,
  DashboardProductosSobrestockBajaRotacionItem,
} from "../../types/productos/dashboard_productos_rotacion_alertas.types";

type Query = {
  limit?: number;
};

export const dashboardProductosAlertasService = {
  //  STOCK BAJO + ALTA ROTACIÓN
  async getStockBajoAltaRotacion(
    params?: Query
  ): Promise<DashboardProductosAltaRotacionSinStockItem[]> {
    return dashboardProductosRotacionAlertasService.listarTopAltaRotacionSinStock({
      limit: params?.limit,
    });
  },

  //  SOBRESTOCK + BAJA ROTACIÓN
  async getSobrestockBajaRotacion(
    params?: Query
  ): Promise<DashboardProductosSobrestockBajaRotacionItem[]> {
    return dashboardProductosRotacionAlertasService.listarTopSobrestockBajaRotacion({
      limit: params?.limit,
    });
  },

  // PREDICCIÓN → reutiliza alta rotación
  async getPrediccionAgotamiento(
    params?: Query
  ): Promise<DashboardProductosAltaRotacionSinStockItem[]> {
    return dashboardProductosRotacionAlertasService.listarTopAltaRotacionSinStock({
      limit: params?.limit,
    });
  },
};