// src/modules/dashboard/components/productos/DashboardProductosSobrestockBajaRotacionChart.tsx
// Gráfica de productos con sobrestock y baja rotación del dashboard.
// Responsabilidades:
// - consultar productos con sobrestock y baja rotación
// - usar el filtro global Top N
// - pintar barras con colores distintos
// - mostrar tooltip con stock total y ventas en 60 días
// - mantener el diseño compacto para convivir con las otras tarjetas

import { useEffect, useMemo, useState } from "react";
import { ArchiveX } from "lucide-react";
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
import type {
  DashboardProductoAlertaChartItem,
  DashboardProductoSobrestockBajaRotacionItem,
} from "../../types/productos/dashboard_productos_alertas.types";
import { dashboardProductosAlertasService } from "../../services/productos/dashboard_productos_alertas.service";
import { mapSobrestockBajaRotacionToChart } from "../../utils/dashboardProductosAlertas.utils";

type Props = {
  theme: DashboardTheme;
  filters: DashboardGlobalFiltersState;
};

const BAR_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#F97316",
  "#EAB308",
  "#84CC16",
  "#14B8A6",
];

function isDarkTheme(theme: DashboardTheme): boolean {
  return theme.headerBg.includes("slate-950");
}

function truncateLabel(value: string, maxLength = 22): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
}

export default function DashboardProductosSobrestockBajaRotacionChart({
  theme,
  filters,
}: Props) {
  const dark = isDarkTheme(theme);

  const [items, setItems] = useState<
    DashboardProductoSobrestockBajaRotacionItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function cargarDatos() {
      try {
        setLoading(true);
        setError("");

        const data =
          await dashboardProductosAlertasService.getSobrestockBajaRotacion({
            limit: filters.topN,
          });

        if (!mounted) return;
        setItems(data);
      } catch (err) {
        console.error("Error al cargar sobrestock y baja rotación:", err);
        if (!mounted) return;
        setError("No se pudo cargar la gráfica.");
        setItems([]);
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
    const mapped = mapSobrestockBajaRotacionToChart(items, filters.topN);

    return mapped.map((item: DashboardProductoAlertaChartItem, index) => ({
      ...item,
      producto_nombre_corto: truncateLabel(item.producto_nombre),
      color: BAR_COLORS[index % BAR_COLORS.length],
      cantidad: Number(item.cantidad) || 0,
    }));
  }, [items, filters.topN]);

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
        <ArchiveX
          className={
            dark ? "h-5 w-5 text-orange-400" : "h-5 w-5 text-orange-600"
          }
        />
        <div className="min-w-0">
          <h3 className={["text-base font-extrabold", titleClass].join(" ")}>
            Sobrestock y baja rotación
          </h3>
          <p className={["mt-1 text-xs font-medium", subtitleClass].join(" ")}>
            {loading
              ? "Cargando productos..."
              : error ||
                `Top ${filters.topN} productos con mayor stock y menor salida.`}
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
                const original = items.find(
                  (x) => x.id_producto === raw?.id_producto,
                );

                return [
                  `${Number(value).toLocaleString("es-MX")} en stock`,
                  original?.producto_nombre ?? "Producto",
                ];
              }}
              labelFormatter={(_label, payload) => {
                const raw = payload?.[0]?.payload;
                const original = items.find(
                  (x) => x.id_producto === raw?.id_producto,
                );
                if (!original) return "";

                return `${original.producto_nombre} · Vendidos 60 días: ${Number(
                  original.cantidad_vendida_60_dias,
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
