// src/config/nav.ventas.ts
import { Receipt, Undo2 } from "lucide-react";
import type { NavItem } from "./nav.types";

export const NAV_VENTAS: NavItem[] = [
  { label: "Ventas", path: "/ventas", icon: Receipt },
  
  { label: "Devoluciones", path: "/ventas/devoluciones", icon: Undo2 },
];