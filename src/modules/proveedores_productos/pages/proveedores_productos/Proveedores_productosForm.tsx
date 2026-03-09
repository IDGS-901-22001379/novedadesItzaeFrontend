// src/modules/proveedores_productos/pages/proveedores_productos/Proveedores_productosForm.tsx

import { useEffect, useMemo, useState } from "react";
import { productosService } from "../../../productos/services/productos.service";
import type { ProductoLite } from "../../../productos/types/productos.types";
import {
  proveedoresPPService,
  proveedoresProductosService,
} from "../../services";
import { getApiErrorMessage } from "../../../../services/http/getApiErrorMessage";

import type {
  ProveedorListItem,
  ProveedorProductoCreate,
  ProveedorProductoRow,
} from "../../types/proveedores_productos.types";

export type Proveedores_productosFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: Proveedores_productosFormModo;
  initialRelacion: ProveedorProductoRow | null;
  relacionesExistentes: ProveedorProductoRow[];
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  id_proveedor: number;
  proveedor_nombre: string;

  id_producto: number;
  producto_nombre: string;
  producto_sku: string;
  producto_codigo_barras: string;
  producto_modelo: string;

  sku_proveedor: string;
  costo_referencia: string;
  activo: boolean;
};

function buildInitialForm(
  modo: Proveedores_productosFormModo,
  item: ProveedorProductoRow | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && item) {
    return {
      id_proveedor: item.id_proveedor,
      proveedor_nombre: item.razon_social,

      id_producto: item.id_producto,
      producto_nombre: item.producto_nombre,
      producto_sku: item.producto_sku ?? "",
      producto_codigo_barras: item.producto_codigo_barras ?? "",
      producto_modelo: item.producto_modelo ?? "",

      sku_proveedor: item.sku_proveedor ?? "",
      costo_referencia:
        item.costo_referencia !== null && item.costo_referencia !== undefined
          ? String(item.costo_referencia)
          : "",
      activo: item.activo,
    };
  }

  return {
    id_proveedor: 0,
    proveedor_nombre: "",

    id_producto: 0,
    producto_nombre: "",
    producto_sku: "",
    producto_codigo_barras: "",
    producto_modelo: "",

    sku_proveedor: "",
    costo_referencia: "",
    activo: true,
  };
}

function toMoneyNumber(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n;
}

export default function Proveedores_productosForm({
  modo,
  initialRelacion,
  relacionesExistentes,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialRelacion),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const [proveedorQuery, setProveedorQuery] = useState("");
  const [proveedorResultados, setProveedorResultados] = useState<
    ProveedorListItem[]
  >([]);
  const [loadingProveedores, setLoadingProveedores] = useState(false);

  const [productoQuery, setProductoQuery] = useState("");
  const [productoResultados, setProductoResultados] = useState<ProductoLite[]>(
    [],
  );
  const [loadingProductos, setLoadingProductos] = useState(false);

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar relación proveedor-producto";
    if (modo === "EDITAR") {
      return `Editar relación: ${initialRelacion?.razon_social ?? ""} / ${initialRelacion?.producto_nombre ?? ""}`;
    }
    return `Visualizar relación: ${initialRelacion?.razon_social ?? ""} / ${initialRelacion?.producto_nombre ?? ""}`;
  }, [modo, initialRelacion]);

  useEffect(() => {
    if (readOnly) return;
    if (!proveedorQuery.trim()) {
      setProveedorResultados([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoadingProveedores(true);
        const data = await proveedoresPPService.buscar({
          q: proveedorQuery.trim(),
          solo_activos: false,
          limit: 8,
          offset: 0,
        });
        setProveedorResultados(data);
      } catch {
        setProveedorResultados([]);
      } finally {
        setLoadingProveedores(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [proveedorQuery, readOnly]);

  useEffect(() => {
    if (readOnly) return;
    if (!productoQuery.trim()) {
      setProductoResultados([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoadingProductos(true);
        const data = await productosService.buscar({
          q: productoQuery.trim(),
          solo_activos: false,
          limit: 8,
          offset: 0,
        });
        setProductoResultados(data);
      } catch {
        setProductoResultados([]);
      } finally {
        setLoadingProductos(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [productoQuery, readOnly]);

  function pickProveedor(prov: ProveedorListItem) {
    setForm((p) => ({
      ...p,
      id_proveedor: prov.id_proveedor,
      proveedor_nombre: prov.razon_social,
    }));
    setProveedorQuery(prov.razon_social);
    setProveedorResultados([]);
  }

  function pickProducto(prod: ProductoLite) {
    setForm((p) => ({
      ...p,
      id_producto: prod.id_producto,
      producto_nombre: prod.nombre ?? "",
      producto_sku: prod.sku ?? "",
      producto_codigo_barras: prod.codigo_barras ?? "",
      producto_modelo: prod.modelo ?? "",
    }));
    setProductoQuery(prod.nombre ?? "");
    setProductoResultados([]);
  }

  function validarCrearEditar(): string {
    if (!form.id_proveedor || form.id_proveedor <= 0) {
      return "Te falta seleccionar el proveedor.";
    }
    if (!form.id_producto || form.id_producto <= 0) {
      return "Te falta seleccionar el producto.";
    }
    if (!form.costo_referencia.trim()) {
      return "Te falta registrar el costo de referencia.";
    }
    if (Number.isNaN(Number(form.costo_referencia))) {
      return "El costo de referencia no es válido.";
    }
    return "";
  }

  async function guardar() {
    const err = validarCrearEditar();
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      const payloadActiva: ProveedorProductoCreate = {
        id_producto: form.id_producto,
        sku_proveedor: form.sku_proveedor.trim(),
        costo_referencia: toMoneyNumber(form.costo_referencia),
        activo: true,
      };

      const relacionActivaIgual = relacionesExistentes.find(
        (r) =>
          r.id_proveedor === form.id_proveedor &&
          r.id_producto === form.id_producto &&
          r.activo &&
          r.id_relacion !== initialRelacion?.id_relacion,
      );

      const relacionInactivaIgual = relacionesExistentes.find(
        (r) =>
          r.id_proveedor === form.id_proveedor &&
          r.id_producto === form.id_producto &&
          !r.activo &&
          r.id_relacion !== initialRelacion?.id_relacion,
      );

      if (modo === "CREAR") {
        if (relacionActivaIgual) {
          setMsgError(
            "Ya existe una relación activa con ese proveedor y ese producto.",
          );
          return;
        }

        if (relacionInactivaIgual) {
          await proveedoresProductosService.actualizarRelacion(
            relacionInactivaIgual.id_proveedor,
            relacionInactivaIgual.id_producto,
            {
              sku_proveedor: payloadActiva.sku_proveedor,
              costo_referencia: payloadActiva.costo_referencia,
              activo: true,
            },
          );
          onSuccess();
          return;
        }

        await proveedoresProductosService.crearRelacion(
          form.id_proveedor,
          payloadActiva,
        );
        onSuccess();
        return;
      }

      if (!initialRelacion) {
        setMsgError("No se encontró la relación a editar.");
        return;
      }

      const mismoProveedor = initialRelacion.id_proveedor === form.id_proveedor;
      const mismoProducto = initialRelacion.id_producto === form.id_producto;

      if (mismoProveedor && mismoProducto) {
        await proveedoresProductosService.actualizarRelacion(
          initialRelacion.id_proveedor,
          initialRelacion.id_producto,
          {
            sku_proveedor: form.sku_proveedor.trim(),
            costo_referencia: toMoneyNumber(form.costo_referencia),
            activo: form.activo,
          },
        );
        onSuccess();
        return;
      }

      if (relacionActivaIgual) {
        setMsgError(
          "No puedes guardar porque ya existe una relación activa con ese proveedor y ese producto.",
        );
        return;
      }

      if (relacionInactivaIgual) {
        await proveedoresProductosService.actualizarRelacion(
          relacionInactivaIgual.id_proveedor,
          relacionInactivaIgual.id_producto,
          {
            sku_proveedor: form.sku_proveedor.trim(),
            costo_referencia: toMoneyNumber(form.costo_referencia),
            activo: true,
          },
        );

        await proveedoresProductosService.desactivarRelacion(
          initialRelacion.id_proveedor,
          initialRelacion.id_producto,
        );

        onSuccess();
        return;
      }

      await proveedoresProductosService.crearRelacion(
        form.id_proveedor,
        payloadActiva,
      );

      await proveedoresProductosService.desactivarRelacion(
        initialRelacion.id_proveedor,
        initialRelacion.id_producto,
      );

      onSuccess();
    } catch (e: unknown) {
      setMsgError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Proveedor</label>

          {readOnly ? (
            <input
              value={form.proveedor_nombre}
              disabled
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          ) : (
            <div className="relative">
              <input
                value={proveedorQuery || form.proveedor_nombre}
                onChange={(e) => {
                  setProveedorQuery(e.target.value);
                  setForm((p) => ({
                    ...p,
                    id_proveedor: 0,
                    proveedor_nombre: e.target.value,
                  }));
                }}
                placeholder="Buscar proveedor por razón social, teléfono o correo..."
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
              />

              {loadingProveedores ? (
                <div className="mt-2 text-xs font-semibold text-slate-500">
                  Buscando proveedores...
                </div>
              ) : null}

              {proveedorResultados.length > 0 ? (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-sm">
                  {proveedorResultados.map((prov) => (
                    <button
                      key={prov.id_proveedor}
                      type="button"
                      onClick={() => pickProveedor(prov)}
                      className="block w-full border-b border-black/5 px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
                    >
                      <div className="font-extrabold">{prov.razon_social}</div>
                      <div className="text-xs text-slate-500">
                        {prov.telefono ?? "-"} · {prov.correo ?? "-"}
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Producto</label>

          {readOnly ? (
            <input
              value={form.producto_nombre}
              disabled
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          ) : (
            <div className="relative">
              <input
                value={productoQuery || form.producto_nombre}
                onChange={(e) => {
                  setProductoQuery(e.target.value);
                  setForm((p) => ({
                    ...p,
                    id_producto: 0,
                    producto_nombre: e.target.value,
                    producto_sku: "",
                    producto_codigo_barras: "",
                    producto_modelo: "",
                  }));
                }}
                placeholder="Buscar producto por nombre, código de barras, modelo o sku..."
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
              />

              {loadingProductos ? (
                <div className="mt-2 text-xs font-semibold text-slate-500">
                  Buscando productos...
                </div>
              ) : null}

              {productoResultados.length > 0 ? (
                <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-sm">
                  {productoResultados.map((prod) => (
                    <button
                      key={prod.id_producto}
                      type="button"
                      onClick={() => pickProducto(prod)}
                      className="block w-full border-b border-black/5 px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
                    >
                      <div className="font-extrabold">{prod.nombre}</div>
                      <div className="text-xs text-slate-500">
                        SKU: {prod.sku ?? "-"} · Código:{" "}
                        {prod.codigo_barras ?? "-"} · Modelo:{" "}
                        {prod.modelo ?? "-"}
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">SKU producto</label>
          <input
            value={form.producto_sku}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Código de barras</label>
          <input
            value={form.producto_codigo_barras}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Modelo</label>
          <input
            value={form.producto_modelo}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">SKU proveedor</label>
          <input
            value={form.sku_proveedor}
            onChange={(e) =>
              setForm((p) => ({ ...p, sku_proveedor: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Costo referencia</label>
          <input
            value={form.costo_referencia}
            onChange={(e) =>
              setForm((p) => ({ ...p, costo_referencia: e.target.value }))
            }
            disabled={readOnly}
            placeholder="0.00"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Activo</label>
          <select
            value={form.activo ? "true" : "false"}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                activo: e.target.value === "true",
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      {modo !== "VER" ? (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void guardar()}
            disabled={saving}
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : modo === "CREAR"
                ? "Crear relación"
                : "Actualizar relación"}
          </button>
        </div>
      ) : null}

      {modo === "VER" && initialRelacion ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">
              Proveedor
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.razon_social}
            </div>

            <div className="text-xs font-extrabold text-black/50">Producto</div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.producto_nombre}
            </div>

            <div className="text-xs font-extrabold text-black/50">SKU</div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.producto_sku ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Código de barras
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.producto_codigo_barras ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">Modelo</div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.producto_modelo ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              SKU proveedor
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.sku_proveedor ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Costo referencia
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.costo_referencia !== null &&
              initialRelacion.costo_referencia !== undefined
                ? `$${Number(initialRelacion.costo_referencia).toFixed(2)}`
                : "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">Activo</div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.activo ? "Sí" : "No"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha de alta
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialRelacion.creado_en ?? "-"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
