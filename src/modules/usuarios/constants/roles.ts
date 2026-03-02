// src/modules/usuarios/constants/roles.ts
// Catálogo de roles por id_rol.
// Responsabilidades: mapear id_rol a nombre y exponer opciones para selects.

export type RolOption = { id: number; label: string };

export const ROLES: RolOption[] = [
  { id: 1, label: "Administrador" },
  { id: 2, label: "Vendedor" },
  { id: 3, label: "Almacenista" },
  { id: 4, label: "Cajero" },
  { id: 5, label: "Supervisor" },
  { id: 6, label: "Gerente" },
  { id: 7, label: "Facturación" },
  { id: 8, label: "Compras" },
  { id: 9, label: "Auditoría" },
  { id: 10, label: "Soporte" },
];

export function rolLabelById(id_rol: number): string {
  return ROLES.find((r) => r.id === id_rol)?.label ?? `Rol #${id_rol}`;
}