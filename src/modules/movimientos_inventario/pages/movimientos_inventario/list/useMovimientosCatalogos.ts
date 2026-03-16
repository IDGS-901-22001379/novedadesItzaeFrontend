// src/modules/movimientos_inventario/pages/movimientos_inventario/list/useMovimientosCatalogos.ts
// Hook de catálogos auxiliares para Movimientos de Inventario.
// Responsabilidades:
// - cargar usuarios, productos y ubicaciones
// - transformar ids a nombres amigables
// - exponer mapas reutilizables para tabla, modal y detail
// - construir rol del usuario
// - construir producto principal por movimiento

import { useEffect, useState } from "react";

import { usuariosService } from "../../../../usuarios/services/usuarios.service";
import { productosService } from "../../../../productos/services/productos.service";
import { inventarioUbicacionesService } from "../../../../inventario_ubicaciones/services/inventario_ubicaciones.service";
import { movimientosInventarioService } from "../../../services/movimientos_inventario.service";

import type { MovimientoInventarioItem } from "../../../types/movimientos_inventario.types";

type IdNameMap = Record<number, string>;

type ProductoLookup = {
  id_producto?: number | null;
  nombre?: string | null;
  descripcion?: string | null;
  sku?: string | null;
  codigo_barras?: string | null;
};

type UbicacionLookup = {
  id_ubicacion?: number | null;
  nombre?: string | null;
  descripcion?: string | null;
  codigo?: string | null;
};

type UsuarioLookup = {
  id_usuario?: number | null;
  username?: string | null;
  nombre?: string | null;
  nombre_completo?: string | null;
  nombre_en_ticket?: string | null;
  id_rol?: number | null;
};

function productoNombreSeguro(producto: ProductoLookup): string {
  return (
    producto.nombre ??
    producto.descripcion ??
    producto.sku ??
    producto.codigo_barras ??
    `Producto #${producto.id_producto ?? ""}`
  );
}

function ubicacionNombreSeguro(ubicacion: UbicacionLookup): string {
  return (
    ubicacion.nombre ??
    ubicacion.descripcion ??
    ubicacion.codigo ??
    `Ubicación #${ubicacion.id_ubicacion ?? ""}`
  );
}



function usuarioNombreSeguro(usuario: UsuarioLookup): string {
  return (
    usuario.nombre_completo ??
    usuario.nombre ??
    usuario.username ??
    usuario.nombre_en_ticket ??
    `Usuario #${usuario.id_usuario ?? ""}`
  );
}

function rolNombreSeguro(idRol?: number | null): string {
  switch (idRol) {
    case 1:
      return "Administrador";
    case 2:
      return "Ventas";
    case 3:
      return "Almacén";
    default:
      return "Sin rol";
  }
}

export function useMovimientosCatalogos(items: MovimientoInventarioItem[]) {
  const [usuariosMap, setUsuariosMap] = useState<IdNameMap>({});
  const [usuariosRolMap, setUsuariosRolMap] = useState<IdNameMap>({});
  const [productosMap, setProductosMap] = useState<IdNameMap>({});
  const [productosPorMovimientoMap, setProductosPorMovimientoMap] =
    useState<IdNameMap>({});
  const [ubicacionesMap, setUbicacionesMap] = useState<IdNameMap>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [usuarios, productos, ubicaciones] = await Promise.all([
          usuariosService.listar(),
          productosService.listar?.() ?? Promise.resolve([]),
          inventarioUbicacionesService.listar?.() ?? Promise.resolve([]),
        ]);

        if (!mounted) return;

        const nextUsuariosMap: IdNameMap = {};
        const nextUsuariosRolMap: IdNameMap = {};

        for (const u of usuarios ?? []) {
          if (u?.id_usuario != null) {
            nextUsuariosMap[u.id_usuario] = usuarioNombreSeguro(u);
            nextUsuariosRolMap[u.id_usuario] = rolNombreSeguro(u.id_rol);
          }
        }

        const nextProductosMap: IdNameMap = {};
        for (const p of productos ?? []) {
          if (p?.id_producto != null) {
            nextProductosMap[p.id_producto] = productoNombreSeguro(p);
          }
        }

        const nextUbicacionesMap: IdNameMap = {};
        for (const ub of ubicaciones ?? []) {
          if (ub?.id_ubicacion != null) {
            nextUbicacionesMap[ub.id_ubicacion] = ubicacionNombreSeguro(ub);
          }
        }

        setUsuariosMap(nextUsuariosMap);
        setUsuariosRolMap(nextUsuariosRolMap);
        setProductosMap(nextProductosMap);
        setUbicacionesMap(nextUbicacionesMap);
      } catch {
        if (!mounted) return;
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!items.length) {
          if (!mounted) return;
          setProductosPorMovimientoMap({});
          return;
        }

        const entries = await Promise.all(
          items.map(async (item) => {
            try {
              const detalles =
                await movimientosInventarioService.listarDetalles(
                  item.id_movimiento,
                );

              const primerDetalle = detalles?.[0];
              if (!primerDetalle) {
                return [item.id_movimiento, "No disponible"] as const;
              }

              return [item.id_movimiento, primerDetalle.id_producto] as const;
            } catch {
              return [item.id_movimiento, "No disponible"] as const;
            }
          }),
        );

        if (!mounted) return;

        setProductosPorMovimientoMap((prev) => {
          const next: IdNameMap = {};

          for (const [idMovimiento, value] of entries) {
            if (typeof value === "number") {
              next[idMovimiento] =
                productosMap[value] ?? `Producto #${value}`;
            } else {
              next[idMovimiento] = value;
            }
          }

          return {
            ...prev,
            ...next,
          };
        });
      } catch {
        if (!mounted) return;
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items, productosMap]);

  return {
    usuariosMap,
    usuariosRolMap,
    productosMap,
    productosPorMovimientoMap,
    ubicacionesMap,
  };
}