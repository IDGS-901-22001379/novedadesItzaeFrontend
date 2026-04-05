// src/modules/devoluciones_cancelaciones/types/devoluciones_clientes.types.ts
// Tipos auxiliares de clientes para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Definir opciones de cliente para filtros y autocompletado.
// - Definir query de búsqueda de clientes.

export interface DevolucionClienteOption {
  id_cliente: number;
  numero_cliente?: string | null;
  nombre_completo: string;
  telefono?: string | null;
  correo?: string | null;
  label: string;
}

export interface DevolucionesClientesBuscarQuery {
  q?: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
}