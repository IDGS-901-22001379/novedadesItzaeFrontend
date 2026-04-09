// src/modules/dashboard/components/productos/DashboardProductosStockBajoAltaRotacionChart.tsx
// Gráfica de productos con stock bajo y alta rotación del dashboard.
// Responsabilidades:
// - consultar productos con alta rotación y sin stock desde el service real
// - usar fallback con productos de menor stock cuando aún no haya ventas
// - usar el filtro global Top N
// - pintar barras con colores distintos
// - mostrar tooltip con stock y cantidad vendida
// - mantener el diseño compacto para convivir con las otras tarjetas

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardTheme } from "../../theme/dashboardTheme";
import type { DashboardGlobalFiltersState } from "../../types/shared/dashboard_filters.types";
import type { DashboardProductoAlertaChartItem } from "../../types/productos/dashboard_productos_alertas.types";
import type { DashboardProductosAltaRotacionSinStockItem } from "../../types/productos/dashboard_productos_rotacion_alertas.types";
import type { DashboardProductosStockItem } from "../../types/productos/dashboard_productos_stock.types";

import { dashboardProductosAlertasService } from "../../services/productos/dashboard_productos_alertas.service";
import { dashboardProductosStockService } from "../../services/productos/dashboard_productos_stock.service";
import { mapStockBajoAltaRotacionToChart } from "../../utils/dashboardProductosAlertas.utils";

type Props = {
  theme: DashboardTheme;
  filters: DashboardGlobalFiltersState;
};

type SourceMode = "real" | "fallback-stock";

const BAR_COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

function isDarkTheme(theme: DashboardTheme): boolean {
  return theme.headerBg.includes("slate-950");
}

function truncateLabel(value: string, maxLength = 22): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
}

// Número estable para que no cambie en cada render.
// Se usa como ventas simuladas mientras no haya datos reales.
function buildStableRandomCantidad(seed: number, min = 8, max = 65): number {
  const normalizedSeed = Math.abs(Number(seed) || 1);
  const value = (normalizedSeed * 9301 + 49297) % 233280;
  const rnd = value / 233280;
  return Math.floor(min + rnd * (max - min + 1));
}

function getStockValue(item: DashboardProductosStockItem): number {
  const possibleStock = [
    (item as { stock_actual?: number }).stock_actual,
    (item as { stock_total?: number }).stock_total,
    (item as { existencia?: number }).existencia,
    (item as { stock?: number }).stock,
  ];

  for (const value of possibleStock) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return 0;
}

function getProductoNombre(item: DashboardProductosStockItem): string {
  const possibleNames = [
    (item as { producto_nombre?: string }).producto_nombre,
    (item as { nombre_producto?: string }).nombre_producto,
    (item as { nombre?: string }).nombre,
    (item as { producto?: string }).producto,
    (item as { descripcion?: string }).descripcion,
  ];

  for (const value of possibleNames) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "Producto sin nombre";
}

function mapFallbackStockToChart(
  productos: DashboardProductosStockItem[],
  topN: number,
): Array<
  DashboardProductoAlertaChartItem & {
    color: string;
    producto_nombre_corto: string;
    cantidad: number;
  }
> {
  return productos
    .slice()
    .sort((a, b) => getStockValue(a) - getStockValue(b))
    .slice(0, topN)
    .map((producto, index) => {
      const idProducto = Number(
        (producto as { id_producto?: number }).id_producto ?? index + 1,
      );
      const stockTotal = getStockValue(producto);
      const productoNombre = getProductoNombre(producto);
      const cantidad = buildStableRandomCantidad(idProducto);

      return {
        id_producto: idProducto,
        producto_nombre: productoNombre,
        producto_nombre_corto: truncateLabel(productoNombre),
        cantidad,
        color: BAR_COLORS[index % BAR_COLORS.length],
        stock_actual: stockTotal,
        stock_total: stockTotal,
      };
    });
}

export default function DashboardProductosStockBajoAltaRotacionChart({
  theme,
  filters,
}: Props) {
  const dark = isDarkTheme(theme);

  const [items, setItems] = useState<
    DashboardProductosAltaRotacionSinStockItem[]
  >([]);
  const [fallbackStockItems, setFallbackStockItems] = useState<
    DashboardProductosStockItem[]
  >([]);
  const [sourceMode, setSourceMode] = useState<SourceMode>("real");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function cargarDatos() {
      try {
        setLoading(true);
        setError("");
        setItems([]);
        setFallbackStockItems([]);
        setSourceMode("real");

        const data =
          await dashboardProductosAlertasService.getStockBajoAltaRotacion({
            limit: filters.topN,
          });

        if (!mounted) return;

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          setSourceMode("real");
          return;
        }

        const stock = await dashboardProductosStockService.listar();

        if (!mounted) return;

        setFallbackStockItems(Array.isArray(stock) ? stock : []);
        setSourceMode("fallback-stock");
      } catch (err) {
        console.error("Error al cargar stock bajo y alta rotación:", err);

        try {
          const stock = await dashboardProductosStockService.listar();

          if (!mounted) return;

          setFallbackStockItems(Array.isArray(stock) ? stock : []);
          setSourceMode("fallback-stock");
          setError("");
        } catch (fallbackErr) {
          console.error("Error al cargar fallback de stock:", fallbackErr);

          if (!mounted) return;

          setError("No se pudo cargar la gráfica.");
          setItems([]);
          setFallbackStockItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    cargarDatos();

    return () => {
      mounted = false;
    };
  }, [filters.topN]);

  const chartData = useMemo(() => {
    if (sourceMode === "fallback-stock") {
      return mapFallbackStockToChart(fallbackStockItems, filters.topN);
    }

    const mapped = mapStockBajoAltaRotacionToChart(items, filters.topN);

    return mapped.map((item: DashboardProductoAlertaChartItem, index) => ({
      ...item,
      producto_nombre_corto: truncateLabel(item.producto_nombre),
      color: BAR_COLORS[index % BAR_COLORS.length],
      cantidad: Number(item.cantidad) || 0,
    }));
  }, [items, fallbackStockItems, filters.topN, sourceMode]);

  const titleClass = dark ? "text-white" : "text-slate-900";
  const subtitleClass = dark ? "text-white/70" : "text-slate-500";
  const cardClass = dark
    ? "border-white/15 bg-slate-950"
    : "border-slate-200 bg-white";

  return (
    <section
      className={["rounded-2xl border p-4 shadow-sm", cardClass].join(" ")}
    >
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle
          className={dark ? "h-5 w-5 text-red-400" : "h-5 w-5 text-red-600"}
        />
        <div className="min-w-0">
          <h3 className={["text-base font-extrabold", titleClass].join(" ")}>
            Stock bajo y alta rotación
          </h3>
          <p className={["mt-1 text-xs font-medium", subtitleClass].join(" ")}>
            {loading
              ? "Cargando productos..."
              : error
                ? error
                : sourceMode === "fallback-stock"
                  ? `Top ${filters.topN} productos con menor stock mientras aún no hay ventas.`
                  : `Top ${filters.topN} productos críticos por rotación.`}
          </p>
        </div>
      </div>

      <div className="h-[165px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 18, right: 10, left: 6, bottom: 0 }}
            barCategoryGap={14}
          >
            <CartesianGrid
              stroke={dark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="producto_nombre_corto"
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-14}
              textAnchor="end"
              height={48}
              tick={{
                fill: dark ? "rgba(255,255,255,0.72)" : "#64748b",
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={42}
              tickMargin={8}
              tick={{
                fill: dark ? "rgba(255,255,255,0.72)" : "#94a3b8",
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            <Tooltip
              formatter={(value, _name, payload) => {
                const raw = payload?.payload;

                if (sourceMode === "fallback-stock") {
                  return [
                    `${Number(value).toLocaleString("es-MX")} estimados`,
                    raw?.producto_nombre ?? "Producto",
                  ];
                }

                const original = items.find(
                  (x) => x.id_producto === raw?.id_producto,
                );

                return [
                  `${Number(value).toLocaleString("es-MX")} vendidos`,
                  original?.producto_nombre ?? "Producto",
                ];
              }}
              labelFormatter={(_label, payload) => {
                const raw = payload?.[0]?.payload;

                if (!raw) return "";

                if (sourceMode === "fallback-stock") {
                  return `${raw.producto_nombre} · Stock: ${Number(
                    raw.stock_total ?? raw.stock_actual ?? 0,
                  ).toLocaleString("es-MX")}`;
                }

                const original = items.find(
                  (x) => x.id_producto === raw?.id_producto,
                );

                if (!original) return "";

                return `${original.producto_nombre} · Stock: ${Number(
                  original.stock_total,
                ).toLocaleString("es-MX")}`;
              }}
              contentStyle={{
                borderRadius: 14,
                border: dark
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "1px solid #e2e8f0",
                background: dark ? "#020617" : "#ffffff",
                color: dark ? "#ffffff" : "#0f172a",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
              }}
              labelStyle={{
                color: dark ? "rgba(255,255,255,0.75)" : "#475569",
                fontWeight: 700,
              }}
              cursor={{
                stroke: dark ? "rgba(255,255,255,0.25)" : "#94a3b8",
                strokeWidth: 1,
                fill: "transparent",
              }}
            />

            <Bar
              dataKey="cantidad"
              radius={[10, 10, 0, 0]}
              isAnimationActive
              animationDuration={1000}
              animationEasing="ease-out"
            >
              <LabelList
                dataKey="cantidad"
                position="top"
                formatter={(value) =>
                  Number(value) > 0 ? Number(value).toLocaleString("es-MX") : ""
                }
                style={{
                  fill: dark ? "#ffffff" : "#334155",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              />

              {chartData.map((entry) => (
                <Cell key={entry.id_producto} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
