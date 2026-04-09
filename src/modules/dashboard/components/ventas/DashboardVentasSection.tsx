// src/modules/dashboard/components/ventas/DashboardVentasSection.tsx
// Sección de ventas del dashboard.
// Responsabilidades:
// - recibir los filtros globales del dashboard
// - renderizar el bloque principal de ventas
// - delegar las tarjetas KPI de ventas a componentes internos
// - mostrar la gráfica principal de ventas en una columna
// - mostrar la gráfica de productos más vendidos en la segunda columna
// - mantener la sección organizada para que DashboardList no crezca demasiado

import type { DashboardTheme } from "../../theme/dashboardTheme";
import type { DashboardGlobalFiltersState } from "../../types/shared/dashboard_filters.types";
import DashboardVentasTarjetas from "./DashboardVentasTarjetas";
import DashboardVentasLineChart from "./DashboardVentasLineChart";
import DashboardProductosTopVendidosChart from "../productos/DashboardProductosTopVendidosChart";

type Props = {
  theme: DashboardTheme;
  filters: DashboardGlobalFiltersState;
};

export default function DashboardVentasSection({ theme, filters }: Props) {
  return (
    <section className="space-y-5">
      <DashboardVentasTarjetas theme={theme} filters={filters} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardVentasLineChart theme={theme} filters={filters} />
        <DashboardProductosTopVendidosChart theme={theme} filters={filters} />
      </div>
    </section>
  );
}
