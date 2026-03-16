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
  Settings,
  ShieldCheck,
  Link2,
  Building2,
  MapPinned,
  Archive,
  ScrollText,
} from "lucide-react";

/*
  NAV_ADMIN define el menú para el rol Admin.
  "Clientes" se convierte en un submenú con comerciales, fiscales y tipos.
  "Proveedores" se convierte en submenú con catálogo y relación proveedor-producto.
  "Inventario" se convierte en submenú con sucursales, ubicaciones, existencias y movimientos.
*/
export const NAV_ADMIN: NavItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },

  { label: "Usuarios", path: "/admin/usuarios", icon: UserCog },
  { label: "Empleados", path: "/admin/empleados", icon: Users },

  {
    label: "Clientes",
    path: "/admin/clientes",
    icon: UserRound,
    children: [
      { label: "Clientes comerciales", path: "/admin/clientes", icon: Users },
      {
        label: "Clientes fiscales",
        path: "/admin/clientes-fiscales",
        icon: FileText,
      },
      {
        label: "Clientes tipos",
        path: "/admin/clientes-tipos",
        icon: Settings,
      },
    ],
  },

  {
    label: "Proveedores",
    path: "/admin/proveedores",
    icon: Truck,
    children: [
      { label: "Proveedores", path: "/admin/proveedores", icon: Truck },
      {
        label: "Proveedor - Productos",
        path: "/admin/proveedores-productos",
        icon: Link2,
      },
    ],
  },

  { label: "Productos", path: "/admin/productos", icon: Package },

  {
    label: "Inventario",
    path: "/admin/inventario",
    icon: Boxes,
    children: [
      {
        label: "Sucursales",
        path: "/admin/inventario/sucursales",
        icon: Building2,
      },
      {
        label: "Ubicaciones",
        path: "/admin/inventario/ubicaciones",
        icon: MapPinned,
      },
      {
        label: "Existencias",
        path: "/admin/inventario/existencias",
        icon: Archive,
      },
      {
        label: "Movimientos",
        path: "/admin/inventario/movimientos",
        icon: ScrollText,
      },
    ],
  },

  { label: "Traspasos (Bodegas)", path: "/admin/traspasos", icon: ArrowLeftRight },

  { label: "Compras", path: "/admin/compras", icon: ShoppingCart },
  { label: "Ventas", path: "/admin/ventas", icon: Receipt },

  { label: "Caja", path: "/admin/caja", icon: Wallet },
  { label: "Cortes de caja", path: "/admin/cortes-caja", icon: BadgeDollarSign },

  { label: "Devoluciones", path: "/admin/devoluciones", icon: Undo2 },

  { label: "Créditos y cobranza", path: "/admin/creditos", icon: BadgeDollarSign },

  { label: "Facturación CFDI", path: "/admin/facturacion", icon: FileText },

  { label: "Reportes ventas", path: "/admin/reportes-ventas", icon: BarChart3 },
  { label: "Reportes inventario", path: "/admin/reportes-inventario", icon: BarChart3 },

  { label: "Auditoría / Bitácora", path: "/admin/auditoria", icon: ShieldCheck },
  { label: "Configuración", path: "/admin/configuracion", icon: Settings },
];
