// src/config/nav.almacen.ts
import type { NavItem } from "./nav.types";
import {
  Boxes,
  ShoppingCart,
  ArrowLeftRight,
  Building2,
  MapPinned,
  Archive,
} from "lucide-react";

/*
  NAV_ALMACEN define el menú para el rol Almacén.
  "Inventario" se convierte en un submenú con sucursales, ubicaciones y existencias.
*/
export const NAV_ALMACEN: NavItem[] = [
  {
    label: "Inventario",
    path: "/almacen/inventario",
    icon: Boxes,
    children: [
      {
        label: "Sucursales",
        path: "/almacen/inventario/sucursales",
        icon: Building2,
      },
      {
        label: "Ubicaciones",
        path: "/almacen/inventario/ubicaciones",
        icon: MapPinned,
      },
      {
        label: "Existencias",
        path: "/almacen/inventario/existencias",
        icon: Archive,
      },
    ],
  },

  { label: "Compras", path: "/almacen/compras", icon: ShoppingCart },
  { label: "Traspasos", path: "/almacen/traspasos", icon: ArrowLeftRight },
];