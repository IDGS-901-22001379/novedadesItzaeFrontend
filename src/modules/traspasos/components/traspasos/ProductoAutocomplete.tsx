// src/modules/traspasos/components/traspasos/ProductoAutocomplete.tsx
// Autocomplete de productos para Traspasos.
// Responsabilidades:
// - buscar por nombre, modelo y código de barras
// - navegar con flechas
// - seleccionar con Enter
// - cerrar con Escape / click fuera
// - mostrar resultados en un panel flotante aparte
// - mostrar máximo 10 resultados con scroll

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductoOption } from "../../pages/traspasos/form/traspasosForm.types";

type Props = {
  valueId: number;
  productos: ProductoOption[];
  disabled?: boolean;
  placeholder?: string;
  onPick: (producto: ProductoOption) => void;
};

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

function textoBusqueda(p: ProductoOption): string {
  return [p.nombre, p.modelo, p.codigo_barras, p.label].join(" ").toLowerCase();
}

export default function ProductoAutocomplete({
  valueId,
  productos,
  disabled = false,
  placeholder = "Busca por nombre, modelo o código de barras",
  onPick,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedProducto = useMemo(
    () => productos.find((p) => p.id === valueId) ?? null,
    [productos, valueId],
  );

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(
    null,
  );

  const inputValue = open ? query : (selectedProducto?.label ?? query);

  const resultados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productos.slice(0, 10);

    return productos.filter((p) => textoBusqueda(p).includes(q)).slice(0, 10);
  }, [productos, query]);

  function updatePanelPosition() {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();

    setPanelPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }

  useEffect(() => {
    if (!open) return;

    updatePanelPosition();

    function handleResizeOrScroll() {
      updatePanelPosition();
    }

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsideInput = !!containerRef.current?.contains(target);
      const clickedInsidePanel = itemRefs.current.some((el) =>
        el?.contains(target),
      );

      if (!clickedInsideInput && !clickedInsidePanel) {
        setOpen(false);
        setHighlightIndex(0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const el = itemRefs.current[highlightIndex];
    if (el) {
      el.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightIndex, open]);

  function seleccionar(producto: ProductoOption) {
    onPick(producto);
    setQuery(producto.label);
    setOpen(false);
    setHighlightIndex(0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setHighlightIndex(0);
      updatePanelPosition();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex((prev) =>
        Math.min(prev + 1, Math.max(resultados.length - 1, 0)),
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (!open) {
        setOpen(true);
        setHighlightIndex(0);
        updatePanelPosition();
        return;
      }

      const producto = resultados[highlightIndex];
      if (producto) seleccionar(producto);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      setHighlightIndex(0);
      setQuery("");
    }
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            setHighlightIndex(0);
            setQuery("");
            updatePanelPosition();
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlightIndex(0);
            updatePanelPosition();
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      {open && !disabled && panelPosition ? (
        <div
          className="fixed z-200 rounded-2xl border border-black/10 bg-white shadow-2xl"
          style={{
            top: panelPosition.top,
            left: panelPosition.left,
            width: panelPosition.width,
          }}
        >
          <div className="max-h-105 overflow-y-auto">
            {resultados.length > 0 ? (
              resultados.map((producto, index) => {
                const active = index === highlightIndex;

                return (
                  <button
                    key={producto.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => seleccionar(producto)}
                    className={[
                      "flex w-full flex-col border-b border-black/5 px-3 py-3 text-left transition last:border-b-0",
                      active ? "bg-[#DBEAFE]" : "hover:bg-black/5",
                    ].join(" ")}
                  >
                    <span className="text-sm font-extrabold text-slate-900">
                      {producto.nombre}
                    </span>

                    <span className="mt-0.5 text-xs font-semibold text-slate-500">
                      {producto.modelo || "Sin modelo"}
                      {" · "}
                      {producto.codigo_barras || "Sin código"}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-sm font-semibold text-slate-500">
                No se encontraron productos.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
