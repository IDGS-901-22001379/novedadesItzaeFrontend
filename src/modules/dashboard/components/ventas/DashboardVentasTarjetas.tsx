// src/modules/dashboard/components/ventas/DashboardVentasTarjetas.tsx
// Tarjetas KPI de ventas del dashboard.
// Responsabilidades:
// - renderizar las tarjetas superiores de ventas
// - conectar las cards con los services reales
// - mostrar montos según el estado global de visibilidad
// - adaptar colores al tema activo
// - usar iconos reales grandes
// - mantener tarjetas compactas en altura
// - pintar hover suave según el tema seleccionado

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  DollarSign,
  HandCoins,
  CalendarRange,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import type { DashboardTheme } from "../../theme/dashboardTheme";
import type { DashboardGlobalFiltersState } from "../../types/shared/dashboard_filters.types";
import { dashboardVentasTarjetasDiaService } from "../../services/ventas/dashboard_ventas_tarjetas_dia.service";
import { dashboardVentasDiariasService } from "../../services/ventas/dashboard_ventas_diarias.service";
import { dashboardVentasMensualesService } from "../../services/ventas/dashboard_ventas_mensuales.service";
import { dashboardVentasMovimientosCajaDiaService } from "../../services/ventas/dashboard_ventas_movimientos_caja_dia.service";
import type { DashboardVentasTarjetasDiaItem } from "../../types/ventas/dashboard_ventas_tarjetas_dia.types";
import type { DashboardVentasMovimientosCajaDiaItem } from "../../types/ventas/dashboard_ventas_movimientos_caja_dia.types";
import type { DashboardVentasDiariasItem } from "../../types/ventas/dashboard_ventas_diarias.types";
import type { DashboardVentasMensualesItem } from "../../types/ventas/dashboard_ventas_mensuales.types";

type Props = {
  theme: DashboardTheme;
  filters: DashboardGlobalFiltersState;
};

type VentaCardItem = {
  title: string;
  value: string;
  hint?: string;
  Icon: ComponentType<{ className?: string }>;
  iconWrapClass: string;
  iconClass: string;
};

type DashboardVentasResumenState = {
  tarjetaDia: DashboardVentasTarjetasDiaItem | null;
  movimientosDia: DashboardVentasMovimientosCajaDiaItem | null;
  semanaActual: DashboardVentasDiariasItem[];
  mesActual: DashboardVentasMensualesItem[];
  anioActual: DashboardVentasMensualesItem[];
};

function formatMoney(value: string, mostrarMontos: boolean): string {
  if (!mostrarMontos) return "••••••";
  return value;
}

function isDarkTheme(theme: DashboardTheme): boolean {
  return theme.headerBg.includes("slate-950");
}

function getHoverCardClass(theme: DashboardTheme): string {
  if (theme.headerBg.includes("#2F6FED")) return "hover:bg-[#eef5ff]";
  if (theme.headerBg.includes("#22C55E")) return "hover:bg-[#efffed]";
  if (theme.headerBg.includes("#C026D3")) return "hover:bg-[#fcf0ff]";
  if (theme.headerBg.includes("slate-950")) return "hover:bg-slate-900";
  return "hover:bg-slate-50";
}

function toMoney(raw?: string | null): string {
  return `$${raw ?? "0.00"}`;
}

function toNumber(raw?: string | number | null): number {
  if (raw === null || raw === undefined) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function sumTotalVendidoDiario(items: DashboardVentasDiariasItem[]): string {
  const total = items.reduce(
    (acc, item) => acc + toNumber(item.total_vendido),
    0,
  );
  return total.toFixed(2);
}

function sumTotalVendidoMensual(items: DashboardVentasMensualesItem[]): string {
  const total = items.reduce(
    (acc, item) => acc + toNumber(item.total_vendido),
    0,
  );
  return total.toFixed(2);
}

function sumTicketsMensual(items: DashboardVentasMensualesItem[]): number {
  return items.reduce((acc, item) => acc + (item.tickets ?? 0), 0);
}

function getCurrentYearMonth() {
  const now = new Date();
  return {
    anio: now.getFullYear(),
    mes: now.getMonth() + 1,
  };
}

export default function DashboardVentasTarjetas({ theme, filters }: Props) {
  const dark = isDarkTheme(theme);

  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState<DashboardVentasResumenState>({
    tarjetaDia: null,
    movimientosDia: null,
    semanaActual: [],
    mesActual: [],
    anioActual: [],
  });

  const currentYearMonth = useMemo(() => getCurrentYearMonth(), []);

  useEffect(() => {
    let mounted = true;

    async function cargarResumenVentas() {
      try {
        setLoading(true);

        const [
          tarjetaDia,
          movimientosDia,
          semanaActual,
          mesActual,
          anioActual,
        ] = await Promise.all([
          dashboardVentasTarjetasDiaService.obtenerPrincipal(),
          dashboardVentasMovimientosCajaDiaService.obtenerPrincipal(),
          dashboardVentasDiariasService.obtenerSemanaActual(),
          dashboardVentasMensualesService.obtenerPorAnioMes({
            anio: currentYearMonth.anio,
            mes: currentYearMonth.mes,
          }),
          dashboardVentasMensualesService.listarPorAnio({
            anio: currentYearMonth.anio,
          }),
        ]);

        if (!mounted) return;

        setResumen({
          tarjetaDia,
          movimientosDia,
          semanaActual,
          mesActual,
          anioActual,
        });
      } catch (error) {
        console.error(
          "Error al cargar resumen de ventas del dashboard:",
          error,
        );
        if (!mounted) return;

        setResumen({
          tarjetaDia: null,
          movimientosDia: null,
          semanaActual: [],
          mesActual: [],
          anioActual: [],
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    cargarResumenVentas();

    return () => {
      mounted = false;
    };
  }, [currentYearMonth.anio, currentYearMonth.mes]);

  const cards: VentaCardItem[] = [
    {
      title: "Ventas HOY",
      value: loading ? "Cargando..." : toMoney(resumen.tarjetaDia?.ventas_dia),
      hint: loading
        ? "Consultando ventas del día"
        : `Tickets: ${resumen.tarjetaDia?.tickets_dia ?? 0}`,
      Icon: DollarSign,
      iconWrapClass: "bg-green-100",
      iconClass: "text-green-500",
    },
    {
      title: "Semana actual",
      value: loading
        ? "Cargando..."
        : toMoney(sumTotalVendidoDiario(resumen.semanaActual)),
      hint: loading
        ? "Consultando semana actual"
        : `Últimos ${resumen.semanaActual.length || 0} días`,
      Icon: HandCoins,
      iconWrapClass: "bg-emerald-100",
      iconClass: "text-emerald-600",
    },
    {
      title: "Mes actual",
      value: loading
        ? "Cargando..."
        : toMoney(sumTotalVendidoMensual(resumen.mesActual)),
      hint: loading ? "Consultando mes actual" : "Resumen mensual",
      Icon: CalendarRange,
      iconWrapClass: "bg-slate-100",
      iconClass: "text-red-500",
    },
    {
      title: "Año actual",
      value: loading
        ? "Cargando..."
        : toMoney(sumTotalVendidoMensual(resumen.anioActual)),
      hint: loading
        ? "Consultando año actual"
        : `Tickets: ${sumTicketsMensual(resumen.anioActual)}`,
      Icon: TrendingUp,
      iconWrapClass: "bg-sky-100",
      iconClass: "text-sky-600",
    },
    {
      title: "Movimientos salidas de efectivo",
      value: loading
        ? "Cargando..."
        : toMoney(resumen.movimientosDia?.total_salidas_dia),
      hint: loading ? "Consultando salidas" : "Salidas registradas",
      Icon: TrendingDown,
      iconWrapClass: "bg-red-100",
      iconClass: "text-red-500",
    },
  ];

  const hoverCardClass = getHoverCardClass(theme);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ title, value, hint, Icon, iconWrapClass, iconClass }) => (
        <article
          key={title}
          className={[
            "overflow-hidden rounded-2xl border shadow-sm transition",
            dark ? "border-white/20 bg-slate-950" : "border-slate-200 bg-white",
            hoverCardClass,
          ].join(" ")}
        >
          <div className={`h-2 w-full ${theme.headerBg}`} />

          <div className="flex items-start justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <div
                className={
                  dark
                    ? "text-sm font-extrabold text-white/80"
                    : "text-sm font-extrabold text-slate-600"
                }
              >
                {title}
              </div>

              <div
                className={
                  dark
                    ? "mt-1.5 text-3xl font-extrabold tracking-tight text-white"
                    : "mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900"
                }
              >
                {formatMoney(value, filters.mostrarMontos)}
              </div>

              {hint && (
                <div
                  className={
                    dark
                      ? "mt-1 text-sm font-semibold text-white/70"
                      : "mt-1 text-sm font-semibold text-slate-500"
                  }
                >
                  {loading && !filters.mostrarMontos
                    ? "Información oculta"
                    : hint}
                </div>
              )}
            </div>

            <div
              className={[
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                iconWrapClass,
              ].join(" ")}
            >
              <Icon className={["h-8 w-8", iconClass].join(" ")} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
