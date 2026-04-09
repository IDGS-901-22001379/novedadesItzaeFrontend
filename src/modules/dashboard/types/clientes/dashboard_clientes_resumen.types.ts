// src/modules/dashboard/types/clientes/dashboard_clientes_resumen.types.ts
// Types del dashboard de clientes.
// Responsabilidades:
// - definir el modelo de resumen comercial de clientes
// - definir los filtros para búsqueda rápida
// - definir los filtros para top de clientes

export type DashboardClientesResumenItem = {
  id_cliente: number;
  numero_cliente: string;
  cliente_nombre: string;
  tipo_cliente: string;
  numero_compras: number;
  total_comprado: string;
  ultima_compra: string;
  promedio_compra: string;
};

export type DashboardClientesResumenBuscarQuery = {
  q: string;
  limit?: number;
  offset?: number;
};

export type DashboardClientesResumenTopQuery = {
  limit?: number;
};