// src/config/nav.admin.ts

import type { NavItem } from "./nav.types";
import {
  LayoutDashboard,
  UserCog,
  Users,
  UserRound,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  Receipt,
  Wallet,
  ArrowLeftRight,
  Undo2,
  BadgeDollarSign,
  BarChart3,
  FileText,
  ClipboardList,
  Settings,
  ShieldCheck,
  ScrollText,
} from "lucide-react";

export const NAV_ADMIN: NavItem[] = [
  // General
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },

  // Seguridad / Usuarios
  { label: "Usuarios", path: "/admin/usuarios", icon: UserCog },
  { label: "Empleados", path: "/admin/empleados", icon: Users },

  // Catálogos base
  { label: "Catálogos base", path: "/admin/catalogos", icon: ClipboardList },

  // Operación comercial
  { label: "Clientes", path: "/admin/clientes", icon: UserRound },
  { label: "Proveedores", path: "/admin/proveedores", icon: Truck },
  { label: "Productos", path: "/admin/productos", icon: Package },

  // Inventarios
  { label: "Inventario", path: "/admin/inventario", icon: Boxes },
  { label: "Movimientos", path: "/admin/movimientos-inventario", icon: ScrollText },
  { label: "Traspasos (Bodegas)", path: "/admin/traspasos", icon: ArrowLeftRight },

  // Compras / Ventas
  { label: "Compras", path: "/admin/compras", icon: ShoppingCart },
  { label: "Ventas", path: "/admin/ventas", icon: Receipt },

  // Caja
  { label: "Caja", path: "/admin/caja", icon: Wallet },
  { label: "Cortes de caja", path: "/admin/cortes-caja", icon: BadgeDollarSign },

  // Devoluciones / Cancelaciones
  { label: "Devoluciones", path: "/admin/devoluciones", icon: Undo2 },

  // Créditos / Cobranza
  { label: "Créditos y cobranza", path: "/admin/creditos", icon: BadgeDollarSign },

  // Facturación CFDI
  { label: "Facturación CFDI", path: "/admin/facturacion", icon: FileText },

  // Reportes
  { label: "Reportes ventas", path: "/admin/reportes-ventas", icon: BarChart3 },
  { label: "Reportes inventario", path: "/admin/reportes-inventario", icon: BarChart3 },

  // Auditoría / Config
  { label: "Auditoría / Bitácora", path: "/admin/auditoria", icon: ShieldCheck },
  { label: "Configuración", path: "/admin/configuracion", icon: Settings },
];