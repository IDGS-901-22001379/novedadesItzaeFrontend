// src/modules/dashboard/utils/dashboardProductosAlertas.utils.ts
// Utilidades para alertas y análisis de productos del dashboard.
// Responsabilidades:
// - transformar productos de alta rotación y sin stock a formato de gráfica
// - transformar productos de sobrestock y baja rotación a formato de gráfica
// - calcular predicción de agotamiento con base en promedio diario
// - clasificar productos por nivel de alerta
// - ordenar y recortar listas según top solicitado

import type {
  DashboardProductoAlertaChartItem,
  DashboardProductoPrediccionAgotamientoItem,
  DashboardProductoPrediccionListItem,
} from "../types/productos/dashboard_productos_alertas.types";
import type {
  DashboardProductosAltaRotacionSinStockItem,
  DashboardProductosSobrestockBajaRotacionItem,
} from "../types/productos/dashboard_productos_rotacion_alertas.types";

function toNumber(value: number | string | null | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function truncateProductoNombre(nombre: string, maxLength = 22): string {
  const safe = String(nombre ?? "").trim();
  if (safe.length <= maxLength) return safe;
  return `${safe.slice(0, maxLength - 3)}...`;
}

export function mapStockBajoAltaRotacionToChart(
  items: DashboardProductosAltaRotacionSinStockItem[],
  topN: number
): DashboardProductoAlertaChartItem[] {
  return [...items]
    .sort(
      (a, b) =>
        toNumber(b.cantidad_vendida_90_dias) - toNumber(a.cantidad_vendida_90_dias)
    )
    .slice(0, Math.max(1, topN))
    .map((item) => ({
      id_producto: item.id_producto,
      producto_nombre: truncateProductoNombre(item.producto_nombre),
      cantidad: toNumber(item.cantidad_vendida_90_dias),
    }));
}

export function mapSobrestockBajaRotacionToChart(
  items: DashboardProductosSobrestockBajaRotacionItem[],
  topN: number
): DashboardProductoAlertaChartItem[] {
  return [...items]
    .sort((a, b) => toNumber(b.stock_total) - toNumber(a.stock_total))
    .slice(0, Math.max(1, topN))
    .map((item) => ({
      id_producto: item.id_producto,
      producto_nombre: truncateProductoNombre(item.producto_nombre),
      cantidad: toNumber(item.stock_total),
    }));
}

export function calcularPromedioDiario(
  cantidadVendidaPeriodo: number,
  diasPeriodo: number
): number {
  if (diasPeriodo <= 0) return 0;
  return toNumber(cantidadVendidaPeriodo) / diasPeriodo;
}

export function calcularDiasEstimadosAgotamiento(
  stockActual: number,
  promedioDiario: number
): number | null {
  const stock = toNumber(stockActual);
  const promedio = toNumber(promedioDiario);

  if (stock <= 0) return 0;
  if (promedio <= 0) return null;

  return Math.ceil(stock / promedio);
}

export function clasificarEstadoAgotamiento(
  diasEstimadosAgotamiento: number | null
): "critico" | "medio" | "estable" {
  if (diasEstimadosAgotamiento === null) return "estable";
  if (diasEstimadosAgotamiento <= 15) return "critico";
  if (diasEstimadosAgotamiento <= 30) return "medio";
  return "estable";
}

export function buildPrediccionAgotamiento(
  items: DashboardProductosAltaRotacionSinStockItem[],
  limit = 20
): DashboardProductoPrediccionAgotamientoItem[] {
  return items
    .map((item) => {
      const stockActual = toNumber(item.stock_total);
      const cantidadVendidaPeriodo = toNumber(item.cantidad_vendida_90_dias);
      const diasPeriodo = 90;
      const promedioDiario = calcularPromedioDiario(
        cantidadVendidaPeriodo,
        diasPeriodo
      );
      const diasEstimadosAgotamiento = calcularDiasEstimadosAgotamiento(
        stockActual,
        promedioDiario
      );

      return {
        id_producto: item.id_producto,
        producto_nombre: item.producto_nombre,
        sku: item.sku,
        stock_actual: stockActual,
        cantidad_vendida_periodo: cantidadVendidaPeriodo,
        dias_periodo: diasPeriodo,
        promedio_diario: Number(promedioDiario.toFixed(2)),
        dias_estimados_agotamiento: diasEstimadosAgotamiento,
        estado_alerta: clasificarEstadoAgotamiento(diasEstimadosAgotamiento),
      };
    })
    .sort((a, b) => {
      const aDias = a.dias_estimados_agotamiento ?? Number.POSITIVE_INFINITY;
      const bDias = b.dias_estimados_agotamiento ?? Number.POSITIVE_INFINITY;
      return aDias - bDias;
    })
    .slice(0, Math.max(1, limit));
}

export function mapPrediccionToList(
  items: DashboardProductoPrediccionAgotamientoItem[]
): DashboardProductoPrediccionListItem[] {
  return items.map((item) => ({
    id_producto: item.id_producto,
    producto_nombre: item.producto_nombre,
    stock_actual: item.stock_actual,
    promedio_diario: item.promedio_diario,
    dias_estimados_agotamiento: item.dias_estimados_agotamiento,
    estado_alerta: item.estado_alerta,
  }));
}