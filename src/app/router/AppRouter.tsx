import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "../guards/RequireAuth";
import RequireRole from "../guards/RequireRole";
import AppShell from "../layout/AppShell";

import NoAutorizado from "../../shared/components/NoAutorizado";
import EnConstruccion from "../../shared/components/EnConstruccion";

import DashboardPage from "../../modules/dashboard/pages/dashboard/DashboardPage";
import VentasPage from "../../modules/ventas/pages/ventas/VentasPage";

import LoginPage from "../../modules/auth/pages/auth/LoginPage";

import UsuariosList from "../../modules/usuarios/pages/usuarios/UsuariosList";
import EmpleadosList from "../../modules/empleados/pages/empleados/EmpleadosList";

import ClientesList from "../../modules/clientes/pages/clientes/ClientesList";
import ClientesFiscalesList from "../../modules/clientes_fiscales/pages/clientes/ClientesFiscalesList";
import Clientes_tiposList from "../../modules/Clientes_tipos/pages/clientes_tipos/Clientes_tiposList";

import ProductosList from "../../modules/productos/pages/productos/ProductosList";
import ProveedoresList from "../../modules/proveedores/pages/proveedores/ProveedoresList";
import Proveedores_productosList from "../../modules/proveedores_productos/pages/proveedores_productos/Proveedores_productosList";

import Inventario_sucursalesList from "../../modules/inventario_sucursales/pages/inventario_sucursales/Inventario_sucursalesList";
import InventarioUbicacionesList from "../../modules/inventario_ubicaciones/pages/inventario_ubicaciones/InventarioUbicacionesList";
import InventarioExistenciasList from "../../modules/inventario_existencias/pages/inventario_existencias/InventarioExistenciasList";
import Movimientos_inventarioList from "../../modules/movimientos_inventario/pages/movimientos_inventario/Movimientos_inventarioList";
import Movimientos_inventarioDetail from "../../modules/movimientos_inventario/pages/movimientos_inventario/Movimientos_inventarioDetail";
import TraspasosList from "../../modules/traspasos/pages/traspasos/TraspasosList";
import ComprasList from "../../modules/compras/pages/compras/ComprasList";

import HomeRedirect from "./HomeRedirect";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* Protected */}
        <Route element={<RequireAuth />}>
          {/* Layout con Sidebar/Topbar */}
          <Route element={<AppShell />}>
            {/* Root default: redirige según rol */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Ruta base admin */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            {/* Ruta base almacen */}
            <Route
              path="/almacen"
              element={<Navigate to="/almacen/compras" replace />}
            />

            {/* Ruta base inventario almacen */}
            <Route
              path="/almacen/inventario"
              element={<Navigate to="/almacen/inventario/sucursales" replace />}
            />

            {/* ADMIN (rutas reales + placeholders) */}
            <Route element={<RequireRole allow={["ADMIN"]} />}>
              {/* Reales */}
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/ventas" element={<VentasPage />} />

              {/* Usuarios */}
              <Route path="/admin/usuarios" element={<UsuariosList />} />

              {/* Empleados */}
              <Route path="/admin/empleados" element={<EmpleadosList />} />

              {/* Clientes comerciales */}
              <Route path="/admin/clientes" element={<ClientesList />} />

              {/* Clientes fiscales */}
              <Route
                path="/admin/clientes-fiscales"
                element={<ClientesFiscalesList />}
              />

              {/* Clientes tipos */}
              <Route
                path="/admin/clientes-tipos"
                element={<Clientes_tiposList />}
              />

              {/* Productos */}
              <Route path="/admin/productos" element={<ProductosList />} />

              {/* Proveedores */}
              <Route path="/admin/proveedores" element={<ProveedoresList />} />

              {/* Proveedores - Productos */}
              <Route
                path="/admin/proveedores-productos"
                element={<Proveedores_productosList />}
              />

              {/* Compras */}
              <Route path="/admin/compras" element={<ComprasList />} />

              {/* Inventario - Sucursales */}
              <Route
                path="/admin/inventario/sucursales"
                element={<Inventario_sucursalesList />}
              />

              {/* Inventario - Ubicaciones */}
              <Route
                path="/admin/inventario/ubicaciones"
                element={<InventarioUbicacionesList />}
              />

              {/* Inventario - Existencias */}
              <Route
                path="/admin/inventario/existencias"
                element={<InventarioExistenciasList />}
              />

              {/* Inventario - Movimientos */}
              <Route
                path="/admin/inventario/movimientos"
                element={<Movimientos_inventarioList />}
              />

              {/* Inventario - Movimientos Detail */}
              <Route
                path="/admin/inventario/movimientos/:id_movimiento"
                element={<Movimientos_inventarioDetail />}
              />

              {/* Traspasos */}
              <Route path="/admin/traspasos" element={<TraspasosList />} />

              {/* Placeholders */}
              <Route
                path="/admin/caja"
                element={<EnConstruccion titulo="Caja" />}
              />
              <Route
                path="/admin/facturacion"
                element={<EnConstruccion titulo="Facturación CFDI" />}
              />
              <Route
                path="/admin/catalogos"
                element={<EnConstruccion titulo="Catálogos base" />}
              />
              <Route
                path="/admin/reportes-ventas"
                element={<EnConstruccion titulo="Reportes de ventas" />}
              />
              <Route
                path="/admin/reportes-inventario"
                element={<EnConstruccion titulo="Reportes de inventario" />}
              />
              <Route
                path="/admin/devoluciones"
                element={
                  <EnConstruccion titulo="Devoluciones / Cancelaciones" />
                }
              />
              <Route
                path="/admin/cortes-caja"
                element={<EnConstruccion titulo="Cortes de caja" />}
              />
              <Route
                path="/admin/creditos"
                element={<EnConstruccion titulo="Créditos / Cobranza" />}
              />
            </Route>

            {/* VENTAS (rutas reales + placeholders) */}
            <Route element={<RequireRole allow={["VENTAS"]} />}>
              <Route path="/ventas/*" element={<VentasPage />} />
              <Route
                path="/ventas/caja"
                element={<EnConstruccion titulo="Caja (Ventas)" />}
              />
              <Route
                path="/ventas/devoluciones"
                element={<EnConstruccion titulo="Devoluciones (Ventas)" />}
              />
            </Route>

            {/* ALMACEN (rutas reales + placeholders) */}
            <Route element={<RequireRole allow={["ALMACEN"]} />}>
              {/* Compras */}
              <Route path="/almacen/compras" element={<ComprasList />} />

              {/* Inventario */}
              <Route
                path="/almacen/inventario/sucursales"
                element={<Inventario_sucursalesList />}
              />
              <Route
                path="/almacen/inventario/ubicaciones"
                element={<InventarioUbicacionesList />}
              />
              <Route
                path="/almacen/inventario/existencias"
                element={<InventarioExistenciasList />}
              />
              <Route
                path="/almacen/inventario/movimientos"
                element={<Movimientos_inventarioList />}
              />
              <Route
                path="/almacen/inventario/movimientos/:id_movimiento"
                element={<Movimientos_inventarioDetail />}
              />

              {/* Traspasos */}
              <Route path="/almacen/traspasos" element={<TraspasosList />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
