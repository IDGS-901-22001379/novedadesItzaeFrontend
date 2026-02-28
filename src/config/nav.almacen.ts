// src/config/nav.almacen.ts
import { Boxes, ShoppingCart, ArrowLeftRight } from "lucide-react";
import type { NavItem } from "./nav.types";

export const NAV_ALMACEN: NavItem[] = [
  { label: "Inventario", path: "/almacen", icon: Boxes },
  { label: "Compras", path: "/almacen/compras", icon: ShoppingCart },
  { label: "Traspasos", path: "/almacen/traspasos", icon: ArrowLeftRight },
];