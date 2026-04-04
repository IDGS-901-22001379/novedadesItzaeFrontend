// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/FacturacionCfdiVentaAutocomplete.tsx
// Buscador/autocomplete de ventas por folio.
// Responsabilidades:
// - buscar ventas por folio usando q
// - mostrar resultados
// - permitir seleccionar una venta
// - soportar navegación con teclado
// - mapear id_cliente a nombre real del cliente

import { useEffect, useMemo, useRef, useState } from "react";
import { ventasService } from "../../../../ventas/services/ventas.service";
import { clientesService } from "../../../../clientes/services/clientes.service";
import type { VentaListItem } from "../../../../ventas/types";

type Props = {
  valueId?: string;
  valueLabel?: string;
  onPick: (venta: VentaListItem) => void;
};

type ClienteNombreMap = Record<number, string>;

function getVentaLabel(venta: VentaListItem): string {
  return venta.folio || `Venta #${venta.id_venta}`;
}

function getClienteIdFromVenta(venta: VentaListItem): number | null {
  const v = venta as VentaListItem & {
    id_cliente?: number | null;
  };

  if (v.id_cliente == null || v.id_cliente === 0) return null;
  return Number(v.id_cliente);
}

function getClienteNombreDesdeVenta(
  venta: VentaListItem,
  clientesMap: ClienteNombreMap,
): string {
  const clienteId = getClienteIdFromVenta(venta);

  if (clienteId == null) return "Público General";

  return clientesMap[clienteId] || `Cliente #${clienteId}`;
}

export default function FacturacionCfdiVentaAutocomplete({
  valueId = "",
  valueLabel = "",
  onPick,
}: Props) {
  const [query, setQuery] = useState<string>(valueLabel || "");
  const [items, setItems] = useState<VentaListItem[]>([]);
  const [clientesMap, setClientesMap] = useState<ClienteNombreMap>({});
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
      setClientesMap({});
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

        const { items: ventasData } = await ventasService.listar({
          q,
          limit: 10,
          offset: 0,
        });

        if (cancelled) return;

        setItems(ventasData);
        setHighlightedIndex(ventasData.length > 0 ? 0 : -1);

        if (ventasData.length === 0) {
          setClientesMap({});
          setMsg("No se encontraron ventas.");
          return;
        }

        const idsClientes = Array.from(
          new Set(
            ventasData
              .map((venta) => getClienteIdFromVenta(venta))
              .filter((id): id is number => id != null),
          ),
        );

        if (idsClientes.length === 0) {
          setClientesMap({});
          return;
        }

        const clientesData = await Promise.all(
          idsClientes.map(async (id_cliente) => {
            try {
              const cliente = await clientesService.obtener(id_cliente);

              const nombre = (
                (
                  cliente as {
                    nombre?: string;
                    nombre_completo?: string;
                    razon_social?: string;
                    cliente?: string;
                  }
                ).nombre ||
                (
                  cliente as {
                    nombre?: string;
                    nombre_completo?: string;
                    razon_social?: string;
                    cliente?: string;
                  }
                ).nombre_completo ||
                (
                  cliente as {
                    nombre?: string;
                    nombre_completo?: string;
                    razon_social?: string;
                    cliente?: string;
                  }
                ).razon_social ||
                (
                  cliente as {
                    nombre?: string;
                    nombre_completo?: string;
                    razon_social?: string;
                    cliente?: string;
                  }
                ).cliente ||
                ""
              ).trim();

              return {
                id_cliente,
                nombre: nombre || `Cliente #${id_cliente}`,
              };
            } catch {
              return {
                id_cliente,
                nombre: `Cliente #${id_cliente}`,
              };
            }
          }),
        );

        if (cancelled) return;

        const nuevoMap: ClienteNombreMap = {};
        clientesData.forEach((c) => {
          nuevoMap[c.id_cliente] = c.nombre;
        });

        setClientesMap(nuevoMap);
      } catch (e: unknown) {
        if (cancelled) return;

        const message =
          e instanceof Error ? e.message : "No se pudo buscar la venta.";
        setMsg(message);
        setItems([]);
        setClientesMap({});
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

  function seleccionar(item: VentaListItem) {
    onPick(item);
    setQuery(getVentaLabel(item));
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
        placeholder="Busca por folio..."
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
      />

      {valueId ? (
        <div className="mt-1 text-[11px] font-semibold text-black/50">
          Venta seleccionada
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
                    key={item.id_venta}
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
                      {item.folio || `Venta #${item.id_venta}`}
                    </div>

                    <div
                      className={[
                        "text-xs font-semibold",
                        isActive ? "text-white/90" : "text-black/55",
                      ].join(" ")}
                    >
                      Cliente: {getClienteNombreDesdeVenta(item, clientesMap)}
                    </div>

                    {"total" in item ? (
                      <div
                        className={[
                          "text-xs font-semibold",
                          isActive ? "text-white/80" : "text-black/45",
                        ].join(" ")}
                      >
                        Total:{" "}
                        {String((item as { total?: number }).total ?? "-")}
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
