// src/modules/usuarios/pages/usuarios/UsuariosList.tsx
// Vista principal del módulo Usuarios.
// Responsabilidades: cargar listado desde API, mantener estado (loading/error),
// aplicar filtros + paginación y conectar componentes UI (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import { usuariosService } from "../../services/usuarios.service";
import type { User, UsuarioEstatus } from "../../types/usuarios.types";
import UsuariosForm from "./UsuariosForm";

import { useUsuariosTheme } from "../../theme/useUsuariosTheme";
import UsuariosHeader from "../../components/usuarios/UsuariosHeader";
import UsuariosFilters, {
  type UsuariosFiltersState,
} from "../../components/usuarios/UsuariosFilters";
import UsuariosTable from "../../components/usuarios/UsuariosTable";
import UsuariosPagination from "../../components/usuarios/UsuariosPagination";
import UsuariosAlert from "../../components/usuarios/UsuariosAlert";
import UsuariosModalForm from "../../components/usuarios/UsuariosModalForm";
import ConfirmActionModal from "../../components/usuarios/ConfirmActionModal";
import { ROLES } from "../../constants/roles";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: UsuariosFiltersState = {
  q: "",
  estatus: "TODOS",
  idRol: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de usuarios.";
}

export default function UsuariosList() {
  const theme = useUsuariosTheme();

  const [items, setItems] = useState<User[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [filters, setFilters] = useState<UsuariosFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // modal confirmación estatus
  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [userEstatusTarget, setUserEstatusTarget] = useState<User | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback((patch: Partial<UsuariosFiltersState>) => {
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

  // Roles fijos (catálogo)
  const rolesDisponibles = useMemo(() => ROLES, []);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (u: User) => {
      if (!q) return true;
      const full =
        `${u.username} ${u.nombre_en_ticket} ${u.id_usuario}`.toLowerCase();
      return full.includes(q);
    };

    const filtrarEstatus = (u: User) => {
      if (filters.estatus === "TODOS") return true;
      return u.estatus === (filters.estatus as UsuarioEstatus);
    };

    const filtrarRol = (u: User) => {
      if (filters.idRol === "TODOS") return true;
      return u.id_rol === Number(filters.idRol);
    };

    return items.filter(
      (u) => filtrarTexto(u) && filtrarEstatus(u) && filtrarRol(u),
    );
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
    const inactivos = itemsFiltrados.filter(
      (x) => x.estatus === "INACTIVO",
    ).length;
    return { activos, inactivos, total: itemsFiltrados.length };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedUser(null);
    setOpenNuevo(true);
  }

  async function onEditar(u: User) {
    try {
      const detalle = await usuariosService.obtener(u.id_usuario);
      setSelectedUser(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del usuario.";
      alert(msg);
    }
  }

  async function onVer(u: User) {
    try {
      const detalle = await usuariosService.obtener(u.id_usuario);
      setSelectedUser(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cargar el detalle del usuario.";
      alert(msg);
    }
  }

  function onEliminar(u: User) {
    setUserEstatusTarget(u);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!userEstatusTarget) return;

    try {
      setSavingEstatus(true);

      const nuevoEstatus =
        userEstatusTarget.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      await usuariosService.cambiarEstatus(userEstatusTarget.id_usuario, {
        estatus: nuevoEstatus,
      });

      setOpenConfirmEstatus(false);
      setUserEstatusTarget(null);
      void cargar();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "No se pudo cambiar el estatus.";
      alert(msg);
    } finally {
      setSavingEstatus(false);
    }
  }

  const estatusNuevo =
    userEstatusTarget?.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
  const confirmVariant = estatusNuevo === "INACTIVO" ? "danger" : "success";
  const confirmText = estatusNuevo === "INACTIVO" ? "Desactivar" : "Activar";

  return (
    <div className="p-4">
      {/* BLOQUE COMPLETO (TÍTULO + BOTÓN + FILTROS) CON EL MISMO COLOR QUE LA TABLA */}
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <UsuariosHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={onNuevo}
        />

        {/* Solo una tarjeta blanca (forzamos textos negros aunque el header sea blanco en dark) */}
        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <UsuariosFilters
            theme={theme}
            filters={filters}
            rolesDisponibles={rolesDisponibles}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <UsuariosAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      {/* TABLA SEPARADA */}
      <div className="mt-4">
        <UsuariosTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <UsuariosPagination
          theme={theme}
          page={page}
          totalPages={totalPages}
          from={from}
          to={to}
          total={total}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      </div>

      {/* MODAL: NUEVO */}
      <UsuariosModalForm
        open={openNuevo}
        title="Nuevo usuario"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <UsuariosForm
          key="nuevo"
          modo="CREAR"
          initialUser={null}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </UsuariosModalForm>

      {/* MODAL: EDITAR */}
      <UsuariosModalForm
        open={openEditar}
        title="Editar usuario"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <UsuariosForm
          key={selectedUser?.id_usuario ?? "editar"}
          modo="EDITAR"
          initialUser={selectedUser}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </UsuariosModalForm>

      {/* MODAL: VER (solo lectura) */}
      <UsuariosModalForm
        open={openVer}
        title="Visualizar usuario"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <UsuariosForm
          key={selectedUser?.id_usuario ?? "ver"}
          modo="VER"
          initialUser={selectedUser}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </UsuariosModalForm>

      {/* CONFIRM: CAMBIAR ESTATUS */}
      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de{" "}
            <span className="font-extrabold">
              {userEstatusTarget?.username ?? ""}
            </span>{" "}
            a <span className="font-extrabold">{estatusNuevo}</span>?
          </span>
        }
        cancelText="Cancelar"
        confirmText={confirmText}
        loading={savingEstatus}
        onCancel={() => {
          if (savingEstatus) return;
          setOpenConfirmEstatus(false);
          setUserEstatusTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
