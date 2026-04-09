// src/modules/dashboard/components/productos/DashboardProductosSection.tsx
// Sección de productos del dashboard.
// Responsabilidades:
// - recibir los filtros globales del dashboard
// - mostrar en una sola fila las 3 vistas de productos
// - renderizar:
//   1) stock bajo y alta rotación
//   2) sobrestock y baja rotación
//   3) predicción de agotamiento
// - mantener la sección organizada para integrarse con el dashboard principal

import type { DashboardTheme } from "../../theme/dashboardTheme";
import type { DashboardGlobalFiltersState } from "../../types/shared/dashboard_filters.types";
import DashboardProductosStockBajoAltaRotacionChart from "./DashboardProductosStockBajoAltaRotacionChart";
import DashboardProductosSobrestockBajaRotacionChart from "./DashboardProductosSobrestockBajaRotacionChart";
import DashboardProductosAgotamientoList from "./DashboardProductosAgotamientoList";

type Props = {
  theme: DashboardTheme;
  filters: DashboardGlobalFiltersState;
};

export default function DashboardProductosSection({ theme, filters }: Props) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-3 xl:grid-cols-2">
        <DashboardProductosStockBajoAltaRotacionChart
          theme={theme}
          filters={filters}
        />

        <DashboardProductosSobrestockBajaRotacionChart
          theme={theme}
          filters={filters}
        />

        <DashboardProductosAgotamientoList theme={theme} filters={filters} />
      </div>
    </section>
  );
}
