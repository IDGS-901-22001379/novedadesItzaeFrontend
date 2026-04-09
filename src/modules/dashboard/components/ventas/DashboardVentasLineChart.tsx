// src/modules/dashboard/components/ventas/DashboardVentasLineChart.tsx
// Gráfica principal de ventas del dashboard.
// Responsabilidades:
// - mostrar una gráfica de línea/área para ventas
// - permitir cambiar entre 7 días, 15 días, 30 días, 6 meses y 1 año
// - conectar la gráfica con los services reales del dashboard
// - adaptar colores según el tema activo
// - animar la línea al cargar
// - transformar los datos del backend al formato esperado por Recharts

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardTheme } from "../../theme/dashboardTheme";
import type { DashboardGlobalFiltersState } from "../../types/shared/dashboard_filters.types";
import type { DashboardChartRange } from "../../types/shared/dashboard_chart_range.types";
import { DASHBOARD_CHART_RANGE_OPTIONS } from "../../types/shared/dashboard_chart_range.types";
import { dashboardVentasDiariasService } from "../../services/ventas/dashboard_ventas_diarias.service";
import { dashboardVentasMensualesService } from "../../services/ventas/dashboard_ventas_mensuales.service";
import type { DashboardVentasDiariasItem } from "../../types/ventas/dashboard_ventas_diarias.types";
import type { DashboardVentasMensualesItem } from "../../types/ventas/dashboard_ventas_mensuales.types";

type Props = {
  theme: DashboardTheme;
  filters: DashboardGlobalFiltersState;
};

type ChartPoint = {
  label: string;
  total: number;
};

function isDarkTheme(theme: DashboardTheme): boolean {
  return theme.headerBg.includes("slate-950");
}

function getChartColor(theme: DashboardTheme): string {
  if (theme.headerBg.includes("#2F6FED")) return "#2F6FED";
  if (theme.headerBg.includes("#22C55E")) return "#22C55E";
  if (theme.headerBg.includes("#C026D3")) return "#C026D3";
  if (theme.headerBg.includes("slate-950")) return "#60A5FA";
  return "#22C55E";
}

function getChartFill(theme: DashboardTheme): string {
  if (theme.headerBg.includes("#2F6FED")) return "#93C5FD";
  if (theme.headerBg.includes("#22C55E")) return "#86EFAC";
  if (theme.headerBg.includes("#C026D3")) return "#E879F9";
  if (theme.headerBg.includes("slate-950")) return "#93C5FD";
  return "#BBF7D0";
}

function toNumber(value?: string | number | null): number {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function parseISODate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getWeekdayShort(dateStr: string): string {
  const date = parseISODate(dateStr);
  const label = new Intl.DateTimeFormat("es-MX", { weekday: "short" }).format(
    date,
  );
  return label.charAt(0).toUpperCase() + label.slice(1).replace(".", "");
}

function getDayMonthShort(dateStr: string): string {
  const date = parseISODate(dateStr);
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

function getMonthShort(anio: number, mes: number): string {
  const date = new Date(anio, mes - 1, 1);
  const label = new Intl.DateTimeFormat("es-MX", { month: "short" }).format(
    date,
  );
  return label.charAt(0).toUpperCase() + label.slice(1).replace(".", "");
}

function buildDailySeries(
  startDate: Date,
  endDate: Date,
  items: DashboardVentasDiariasItem[],
  labelMode: "weekday" | "date",
): ChartPoint[] {
  const map = new Map<string, number>();

  items.forEach((item) => {
    map.set(item.fecha, toNumber(item.total_vendido));
  });

  const points: ChartPoint[] = [];
  let cursor = new Date(startDate);

  while (cursor <= endDate) {
    const iso = toISODate(cursor);
    points.push({
      label:
        labelMode === "weekday" ? getWeekdayShort(iso) : getDayMonthShort(iso),
      total: map.get(iso) ?? 0,
    });
    cursor = addDays(cursor, 1);
  }

  return points;
}

function buildMonthlySeries(
  startMonthDate: Date,
  endMonthDate: Date,
  items: DashboardVentasMensualesItem[],
): ChartPoint[] {
  const map = new Map<string, number>();

  items.forEach((item) => {
    const key = `${item.anio}-${String(item.mes).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + toNumber(item.total_vendido));
  });

  const points: ChartPoint[] = [];
  let cursor = new Date(
    startMonthDate.getFullYear(),
    startMonthDate.getMonth(),
    1,
  );
  const end = new Date(endMonthDate.getFullYear(), endMonthDate.getMonth(), 1);

  while (cursor <= end) {
    const anio = cursor.getFullYear();
    const mes = cursor.getMonth() + 1;
    const key = `${anio}-${String(mes).padStart(2, "0")}`;

    points.push({
      label: getMonthShort(anio, mes),
      total: map.get(key) ?? 0,
    });

    cursor = addMonths(cursor, 1);
  }

  return points;
}

function getRangeTitle(range: DashboardChartRange): string {
  if (range === "7d") return "Últimos 7 días";
  if (range === "15d") return "Últimos 15 días";
  if (range === "30d") return "Últimos 30 días";
  if (range === "6m") return "Últimos 6 meses";
  return "Últimos 12 meses";
}

export default function DashboardVentasLineChart({ theme, filters }: Props) {
  const [range, setRange] = useState<DashboardChartRange>("7d");
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chartColor = useMemo(() => getChartColor(theme), [theme]);
  const chartFill = useMemo(() => getChartFill(theme), [theme]);
  const dark = isDarkTheme(theme);

  const titleClass = dark ? "text-white" : "text-slate-900";
  const subtitleClass = dark ? "text-white/70" : "text-slate-500";
  const cardClass = dark
    ? "border-white/15 bg-slate-950"
    : "border-slate-200 bg-white";

  useEffect(() => {
    let mounted = true;

    async function cargarGrafica() {
      try {
        setLoading(true);
        setError("");

        const fechaBase = filters.fechaHasta || toISODate(new Date());
        const endDate = parseISODate(fechaBase);

        if (range === "7d") {
          const items = await dashboardVentasDiariasService.obtenerSemanaActual(
            {
              fecha_base: fechaBase,
            },
          );

          const startDate = addDays(endDate, -6);
          const series = buildDailySeries(startDate, endDate, items, "weekday");

          if (!mounted) return;
          setData(series);
          return;
        }

        if (range === "15d") {
          const startDate = addDays(endDate, -14);
          const items = await dashboardVentasDiariasService.listar({
            fecha_inicio: toISODate(startDate),
            fecha_fin: toISODate(endDate),
          });

          const series = buildDailySeries(startDate, endDate, items, "date");

          if (!mounted) return;
          setData(series);
          return;
        }

        if (range === "30d") {
          const startDate = addDays(endDate, -29);
          const items = await dashboardVentasDiariasService.listar({
            fecha_inicio: toISODate(startDate),
            fecha_fin: toISODate(endDate),
          });

          const series = buildDailySeries(startDate, endDate, items, "date");

          if (!mounted) return;
          setData(series);
          return;
        }

        if (range === "6m") {
          const endMonthDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            1,
          );
          const startMonthDate = addMonths(endMonthDate, -5);

          const items = await dashboardVentasMensualesService.listarPorRango({
            anio_inicio: startMonthDate.getFullYear(),
            mes_inicio: startMonthDate.getMonth() + 1,
            anio_fin: endMonthDate.getFullYear(),
            mes_fin: endMonthDate.getMonth() + 1,
          });

          const series = buildMonthlySeries(
            startMonthDate,
            endMonthDate,
            items,
          );

          if (!mounted) return;
          setData(series);
          return;
        }

        const endMonthDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          1,
        );
        const startMonthDate = addMonths(endMonthDate, -11);

        const items = await dashboardVentasMensualesService.listarPorRango({
          anio_inicio: startMonthDate.getFullYear(),
          mes_inicio: startMonthDate.getMonth() + 1,
          anio_fin: endMonthDate.getFullYear(),
          mes_fin: endMonthDate.getMonth() + 1,
        });

        const series = buildMonthlySeries(startMonthDate, endMonthDate, items);

        if (!mounted) return;
        setData(series);
      } catch (err) {
        console.error("Error al cargar gráfica de ventas:", err);
        if (!mounted) return;
        setError("No se pudo cargar la gráfica.");
        setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    cargarGrafica();

    return () => {
      mounted = false;
    };
  }, [range, filters.fechaHasta]);

  return (
    <section
      className={["rounded-2xl border p-4 shadow-sm", cardClass].join(" ")}
    >
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className={["text-base font-extrabold", titleClass].join(" ")}>
            Ventas por periodo
          </h3>
          <p className={["text-xs font-medium", subtitleClass].join(" ")}>
            {loading
              ? "Cargando datos del servidor..."
              : error || getRangeTitle(range)}
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as DashboardChartRange)}
          className={[
            "rounded-xl border px-3 py-2 text-sm font-bold outline-none transition",
            dark
              ? "border-white/15 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-900",
          ].join(" ")}
        >
          {DASHBOARD_CHART_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 6, right: 8, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="ventasAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={chartFill} stopOpacity={0.35} />
                <stop offset="100%" stopColor={chartFill} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke={dark ? "rgba(255,255,255,0.08)" : "#e5e7eb"}
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: dark ? "rgba(255,255,255,0.70)" : "#64748b",
                fontSize: 11,
                fontWeight: 700,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: dark ? "rgba(255,255,255,0.70)" : "#94a3b8",
                fontSize: 11,
                fontWeight: 700,
              }}
              width={42}
            />

            <Tooltip
              formatter={(value) => [formatMoney(Number(value)), "Ventas"]}
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
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke={chartColor}
              strokeWidth={3}
              fill="url(#ventasAreaGradient)"
              dot={{ r: 0 }}
              activeDot={{
                r: 6,
                stroke: chartColor,
                strokeWidth: 3,
                fill: "#ffffff",
              }}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
