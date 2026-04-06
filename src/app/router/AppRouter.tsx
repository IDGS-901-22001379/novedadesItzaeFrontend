// src/app/router/AppRouter.tsx
// Router principal de la aplicación.
// Se encarga de registrar rutas públicas, protegidas y por rol,
// integrando los módulos reales y dejando placeholders en los apartados aún no desarrollados.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "../guards/RequireAuth";
import RequireRole from "../guards/RequireRole";
import AppShell from "../layout/AppShell";

import NoAutorizado from "../../shared/components/NoAutorizado";
import EnConstruccion from "../../shared/components/EnConstruccion";

import DashboardPage from "../../modules/dashboard/pages/dashboard/DashboardPage";
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
import VentasList from "../../modules/ventas/pages/ventas/VentasList";
import CajaList from "../../modules/caja/pages/caja/CajaList";
import Cortes_cajaList from "../../modules/cortes_caja/pages/cortes_caja/Cortes_cajaList";
import FacturacionCfdiList from "../../modules/facturacion_cfdi/pages/facturacion_cfdi/Facturacion_cfdiList";
import Devoluciones_cancelacionesList from "../../modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/Devoluciones_cancelacionesList";
import CreditosList from "../../modules/creditos/pages/creditos/CreditosList";
import Creditos_abonosList from "../../modules/creditos_abonos/pages/creditos_abonos/Creditos_abonosList";

import HomeRedirect from "./HomeRedirect";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomeRedirect />} />

            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route
              path="/almacen"
              element={<Navigate to="/almacen/compras" replace />}
            />

            <Route
              path="/almacen/inventario"
              element={<Navigate to="/almacen/inventario/sucursales" replace />}
            />

            <Route
              path="/ventas"
              element={<Navigate to="/ventas/listado" replace />}
            />

            <Route element={<RequireRole allow={["ADMIN"]} />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/ventas" element={<VentasList />} />

              <Route path="/admin/usuarios" element={<UsuariosList />} />

              <Route path="/admin/empleados" element={<EmpleadosList />} />

              <Route path="/admin/clientes" element={<ClientesList />} />

              <Route
                path="/admin/clientes-fiscales"
                element={<ClientesFiscalesList />}
              />

              <Route
                path="/admin/clientes-tipos"
                element={<Clientes_tiposList />}
              />

              <Route path="/admin/productos" element={<ProductosList />} />

              <Route path="/admin/proveedores" element={<ProveedoresList />} />

              <Route
                path="/admin/proveedores-productos"
                element={<Proveedores_productosList />}
              />

              <Route path="/admin/compras" element={<ComprasList />} />

              <Route path="/admin/caja" element={<CajaList />} />

              <Route path="/admin/cortes-caja" element={<Cortes_cajaList />} />

              <Route
                path="/admin/inventario/sucursales"
                element={<Inventario_sucursalesList />}
              />

              <Route
                path="/admin/inventario/ubicaciones"
                element={<InventarioUbicacionesList />}
              />

              <Route
                path="/admin/inventario/existencias"
                element={<InventarioExistenciasList />}
              />

              <Route
                path="/admin/inventario/movimientos"
                element={<Movimientos_inventarioList />}
              />

              <Route
                path="/admin/inventario/movimientos/:id_movimiento"
                element={<Movimientos_inventarioDetail />}
              />

              <Route path="/admin/traspasos" element={<TraspasosList />} />

              <Route
                path="/admin/facturacion"
                element={<FacturacionCfdiList />}
              />

              <Route
                path="/admin/devoluciones"
                element={<Devoluciones_cancelacionesList />}
              />

              <Route path="/admin/creditos" element={<CreditosList />} />

              <Route path="/admin/abonos" element={<Creditos_abonosList />} />

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
            </Route>

            <Route element={<RequireRole allow={["VENTAS"]} />}>
              <Route path="/ventas/listado" element={<VentasList />} />
              <Route
                path="/ventas/caja"
                element={<EnConstruccion titulo="Caja (Ventas)" />}
              />
              <Route
                path="/ventas/devoluciones"
                element={<Devoluciones_cancelacionesList />}
              />
            </Route>

            <Route element={<RequireRole allow={["ALMACEN"]} />}>
              <Route path="/almacen/compras" element={<ComprasList />} />

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

              <Route path="/almacen/traspasos" element={<TraspasosList />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
