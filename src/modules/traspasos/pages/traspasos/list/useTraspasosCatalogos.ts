// src/modules/traspasos/pages/traspasos/list/useTraspasosCatalogos.ts
// Hook de catálogos auxiliares para Traspasos.
// Responsabilidades:
// - cargar usuarios
// - transformar ids a nombres amigables
// - exponer mapas reutilizables para tabla y modal
// - construir rol del usuario

import { useEffect, useState } from "react";

import { usuariosService } from "../../../../usuarios/services/usuarios.service";
import type { TraspasoItemListado } from "../../../types/traspasos.types";

type IdNameMap = Record<number, string>;

type UsuarioLookup = {
  id_usuario?: number | null;
  username?: string | null;
  nombre?: string | null;
  nombre_completo?: string | null;
  nombre_en_ticket?: string | null;
  id_rol?: number | null;
};

function usuarioNombreSeguro(usuario: UsuarioLookup): string {
  return (
    usuario.username ??
    usuario.nombre_completo ??
    usuario.nombre ??
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

export function useTraspasosCatalogos(items: TraspasoItemListado[]) {
  const [usuariosMap, setUsuariosMap] = useState<IdNameMap>({});
  const [usuariosRolMap, setUsuariosRolMap] = useState<IdNameMap>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const usuarios = await usuariosService.listar();

        if (!mounted) return;

        const nextUsuariosMap: IdNameMap = {};
        const nextUsuariosRolMap: IdNameMap = {};

        for (const u of usuarios ?? []) {
          if (u?.id_usuario != null) {
            nextUsuariosMap[u.id_usuario] = usuarioNombreSeguro(u);
            nextUsuariosRolMap[u.id_usuario] = rolNombreSeguro(u.id_rol);
          }
        }

        for (const item of items ?? []) {
          if (item.id_usuario != null && !nextUsuariosMap[item.id_usuario]) {
            nextUsuariosMap[item.id_usuario] =
              item.username?.trim() ||
              item.usuario_nombre?.trim() ||
              `Usuario #${item.id_usuario}`;
          }

          if (item.id_usuario != null && !nextUsuariosRolMap[item.id_usuario]) {
            nextUsuariosRolMap[item.id_usuario] =
              item.usuario_rol?.trim() || "Sin rol";
          }
        }

        setUsuariosMap(nextUsuariosMap);
        setUsuariosRolMap(nextUsuariosRolMap);
      } catch {
        if (!mounted) return;

        const nextUsuariosMap: IdNameMap = {};
        const nextUsuariosRolMap: IdNameMap = {};

        for (const item of items ?? []) {
          if (item.id_usuario != null) {
            nextUsuariosMap[item.id_usuario] =
              item.username?.trim() ||
              item.usuario_nombre?.trim() ||
              `Usuario #${item.id_usuario}`;

            nextUsuariosRolMap[item.id_usuario] =
              item.usuario_rol?.trim() || "Sin rol";
          }
        }

        setUsuariosMap(nextUsuariosMap);
        setUsuariosRolMap(nextUsuariosRolMap);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items]);

  return {
    usuariosMap,
    usuariosRolMap,
  };
}