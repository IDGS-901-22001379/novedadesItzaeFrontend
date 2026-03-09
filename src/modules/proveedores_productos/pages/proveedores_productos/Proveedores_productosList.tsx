// src/modules/proveedores_productos/pages/proveedores_productos/Proveedores_productosList.tsx
// Vista principal del módulo Proveedores-Productos.
// Responsabilidades: cargar listado de relaciones proveedor-producto, mantener estado
// (loading/error), aplicar filtros + paginación y conectar componentes UI
// (tabla, modales, alertas).

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  proveedoresPPService,
  proveedoresProductosService,
} from "../../services";
import { productosService } from "../../../productos/services/productos.service";

import type {
  ProveedorListItem,
  ProveedorProductoRow,
} from "../../types/proveedores_productos.types";

import Proveedores_productosForm from "./Proveedores_productosForm";

import { useProveedores_productosTheme } from "../../theme/useProveedores_productosTheme";
import Proveedores_productosHeader from "../../components/proveedores_productos/Proveedores_productosHeader";
import Proveedores_productosFilters, {
  type Proveedores_productosFiltersState,
} from "../../components/proveedores_productos/Proveedores_productosFilters";
import Proveedores_productosTable from "../../components/proveedores_productos/Proveedores_productosTable";
import Proveedores_productosPagination from "../../components/proveedores_productos/Proveedores_productosPagination";
import Proveedores_productosAlert from "../../components/proveedores_productos/Proveedores_productosAlert";
import Proveedores_productosModalForm from "../../components/proveedores_productos/Proveedores_productosModalForm";
import ConfirmActionModal from "../../components/proveedores_productos/ConfirmActionModal";

type LoadState = "idle" | "loading" | "success" | "error";

const FILTERS_INITIAL: Proveedores_productosFiltersState = {
  q: "",
  idProveedor: "TODOS",
  activo: "TODOS",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de relaciones proveedor-producto.";
}

export default function Proveedores_productosList() {
  const theme = useProveedores_productosTheme();

  const [items, setItems] = useState<ProveedorProductoRow[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [proveedoresDisponibles, setProveedoresDisponibles] = useState<
    ProveedorListItem[]
  >([]);

  const [filters, setFilters] =
    useState<Proveedores_productosFiltersState>(FILTERS_INITIAL);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [selectedRelacion, setSelectedRelacion] =
    useState<ProveedorProductoRow | null>(null);

  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [relacionTarget, setRelacionTarget] =
    useState<ProveedorProductoRow | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  const updateFilters = useCallback(
    (patch: Partial<Proveedores_productosFiltersState>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      setPage(0);
    },
    [],
  );

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const proveedores = await proveedoresPPService.listar({
        solo_activos: false,
      });
      setProveedoresDisponibles(proveedores);

      const relacionesPorProveedor = await Promise.all(
        proveedores.map(async (prov) => {
          const relaciones =
            await proveedoresProductosService.listarPorProveedor(
              prov.id_proveedor,
              { solo_activos: false },
            );

          return { proveedor: prov, relaciones };
        }),
      );

      const idsProductos = Array.from(
        new Set(
          relacionesPorProveedor.flatMap((entry) =>
            entry.relaciones.map((rel) => rel.id_producto),
          ),
        ),
      );

      const productosDetalles = await Promise.all(
        idsProductos.map(async (id_producto) => {
          try {
            return await productosService.obtener(id_producto);
          } catch {
            return null;
          }
        }),
      );

      const productosMap = new Map<
        number,
        Awaited<ReturnType<typeof productosService.obtener>>
      >();

      productosDetalles.forEach((prod) => {
        if (prod) productosMap.set(prod.id_producto, prod);
      });

      const rows: ProveedorProductoRow[] = relacionesPorProveedor.flatMap(
        ({ proveedor, relaciones }) =>
          relaciones.map((rel): ProveedorProductoRow => {
            const producto = productosMap.get(rel.id_producto);

            return {
              id_relacion: `${rel.id_proveedor}-${rel.id_producto}`,

              id_proveedor: proveedor.id_proveedor,
              razon_social: proveedor.razon_social,
              proveedor_tipo: proveedor.tipo,
              proveedor_estatus: proveedor.estatus,
              proveedor_telefono: proveedor.telefono ?? null,
              proveedor_correo: proveedor.correo ?? null,

              id_producto: rel.id_producto,
              producto_nombre:
                producto?.nombre ?? `Producto #${rel.id_producto}`,
              producto_sku: producto?.sku ?? null,
              producto_codigo_barras: producto?.codigo_barras ?? null,
              producto_modelo: producto?.modelo ?? null,
              producto_imagen_ruta: producto?.imagen_ruta ?? null,

              sku_proveedor: rel.sku_proveedor ?? null,
              costo_referencia: rel.costo_referencia ?? null,
              activo: rel.activo,
              creado_en: rel.creado_en,
            };
          }),
      );

      setItems(rows);
      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const itemsFiltrados = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    const filtrarTexto = (r: ProveedorProductoRow) => {
      if (!q) return true;

      const full = [
        r.razon_social,
        r.producto_nombre,
        r.producto_sku ?? "",
        r.producto_codigo_barras ?? "",
        r.producto_modelo ?? "",
        r.sku_proveedor ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return full.includes(q);
    };

    const filtrarProveedor = (r: ProveedorProductoRow) => {
      if (filters.idProveedor === "TODOS") return true;
      return r.id_proveedor === Number(filters.idProveedor);
    };

    const filtrarActivo = (r: ProveedorProductoRow) => {
      if (filters.activo === "TODOS") return true;
      if (filters.activo === "ACTIVOS") return r.activo === true;
      return r.activo === false;
    };

    return items.filter(
      (r) => filtrarTexto(r) && filtrarProveedor(r) && filtrarActivo(r),
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
    const activos = itemsFiltrados.filter((x) => x.activo).length;
    const inactivos = itemsFiltrados.filter((x) => !x.activo).length;
    return { activos, inactivos, total: itemsFiltrados.length };
  }, [itemsFiltrados]);

  function onNuevo() {
    setSelectedRelacion(null);
    setOpenNuevo(true);
  }

  function onEditar(item: ProveedorProductoRow) {
    setSelectedRelacion(item);
    setOpenEditar(true);
  }

  function onVer(item: ProveedorProductoRow) {
    setSelectedRelacion(item);
    setOpenVer(true);
  }

  function onEliminar(item: ProveedorProductoRow) {
    setRelacionTarget(item);
    setOpenConfirmEstatus(true);
  }

  async function confirmarCambioEstatus() {
    if (!relacionTarget) return;

    try {
      setSavingEstatus(true);

      // DESACTIVAR
      if (relacionTarget.activo) {
        await proveedoresProductosService.desactivarRelacion(
          relacionTarget.id_proveedor,
          relacionTarget.id_producto,
        );
      } else {
        // ACTIVAR
        const existeActivaIgual = items.some(
          (x) =>
            x.id_relacion !== relacionTarget.id_relacion &&
            x.id_proveedor === relacionTarget.id_proveedor &&
            x.id_producto === relacionTarget.id_producto &&
            x.activo,
        );

        if (existeActivaIgual) {
          alert(
            "No se puede activar esta relación porque ya existe una relación activa con el mismo proveedor y producto.",
          );
          return;
        }

        await proveedoresProductosService.actualizarRelacion(
          relacionTarget.id_proveedor,
          relacionTarget.id_producto,
          {
            sku_proveedor: relacionTarget.sku_proveedor ?? "",
            costo_referencia: Number(relacionTarget.costo_referencia ?? 0),
            activo: true,
          },
        );
      }

      setOpenConfirmEstatus(false);
      setRelacionTarget(null);
      void cargar();
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "No se pudo cambiar el estatus de la relación.";
      alert(msg);
    } finally {
      setSavingEstatus(false);
    }
  }

  const accionTexto = relacionTarget?.activo ? "Desactivar" : "Activar";
  const confirmVariant = relacionTarget?.activo ? "danger" : "success";

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <Proveedores_productosHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={onNuevo}
        />

        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <Proveedores_productosFilters
            theme={theme}
            filters={filters}
            proveedoresDisponibles={proveedoresDisponibles}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <Proveedores_productosAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <Proveedores_productosTable
          theme={theme}
          items={itemsPagina}
          onVer={onVer}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />

        <Proveedores_productosPagination
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

      <Proveedores_productosModalForm
        open={openNuevo}
        title="Nueva relación"
        theme={theme}
        onClose={() => setOpenNuevo(false)}
      >
        <Proveedores_productosForm
          key="nuevo"
          modo="CREAR"
          initialRelacion={null}
          relacionesExistentes={items}
          onSuccess={() => {
            setOpenNuevo(false);
            void cargar();
          }}
          onCancel={() => setOpenNuevo(false)}
        />
      </Proveedores_productosModalForm>

      <Proveedores_productosModalForm
        open={openEditar}
        title="Editar relación"
        theme={theme}
        onClose={() => setOpenEditar(false)}
      >
        <Proveedores_productosForm
          key={selectedRelacion?.id_relacion ?? "editar"}
          modo="EDITAR"
          initialRelacion={selectedRelacion}
          relacionesExistentes={items}
          onSuccess={() => {
            setOpenEditar(false);
            void cargar();
          }}
          onCancel={() => setOpenEditar(false)}
        />
      </Proveedores_productosModalForm>

      <Proveedores_productosModalForm
        open={openVer}
        title="Visualizar relación"
        theme={theme}
        onClose={() => setOpenVer(false)}
      >
        <Proveedores_productosForm
          key={selectedRelacion?.id_relacion ?? "ver"}
          modo="VER"
          initialRelacion={selectedRelacion}
          relacionesExistentes={items}
          onSuccess={() => {}}
          onCancel={() => setOpenVer(false)}
        />
      </Proveedores_productosModalForm>

      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de {accionTexto.toLowerCase()} la relación entre{" "}
            <span className="font-extrabold">
              {relacionTarget?.razon_social ?? ""}
            </span>{" "}
            y{" "}
            <span className="font-extrabold">
              {relacionTarget?.producto_nombre ?? ""}
            </span>
            ?
          </span>
        }
        cancelText="Cancelar"
        confirmText={accionTexto}
        loading={savingEstatus}
        onCancel={() => {
          if (savingEstatus) return;
          setOpenConfirmEstatus(false);
          setRelacionTarget(null);
        }}
        onConfirm={() => void confirmarCambioEstatus()}
      />
    </div>
  );
}
