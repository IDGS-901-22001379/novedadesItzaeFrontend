// src/modules/productos/pages/productos/form/useProductosForm.ts
// Hook principal del formulario de Productos.
// Responsabilidades:
// - Mantener estado del formulario (form, saving, msgError).
// - Cargar catálogos (tipos, categorías, marcas, unidades).
// - Controlar acordeones (imagen, clasificación, inventario, facturación).
// - Guardar (crear/actualizar) usando payloads tipados (sin unions).

import { useEffect, useMemo, useState } from "react";

import type {
  Producto,
  ProductoCategoria,
  ProductoMarca,
  ProductoTipo,
  UnidadMedida,
} from "../../../types/productos.types";
import { productosService } from "../../../services/productos.service";

import type { ProductosFormModo, ProductosFormState } from "./productosForm.types";
import { buildCreatePayload, buildUpdatePayload, validarProductoForm } from "./productosForm.helpers";
import { buildInitialForm } from "./productosForm.types";

type Args = {
  modo: ProductosFormModo;
  initialProducto: Producto | null;
  onSuccess: () => void;
};

export function useProductosForm({ modo, initialProducto, onSuccess }: Args) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<ProductosFormState>(() =>
    buildInitialForm(modo, initialProducto),
  );

  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  // Catálogos
  const [tipos, setTipos] = useState<ProductoTipo[]>([]);
  const [categorias, setCategorias] = useState<ProductoCategoria[]>([]);
  const [marcas, setMarcas] = useState<ProductoMarca[]>([]);
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);

  // Acordeones
  const [openImagen, setOpenImagen] = useState(false);
  const [openClasificacion, setOpenClasificacion] = useState(true);
  const [openInventario, setOpenInventario] = useState(false);
  const [openFacturacion, setOpenFacturacion] = useState(false);

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar producto";
    if (modo === "EDITAR") return `Editar producto: ${initialProducto?.nombre ?? ""}`;
    return `Visualizar producto: ${initialProducto?.nombre ?? ""}`;
  }, [modo, initialProducto]);

  // Cargar catálogos (una vez)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [t, c, m, u] = await Promise.all([
          productosService.catalogos.tipos(true),
          productosService.catalogos.categorias(true),
          productosService.catalogos.marcas(true),
          productosService.catalogos.unidades(true),
        ]);

        if (!mounted) return;

        setTipos(t);
        setCategorias(c);
        setMarcas(m);
        setUnidades(u);
      } catch {
        // si falla catálogo, el formulario sigue funcionando,
        // pero los selects pueden quedar vacíos.
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function guardar() {
    const err = validarProductoForm(form);
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      // CREAR
      if (modo === "CREAR") {
        const payload = buildCreatePayload(form); // ✅ ProductoCreate
        await productosService.crear(payload);
        onSuccess();
        return;
      }

      // EDITAR
      if (!initialProducto) {
        setMsgError("No se encontró el producto a editar.");
        return;
      }

      const payload = buildUpdatePayload(form); // ✅ ProductoUpdate
      await productosService.actualizar(initialProducto.id_producto, payload);
      onSuccess();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Ocurrió un error al guardar.";
      setMsgError(msg);
    } finally {
      setSaving(false);
    }
  }

  return {
    readOnly,
    subtitulo,

    form,
    setForm,

    saving,
    msgError,

    tipos,
    categorias,
    marcas,
    unidades,

    openImagen,
    setOpenImagen,
    openClasificacion,
    setOpenClasificacion,
    openInventario,
    setOpenInventario,
    openFacturacion,
    setOpenFacturacion,

    guardar,
  };
}