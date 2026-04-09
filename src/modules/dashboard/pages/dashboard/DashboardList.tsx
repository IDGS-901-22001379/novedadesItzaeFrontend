// src/modules/dashboard/pages/dashboard/DashboardList.tsx
// Vista principal del dashboard.
// Responsabilidades:
// - mantener el estado global de filtros del dashboard
// - aplicar el tema visual del dashboard
// - renderizar encabezado y filtros en una sola barra
// - renderizar secciones principales del dashboard
// - integrar ventas y productos sin cargar demasiado la página

import { useMemo, useState } from "react";
import DashboardGlobalFilters from "../../components/filtros/DashboardGlobalFilters";
import DashboardVentasSection from "../../components/ventas/DashboardVentasSection";
import DashboardProductosSection from "../../components/productos/DashboardProductosSection";
import { useDashboardTheme } from "../../theme/useDashboardTheme";
import type { DashboardGlobalFiltersState } from "../../types/shared/dashboard_filters.types";

function getTodayLocalISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFirstDayOfCurrentMonthLocalISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

export default function DashboardList() {
  const theme = useDashboardTheme();

  const initialFilters = useMemo<DashboardGlobalFiltersState>(
    () => ({
      fechaDesde: getFirstDayOfCurrentMonthLocalISODate(),
      fechaHasta: getTodayLocalISODate(),
      topN: 10,
      periodo: "dia",
      mostrarMontos: true,
    }),
    [],
  );

  const [filters, setFilters] =
    useState<DashboardGlobalFiltersState>(initialFilters);

  return (
    <div className="space-y-5">
      <section
        className={[
          "rounded-3xl p-4 shadow-sm",
          theme.headerBg,
          theme.headerText,
        ].join(" ")}
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
          <div className="pt-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Dashboard general
            </h1>
            <p className="mt-1 text-sm font-semibold opacity-90">
              Visualiza ventas, productos, clientes, vendedores, pagos, créditos
              y alertas desde un solo lugar.
            </p>
          </div>

          <div className="xl:min-w-[760px]">
            <DashboardGlobalFilters
              theme={theme}
              value={filters}
              onChange={setFilters}
            />
          </div>
        </div>
      </section>

      <DashboardVentasSection theme={theme} filters={filters} />

      <DashboardProductosSection theme={theme} filters={filters} />
    </div>
  );
}
