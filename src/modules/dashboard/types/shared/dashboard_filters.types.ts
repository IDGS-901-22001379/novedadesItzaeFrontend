// src/modules/dashboard/types/shared/dashboard_filters.types.ts
// Types compartidos del dashboard.
// Responsabilidades:
// - definir el estado global de filtros del dashboard
// - definir el tipo de periodo rápido
// - definir props reutilizables para componentes que consumen filtros globales

export type DashboardPeriodo = "dia" | "semana" | "mes";

export type DashboardGlobalFiltersState = {
  fechaDesde: string;
  fechaHasta: string;
  topN: number;
  periodo: DashboardPeriodo;
  mostrarMontos: boolean;
  idSucursal?: number;
};

export type DashboardGlobalFiltersProps = {
  value: DashboardGlobalFiltersState;
  onChange: (next: DashboardGlobalFiltersState) => void;
};