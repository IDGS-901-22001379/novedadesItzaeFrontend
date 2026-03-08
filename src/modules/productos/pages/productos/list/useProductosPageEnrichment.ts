// src/modules/productos/pages/productos/list/useProductosPageEnrichment.ts
// Enriquecimiento de la página actual (tabla):
// - GET /productos (listado) puede NO traer imagen_ruta / modelo / stock_minimo_tienda.
// - Aquí pedimos GET /productos/{id} SOLO para los items visibles en la página.
// - Mezclamos imagen_ruta, modelo y stock_minimo_tienda en el state `items`.
// - Sin `any` (para que no falle ESLint/TS).

import { useEffect } from "react";
import { productosService } from "../../../services/productos.service";
import type { ProductoLite } from "../../../types/productos.types";

// Tipo extendido (solo para este hook) para permitir campos "opcionales" que
// pueden venir del detalle o del futuro, sin usar any.
type ProductoEnriquecible = ProductoLite & {
  imagen_ruta?: string | null;
  modelo?: string | null;
  stock_minimo_tienda?: number | null;
};

// Parche que regresa el enrich por id_producto (solo campos extra)
type ProductoEnrichmentPatch = {
  id_producto: number;
  imagen_ruta: string | null;
  modelo: string | null;
  stock_minimo_tienda: number | null;
};

// Trae detalle por producto y construye un "parche" con imagen/modelo/minimo.
async function enriquecerConDetalle(
  lista: ProductoLite[],
): Promise<ProductoEnrichmentPatch[]> {
  return Promise.all(
    lista.map(async (p) => {
      try {
        const d = await productosService.obtener(p.id_producto);

        const minRaw = (d as unknown as { stock_minimo_tienda?: number | null })
          .stock_minimo_tienda;

        const min =
          minRaw === undefined || minRaw === null
            ? null
            : Number.isFinite(Number(minRaw))
              ? Math.max(0, Math.trunc(Number(minRaw)))
              : null;

        return {
          id_producto: p.id_producto,
          imagen_ruta: d.imagen_ruta ?? null,
          modelo: d.modelo ?? null,
          stock_minimo_tienda: min,
        };
      } catch {
        return {
          id_producto: p.id_producto,
          imagen_ruta: null,
          modelo: null,
          stock_minimo_tienda: null,
        };
      }
    }),
  );
}

export function useProductosPageEnrichment(
  itemsPagina: ProductoLite[],
  setItems: React.Dispatch<React.SetStateAction<ProductoLite[]>>,
) {
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (itemsPagina.length === 0) return;

      // Solo enriquecemos si todavía NO existen esas props en el objeto.
      // (si el backend ya las manda en listado, evitamos requests extra).
      const faltan = itemsPagina.filter((p) => {
        const x = p as ProductoEnriquecible;
        return (
          x.imagen_ruta === undefined ||
          x.modelo === undefined ||
          x.stock_minimo_tienda === undefined
        );
      });

      if (faltan.length === 0) return;

      try {
        const parches = await enriquecerConDetalle(faltan);
        if (!mounted) return;

        // Map por id para merge rápido
        const map = new Map(parches.map((x) => [x.id_producto, x]));

        // Mezclar en el arreglo completo (solo los que vienen en el map)
        setItems((prev) =>
          prev.map((p) => {
            const extra = map.get(p.id_producto);
            return extra ? { ...p, ...extra } : p;
          }),
        );
      } catch {
        // Si falla, la tabla seguirá usando imagen default y min=0/-
      }
    })();

    return () => {
      mounted = false;
    };
  }, [itemsPagina, setItems]);
}