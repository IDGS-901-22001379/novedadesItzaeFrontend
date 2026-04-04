// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/FacturacionCfdiClienteFiscalAutocomplete.tsx
// Buscador/autocomplete de clientes fiscales.
// Responsabilidades:
// - buscar clientes fiscales por texto
// - mostrar resultados
// - permitir seleccionar un cliente fiscal
// - soportar navegación con teclado (arriba, abajo, enter, escape)
// - notificar al padre el id y texto seleccionado

import { useEffect, useMemo, useRef, useState } from "react";
import { facturacionCfdiClientesFiscalesService } from "../../../services/facturacion_cfdi_clientes_fiscales.service";
import type { ClienteFiscalBuscarItem } from "../../../types/facturacion_cfdi.types";

type Props = {
  valueId?: string;
  valueLabel?: string;
  onPick: (cliente: ClienteFiscalBuscarItem) => void;
};

export default function FacturacionCfdiClienteFiscalAutocomplete({
  valueId = "",
  valueLabel = "",
  onPick,
}: Props) {
  const [query, setQuery] = useState<string>(valueLabel || "");
  const [items, setItems] = useState<ClienteFiscalBuscarItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const itemsRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setQuery(valueLabel || "");
  }, [valueLabel]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = (query || "").trim();

    if (!q) {
      setItems([]);
      setMsg("");
      setLoading(false);
      setHighlightedIndex(-1);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setMsg("");

        const data = await facturacionCfdiClientesFiscalesService.buscar({
          q,
          solo_activos: true,
          limit: 10,
          offset: 0,
        });

        if (cancelled) return;

        setItems(data);
        setHighlightedIndex(data.length > 0 ? 0 : -1);

        if (data.length === 0) {
          setMsg("No se encontraron clientes fiscales.");
        }
      } catch (e: unknown) {
        if (cancelled) return;

        const message =
          e instanceof Error
            ? e.message
            : "No se pudo buscar el cliente fiscal.";

        setMsg(message);
        setItems([]);
        setHighlightedIndex(-1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (!open) return;
    if (highlightedIndex < 0) return;

    const element = itemsRefs.current[highlightedIndex];
    if (element) {
      element.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  const showResults = useMemo(() => {
    return open && (loading || items.length > 0 || !!msg);
  }, [open, loading, items, msg]);

  function seleccionar(item: ClienteFiscalBuscarItem) {
    onPick(item);
    setQuery(`${item.razon_social} - ${item.rfc}`);
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length === 0) return;

      setHighlightedIndex((prev) => {
        if (prev < 0) return 0;
        return prev >= items.length - 1 ? 0 : prev + 1;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length === 0) return;

      setHighlightedIndex((prev) => {
        if (prev < 0) return items.length - 1;
        return prev <= 0 ? items.length - 1 : prev - 1;
      });
      return;
    }

    if (e.key === "Enter") {
      if (open && highlightedIndex >= 0 && items[highlightedIndex]) {
        e.preventDefault();
        seleccionar(items[highlightedIndex]);
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Busca por razón social o RFC..."
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
      />

      {valueId ? (
        <div className="mt-1 text-[11px] font-semibold text-black/50">
          Cliente seleccionado
        </div>
      ) : null}

      {showResults ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-xl">
          {loading ? (
            <div className="px-3 py-3 text-sm font-semibold text-black/60">
              Buscando...
            </div>
          ) : null}

          {!loading && items.length > 0
            ? items.map((item, index) => {
                const isActive = index === highlightedIndex;

                return (
                  <button
                    key={item.id_cliente_fiscal}
                    ref={(el) => {
                      itemsRefs.current[index] = el;
                    }}
                    type="button"
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => seleccionar(item)}
                    className={[
                      "block w-full border-b border-black/5 px-3 py-3 text-left",
                      isActive ? "bg-[#2B6CB0] text-white" : "hover:bg-black/5",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "text-sm font-extrabold",
                        isActive ? "text-white" : "text-black/80",
                      ].join(" ")}
                    >
                      {item.razon_social}
                    </div>

                    <div
                      className={[
                        "text-xs font-semibold",
                        isActive ? "text-white/90" : "text-black/55",
                      ].join(" ")}
                    >
                      RFC: {item.rfc}
                    </div>

                    {item.correo ? (
                      <div
                        className={[
                          "text-xs font-semibold",
                          isActive ? "text-white/80" : "text-black/45",
                        ].join(" ")}
                      >
                        {item.correo}
                      </div>
                    ) : null}
                  </button>
                );
              })
            : null}

          {!loading && msg ? (
            <div className="px-3 py-3 text-sm font-semibold text-black/60">
              {msg}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
