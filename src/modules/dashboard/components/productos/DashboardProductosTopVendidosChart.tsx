// src/modules/dashboard/components/productos/DashboardProductosTopVendidosChart.tsx
// Gráfica Top de productos más vendidos del dashboard.
// Responsabilidades:
// - mostrar barras verticales del top de productos vendidos
// - usar el filtro global Top N
// - usar el periodo global (día, semana, mes)
// - aplicar colores distintos por producto
// - aplicar ruptura visual de escala cuando un producto supera demasiado a los demás
// - mostrar tooltip con cantidad real vendida
// - conectar con los services reales

import { useEffect, useMemo, useState } from "react";
import { Package } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardTheme } from "../../theme/dashboardTheme";
import type { DashboardGlobalFiltersState } from "../../types/shared/dashboard_filters.types";
import type { DashboardProductosTopChartItem } from "../../types/productos/dashboard_productos_top_chart.types";
import { processTopChartItems } from "../../utils/dashboardProductosTopChart.utils";
import { dashboardProductosVendidosDiarioService } from "../../services/productos/dashboard_productos_vendidos_diario.service";
import { dashboardProductosVendidosMensualService } from "../../services/productos/dashboard_productos_vendidos_mensual.service";

type Props = {
  theme: DashboardTheme;
  filters: DashboardGlobalFiltersState;
};

function isDarkTheme(theme: DashboardTheme): boolean {
  return theme.headerBg.includes("slate-950");
}

function parseISODate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

export default function DashboardProductosTopVendidosChart({
  theme,
  filters,
}: Props) {
  const dark = isDarkTheme(theme);

  const [rawItems, setRawItems] = useState<DashboardProductosTopChartItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function cargarTopProductos() {
      try {
        setLoading(true);
        setError("");

        const fechaBase = filters.fechaHasta;
        const limit = filters.topN;

        if (filters.periodo === "dia") {
          const items =
            await dashboardProductosVendidosDiarioService.obtenerPorFecha({
              fecha: fechaBase,
              limit,
            });

          const mapped: DashboardProductosTopChartItem[] = items
            .map((item) => ({
              id_producto: item.id_producto,
              producto_nombre: item.producto_nombre,
              cantidad_vendida: Number(item.cantidad_vendida) || 0,
              importe_vendido: Number(item.importe_vendido) || 0,
            }))
            .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
            .slice(0, limit);

          if (!mounted) return;
          setRawItems(mapped);
          return;
        }

        if (filters.periodo === "semana") {
          const items =
            await dashboardProductosVendidosDiarioService.obtenerSemanaActual({
              fecha_base: fechaBase,
              limit,
            });

          const grouped = new Map<number, DashboardProductosTopChartItem>();

          items.forEach((item) => {
            const current = grouped.get(item.id_producto);

            if (!current) {
              grouped.set(item.id_producto, {
                id_producto: item.id_producto,
                producto_nombre: item.producto_nombre,
                cantidad_vendida: Number(item.cantidad_vendida) || 0,
                importe_vendido: Number(item.importe_vendido) || 0,
              });
              return;
            }

            current.cantidad_vendida += Number(item.cantidad_vendida) || 0;
            current.importe_vendido =
              (current.importe_vendido || 0) +
              (Number(item.importe_vendido) || 0);
          });

          const mapped = [...grouped.values()]
            .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
            .slice(0, limit);

          if (!mounted) return;
          setRawItems(mapped);
          return;
        }

        const baseDate = parseISODate(fechaBase);

        const items =
          await dashboardProductosVendidosMensualService.obtenerPorAnioMes({
            anio: baseDate.getFullYear(),
            mes: baseDate.getMonth() + 1,
            limit,
          });

        const mapped: DashboardProductosTopChartItem[] = items
          .map((item) => ({
            id_producto: item.id_producto,
            producto_nombre: item.producto_nombre,
            cantidad_vendida: Number(item.cantidad_vendida) || 0,
            importe_vendido: Number(item.importe_vendido) || 0,
          }))
          .sort((a, b) => b.cantidad_vendida - a.cantidad_vendida)
          .slice(0, limit);

        if (!mounted) return;
        setRawItems(mapped);
      } catch (err) {
        console.error("Error al cargar top de productos vendidos:", err);
        if (!mounted) return;
        setError("No se pudo cargar el top de productos.");
        setRawItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    cargarTopProductos();

    return () => {
      mounted = false;
    };
  }, [filters.fechaHasta, filters.periodo, filters.topN]);

  const processed = useMemo(() => processTopChartItems(rawItems), [rawItems]);

  const data = processed.items.map((item) => ({
    id_producto: item.id_producto,
    producto_nombre: item.producto_nombre,
    producto_nombre_corto: item.producto_nombre_corto,
    cantidad_vendida_real: item.cantidad_vendida_real,
    cantidad_vendida_visual: item.cantidad_vendida_visual,
    color: item.color,
  }));

  const visualMax = Math.max(
    ...processed.items.map((item) => item.cantidad_vendida_visual),
    0,
  );

  const titleClass = dark ? "text-white" : "text-slate-900";
  const subtitleClass = dark ? "text-white/70" : "text-slate-500";
  const cardClass = dark
    ? "border-white/15 bg-slate-950"
    : "border-slate-200 bg-white";

  const yTicks = processed.scale_break.enabled
    ? [
        0,
        processed.scale_break.break_start * 0.25,
        processed.scale_break.break_start * 0.5,
        processed.scale_break.break_start * 0.75,
        processed.scale_break.break_start,
        visualMax,
      ]
    : undefined;

  function formatYAxisTick(value: number): string {
    if (!processed.scale_break.enabled) {
      return Number(value).toLocaleString("es-MX");
    }

    const breakStart = processed.scale_break.break_start;

    if (value === visualMax) {
      return Number(processed.scale_break.max_value).toLocaleString("es-MX");
    }

    if (value === breakStart) {
      return Number(breakStart).toLocaleString("es-MX");
    }

    if (value < breakStart) {
      return Number(Math.round(value)).toLocaleString("es-MX");
    }

    return "";
  }

  return (
    <section
      className={["rounded-2xl border p-4 shadow-sm", cardClass].join(" ")}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Package
              className={
                dark ? "h-5 w-5 text-emerald-400" : "h-5 w-5 text-emerald-600"
              }
            />
            <h3 className={["text-base font-extrabold", titleClass].join(" ")}>
              Top Productos (Unidades)
            </h3>
          </div>

          <p className={["mt-1 text-xs font-medium", subtitleClass].join(" ")}>
            {loading
              ? "Cargando top de productos..."
              : error ||
                `Top ${filters.topN} productos más vendidos por unidades.`}
          </p>
        </div>
      </div>

      <div className="h-[165px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              width={52}
              tickMargin={8}
              domain={[0, visualMax]}
              ticks={yTicks}
              tickFormatter={formatYAxisTick}
              tick={{
                fill: dark ? "rgba(255,255,255,0.72)" : "#94a3b8",
                fontSize: 10,
                fontWeight: 700,
              }}
            />

            {processed.scale_break.enabled && (
              <ReferenceLine
                y={processed.scale_break.break_start}
                stroke={dark ? "rgba(255,255,255,0.28)" : "#94a3b8"}
                strokeDasharray="3 3"
              />
            )}

            <Tooltip
              formatter={(value, _name, payload) => {
                const item = payload?.payload;
                return [
                  `${Number(item?.cantidad_vendida_real ?? value).toLocaleString("es-MX")} unidades`,
                  item?.producto_nombre ?? "Producto",
                ];
              }}
              labelFormatter={(_label, payload) =>
                payload?.[0]?.payload?.producto_nombre ?? ""
              }
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
              dataKey="cantidad_vendida_visual"
              radius={[10, 10, 0, 0]}
              isAnimationActive
              animationDuration={1000}
              animationEasing="ease-out"
            >
              <LabelList
                dataKey="cantidad_vendida_real"
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

              {data.map((entry) => (
                <Cell key={entry.id_producto} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
