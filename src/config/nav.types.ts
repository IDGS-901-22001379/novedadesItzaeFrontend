// src/config/nav.types.ts
import type { LucideIcon } from "lucide-react";

/*
  NavItem representa una opción del menú lateral.
  Si un item incluye "children", se renderiza como un submenú desplegable.
*/
export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
};