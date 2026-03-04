// src/app/router/AppRouter.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "../guards/RequireAuth";
import RequireRole from "../guards/RequireRole";
import AppShell from "../layout/AppShell";

import NoAutorizado from "../../shared/components/NoAutorizado";
import EnConstruccion from "../../shared/components/EnConstruccion";

import DashboardPage from "../../modules/dashboard/pages/dashboard/DashboardPage";
import VentasPage from "../../modules/ventas/pages/ventas/VentasPage";
import InventarioPage from "../../modules/inventario/pages/inventario/InventarioPage";
import LoginPage from "../../modules/auth/pages/auth/LoginPage";

import UsuariosList from "../../modules/usuarios/pages/usuarios/UsuariosList";
import EmpleadosList from "../../modules/empleados/pages/empleados/EmpleadosList";

import ClientesList from "../../modules/clientes/pages/clientes/ClientesList";
import ClientesFiscalesList from "../../modules/clientes_fiscales/pages/clientes/ClientesFiscalesList";

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

            {/* ADMIN (rutas reales + placeholders) */}
            <Route element={<RequireRole allow={["ADMIN"]} />}>
              {/* Reales (por ahora) */}
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/ventas" element={<VentasPage />} />
              <Route path="/admin/inventario" element={<InventarioPage />} />

              {/* Usuarios (ruta real) */}
              <Route path="/admin/usuarios" element={<UsuariosList />} />

              {/* Empleados (ruta real) */}
              <Route path="/admin/empleados" element={<EmpleadosList />} />

              {/* Clientes comerciales (ruta real) */}
              <Route path="/admin/clientes" element={<ClientesList />} />

              {/* Clientes fiscales (ruta real) */}
              <Route
                path="/admin/clientes-fiscales"
                element={<ClientesFiscalesList />}
              />

              {/* Placeholders (para navegación sin errores) */}
              <Route
                path="/admin/productos"
                element={<EnConstruccion titulo="Productos" />}
              />
              <Route
                path="/admin/compras"
                element={<EnConstruccion titulo="Compras" />}
              />
              <Route
                path="/admin/caja"
                element={<EnConstruccion titulo="Caja" />}
              />
              <Route
                path="/admin/traspasos"
                element={<EnConstruccion titulo="Traspasos" />}
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
              <Route path="/almacen/*" element={<InventarioPage />} />
              <Route
                path="/almacen/compras"
                element={<EnConstruccion titulo="Compras (Almacén)" />}
              />
              <Route
                path="/almacen/traspasos"
                element={<EnConstruccion titulo="Traspasos (Almacén)" />}
              />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
