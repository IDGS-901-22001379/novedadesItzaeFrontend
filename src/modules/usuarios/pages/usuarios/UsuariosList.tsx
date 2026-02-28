// src/modules/usuarios/pages/usuarios/UsuariosList.tsx
// Vista principal del módulo Usuarios.
// Responsabilidades: cargar listado desde API, aplicar filtros + paginación en frontend,
// mostrar estados (loading/error/vacío) y conectar modales con UsuariosForm (crear/editar).

import { useCallback, useEffect, useMemo, useState } from "react";
import { usuariosService } from "../../services/usuarios.service";
import type { User, UsuarioEstatus } from "../../types/usuarios.types";
import UsuariosForm from "./UsuariosForm";

type LoadState = "idle" | "loading" | "success" | "error";

type FiltersState = {
  q: string;
  estatus: "TODOS" | UsuarioEstatus;
  idRol: "TODOS" | string;
};

const FILTERS_INITIAL: FiltersState = {
  q: "",
  estatus: "TODOS",
  idRol: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de usuarios.";
}

export default function UsuariosList() {
  const [items, setItems] = useState<User[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] = useState<FiltersState>(FILTERS_INITIAL);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  const updateFilters = useCallback((patch: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  }, []);

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await usuariosService.listar();
      setItems(data);

      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const data = await usuariosService.listar();
        if (!mounted) return;

        setItems(data);
        setState("success");
      } catch (error: unknown) {
        if (!mounted) return;

        setState("error");
        setErrorMsg(getErrorMessage(error));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const rolesDisponibles = useMemo(() => {
    const map = new Map<number, number>();
    items.forEach((u) => map.set(u.id_rol, u.id_rol));
    return Array.from(map.values()).sort((a, b) => a - b);
  }, [items]);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (u: User) => {
      if (!q) return true;
      const full = `${u.username} ${u.nombre_en_ticket} ${u.id_usuario}`.toLowerCase();
      return full.includes(q);
    };

    const filtrarEstatus = (u: User) => {
      if (filters.estatus === "TODOS") return true;
      return u.estatus === filters.estatus;
    };

    const filtrarRol = (u: User) => {
      if (filters.idRol === "TODOS") return true;
      const rolNum = Number(filters.idRol);
      return u.id_rol === rolNum;
    };

    return items.filter((u) => filtrarTexto(u) && filtrarEstatus(u) && filtrarRol(u));
  }, [items, filters]);

  const total = itemsFiltrados.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const itemsPagina = useMemo(() => {
    const start = page * pageSize;
    return itemsFiltrados.slice(start, start + pageSize);
  }, [itemsFiltrados, page]);

  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  const resumen = useMemo(() => {
    const activos = itemsFiltrados.filter((x) => x.estatus === "ACTIVO").length;
    const inactivos = itemsFiltrados.filter((x) => x.estatus === "INACTIVO").length;
    return { activos, inactivos, total: itemsFiltrados.length };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedUser(null);
    setOpenNuevo(true);
  }

  function onEditar(u: User) {
    setSelectedUser(u);
    setOpenEditar(true);
  }

  const hayDatos = itemsFiltrados.length > 0;

  return (
    <div className="p-4">
      <div className="rounded-3xl border border-[#AB47BC]/35 bg-gradient-to-br from-[#7E57C2]/10 via-[#C19ADE]/12 to-[#F3B2DB]/18 p-4 shadow-sm shadow-[#7E57C2]/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#5A189A]">Usuarios</h1>
            <div className="mt-1 text-sm font-semibold text-[#7B2CBF]">
              Total: <span className="font-extrabold text-[#5A189A]">{resumen.total}</span> · Activos:{" "}
              <span className="font-extrabold text-[#5A189A]">{resumen.activos}</span> · Inactivos:{" "}
              <span className="font-extrabold text-[#5A189A]">{resumen.inactivos}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void cargar()}
              disabled={state === "loading"}
              className="rounded-xl border border-[#AB47BC]/40 bg-white px-4 py-2 text-sm font-extrabold text-[#5A189A] shadow-sm shadow-[#7E57C2]/10 hover:bg-[#F3B2DB]/25 disabled:opacity-50"
            >
              Recargar
            </button>

            <button
              type="button"
              onClick={onNuevo}
              className="rounded-xl bg-[#7B2CBF] px-4 py-2 text-sm font-extrabold text-white shadow-sm shadow-[#5A189A]/15 hover:bg-[#5A189A]"
            >
              Nuevo usuario
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#AB47BC]/35 bg-white/80 p-4 shadow-sm shadow-[#7E57C2]/10">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#5A189A]">Búsqueda</label>
              <input
                value={filters.q}
                onChange={(e) => updateFilters({ q: e.target.value })}
                placeholder="Buscar por usuario, nombre en ticket o id..."
                className="rounded-xl border border-[#AB47BC]/35 bg-white px-3 py-2 text-sm font-semibold text-[#5A189A] placeholder:text-[#9D4EDD] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#5A189A]">Estatus</label>
              <select
                value={filters.estatus}
                onChange={(e) => updateFilters({ estatus: e.target.value as FiltersState["estatus"] })}
                className="rounded-xl border border-[#AB47BC]/35 bg-white px-3 py-2 text-sm font-semibold text-[#5A189A] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]"
              >
                <option value="TODOS">Todos</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold text-[#5A189A]">Rol (id)</label>
              <select
                value={filters.idRol}
                onChange={(e) => updateFilters({ idRol: e.target.value })}
                className="rounded-xl border border-[#AB47BC]/35 bg-white px-3 py-2 text-sm font-semibold text-[#5A189A] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]"
              >
                <option value="TODOS">Todos</option>
                {rolesDisponibles.map((id) => (
                  <option key={id} value={String(id)}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setFilters(FILTERS_INITIAL);
                setPage(0);
              }}
              disabled={state === "loading"}
              className="rounded-xl border border-[#AB47BC]/40 bg-[#F3B2DB]/25 px-4 py-2 text-sm font-extrabold text-[#5A189A] shadow-sm shadow-[#7E57C2]/10 hover:bg-[#F3B2DB]/40 disabled:opacity-50"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="mt-4">
          {state === "loading" && (
            <div className="rounded-2xl border border-[#AB47BC]/35 bg-[#F3B2DB]/15 p-4 text-sm font-extrabold text-[#5A189A] shadow-sm shadow-[#7E57C2]/10">
              Cargando usuarios...
            </div>
          )}

          {state === "error" && (
            <div className="rounded-2xl border border-[#AB47BC]/35 bg-white/80 p-4 shadow-sm shadow-[#7E57C2]/10">
              <div className="text-sm font-extrabold text-[#5A189A]">
                Error: <span className="font-semibold text-[#7B2CBF]">{errorMsg}</span>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => void cargar()}
                  className="rounded-xl bg-[#9D4EDD] px-4 py-2 text-sm font-extrabold text-white shadow-sm shadow-[#5A189A]/15 hover:bg-[#7B2CBF]"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {state === "success" && !hayDatos && (
            <div className="rounded-2xl border border-[#AB47BC]/35 bg-[#F3B2DB]/15 p-4 text-sm font-extrabold text-[#5A189A] shadow-sm shadow-[#7E57C2]/10">
              No hay usuarios para los filtros seleccionados.
            </div>
          )}

          {state === "success" && hayDatos && (
            <div className="rounded-2xl border border-[#AB47BC]/40 bg-white shadow-sm shadow-[#7E57C2]/10">
              <div className="overflow-x-auto rounded-2xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#7B2CBF]">
                    <tr className="text-left">
                      <th className="border-b border-[#5A189A]/40 px-4 py-3 font-extrabold text-white">ID</th>
                      <th className="border-b border-[#5A189A]/40 px-4 py-3 font-extrabold text-white">
                        Usuario
                      </th>
                      <th className="border-b border-[#5A189A]/40 px-4 py-3 font-extrabold text-white">
                        Rol (id)
                      </th>
                      <th className="border-b border-[#5A189A]/40 px-4 py-3 font-extrabold text-white">
                        Estatus
                      </th>
                      <th className="border-b border-[#5A189A]/40 px-4 py-3 font-extrabold text-white">
                        Nombre en ticket
                      </th>
                      <th className="border-b border-[#5A189A]/40 px-4 py-3 font-extrabold text-white">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#AB47BC]/20">
                    {itemsPagina.map((u) => (
                      <tr key={u.id_usuario} className="hover:bg-[#E0AAFF]/20">
                        <td className="px-4 py-3 font-semibold text-[#5A189A]">{u.id_usuario}</td>
                        <td className="px-4 py-3 font-semibold text-[#5A189A]">{u.username}</td>
                        <td className="px-4 py-3 font-semibold text-[#5A189A]">{u.id_rol}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              u.estatus === "ACTIVO"
                                ? "inline-flex rounded-full border border-[#AB47BC]/35 bg-[#C77DFF]/20 px-2.5 py-1 text-xs font-extrabold text-[#5A189A]"
                                : "inline-flex rounded-full border border-[#AB47BC]/35 bg-[#E6BBFF]/45 px-2.5 py-1 text-xs font-extrabold text-[#5A189A]"
                            }
                          >
                            {u.estatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#5A189A]">{u.nombre_en_ticket}</td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onEditar(u)}
                              className="rounded-xl border border-[#AB47BC]/40 bg-white px-3 py-2 text-xs font-extrabold text-[#5A189A] shadow-sm shadow-[#7E57C2]/10 hover:bg-[#F3B2DB]/25"
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#AB47BC]/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-[#7B2CBF]">
                  Mostrando <span className="font-extrabold text-[#5A189A]">{from}</span>–
                  <span className="font-extrabold text-[#5A189A]">{to}</span> de{" "}
                  <span className="font-extrabold text-[#5A189A]">{total}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-[#AB47BC]/40 bg-white px-3 py-2 text-sm font-extrabold text-[#5A189A] shadow-sm shadow-[#7E57C2]/10 hover:bg-[#F3B2DB]/25 disabled:opacity-50 disabled:hover:bg-white"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Anterior
                  </button>

                  <div className="text-sm font-semibold text-[#7B2CBF]">
                    Página <span className="font-extrabold text-[#5A189A]">{page + 1}</span> /{" "}
                    <span className="font-extrabold text-[#5A189A]">{totalPages}</span>
                  </div>

                  <button
                    type="button"
                    className="rounded-xl border border-[#AB47BC]/40 bg-white px-3 py-2 text-sm font-extrabold text-[#5A189A] shadow-sm shadow-[#7E57C2]/10 hover:bg-[#F3B2DB]/25 disabled:opacity-50 disabled:hover:bg-white"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {openNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#7E57C2]/35 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#AB47BC]/40 bg-white shadow-xl shadow-[#7E57C2]/15">
            <div className="flex items-start justify-between border-b border-[#AB47BC]/30 bg-[#E6BBFF]/35 px-4 py-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#5A189A]">Nuevo usuario</h2>
                <p className="mt-1 text-sm font-semibold text-[#7B2CBF]">Completa los datos y guarda.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenNuevo(false)}
                className="rounded-xl border border-[#AB47BC]/40 bg-white px-3 py-2 text-sm font-extrabold text-[#5A189A] hover:bg-[#F3B2DB]/25"
              >
                Cerrar
              </button>
            </div>

            <UsuariosForm
              mode="create"
              onCancel={() => setOpenNuevo(false)}
              onSuccess={async () => {
                setOpenNuevo(false);
                await cargar();
              }}
              roleOptions={rolesDisponibles}
            />
          </div>
        </div>
      )}

      {openEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#7E57C2]/35 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[#AB47BC]/40 bg-white shadow-xl shadow-[#7E57C2]/15">
            <div className="flex items-start justify-between border-b border-[#AB47BC]/30 bg-[#E6BBFF]/35 px-4 py-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#5A189A]">Editar usuario</h2>
                <p className="mt-1 text-sm font-semibold text-[#7B2CBF]">
                  Usuario: <span className="font-extrabold text-[#5A189A]">{selectedUser?.username}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenEditar(false)}
                className="rounded-xl border border-[#AB47BC]/40 bg-white px-3 py-2 text-sm font-extrabold text-[#5A189A] hover:bg-[#F3B2DB]/25"
              >
                Cerrar
              </button>
            </div>

            <UsuariosForm
              mode="edit"
              user={selectedUser}
              onCancel={() => setOpenEditar(false)}
              onSuccess={async () => {
                setOpenEditar(false);
                await cargar();
              }}
              roleOptions={rolesDisponibles}
            />
          </div>
        </div>
      )}
    </div>
  );
}