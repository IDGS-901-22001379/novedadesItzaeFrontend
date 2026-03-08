// src/modules/productos/pages/productos/list/useProductosListData.ts
import { useCallback, useEffect, useState } from "react";
import { productosService } from "../../../services/productos.service";
import { inventarioStockService, type SucursalLite } from "../../../services/inventario_stock.service";
import type { ProductoLite } from "../../../types/productos.types";

type LoadState = "idle" | "loading" | "success" | "error";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de productos.";
}

export function useProductosListData() {
  const [items, setItems] = useState<ProductoLite[]>([]);
  const [categorias, setCategorias] = useState<{ id_categoria: number; nombre: string }[]>([]);
  const [marcas, setMarcas] = useState<{ id_marca: number; nombre: string }[]>([]);
  const [sucursales, setSucursales] = useState<SucursalLite[]>([]);

  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const cargar = useCallback(async () => {
    try {
      setState("loading");
      setErrorMsg("");

      const data = await productosService.listar({ solo_activos: false });
      setItems(data);

      setState("success");
    } catch (e: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(e));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState("loading");
        setErrorMsg("");

        const [cats, mrcs, sucs, data] = await Promise.all([
          productosService.catalogos.categorias(true),
          productosService.catalogos.marcas(true),
          inventarioStockService.listarSucursales(true),
          productosService.listar({ solo_activos: false }),
        ]);

        if (!mounted) return;

        setCategorias(cats.map((c) => ({ id_categoria: c.id_categoria, nombre: c.nombre })));
        setMarcas(mrcs.map((m) => ({ id_marca: m.id_marca, nombre: m.nombre })));
        setSucursales(sucs);
        setItems(data);

        setState("success");
      } catch (e: unknown) {
        if (!mounted) return;
        setState("error");
        setErrorMsg(getErrorMessage(e));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    items,
    setItems,
    categorias,
    marcas,
    sucursales,
    state,
    errorMsg,
    cargar,
  };
}