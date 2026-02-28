// src/config/nav.ventas.ts
import { Receipt, Wallet, Undo2 } from "lucide-react";
import type { NavItem } from "./nav.types";

export const NAV_VENTAS: NavItem[] = [
  { label: "Ventas", path: "/ventas", icon: Receipt },
  { label: "Caja", path: "/ventas/caja", icon: Wallet },
  { label: "Devoluciones", path: "/ventas/devoluciones", icon: Undo2 },
];