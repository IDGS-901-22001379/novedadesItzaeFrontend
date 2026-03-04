// src/modules/clientes_fiscales/components/clientes_fiscales/ClientesFiscalesClienteAutocomplete.tsx
// Autocomplete para seleccionar cliente comercial por nombre.
// Responsabilidades: permitir buscar por nombre y devolver id_cliente al padre.
// Ajuste: si viene valueId pero no viene valueLabel, se carga el nombre por API (listado) y se muestra.
// MISMO diseño que EmpleadoAutocomplete.
// Ajuste solicitado: NO mostrar número de cliente ni el id (#).

import { useEffect, useMemo, useRef, useState } from "react";

import {
  clientesComercialesService,
  type ClienteComercialOption,
} from "../../services/clientes_comerciales.service";

export type { ClienteComercialOption };

type Props = {
  value: ClienteComercialOption | null;
  onChange: (val: ClienteComercialOption | null) => void;
  disabled?: boolean;
};

export default function ClientesFiscalesClienteAutocomplete({
  value,
  onChange,
  disabled = false,
}: Props) {
  const valueId = value?.id_cliente ?? 0;
  const valueLabel = value?.label ?? "";

  const [q, setQ] = useState(valueLabel || "");
  const [results, setResults] = useState<ClienteComercialOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resolvedLabel, setResolvedLabel] = useState<string>("");

  const timerRef = useRef<number | null>(null);

  // Si el padre trae label, úsalo
  useEffect(() => {
    setQ(valueLabel || "");
    setResolvedLabel(valueLabel || "");
  }, [valueLabel]);

  // Si NO hay label pero sí hay id, intenta resolver nombre desde API (listado)
  useEffect(() => {
    let mounted = true;

    async function resolveById() {
      if (disabled) return;
      if (!valueId || valueId <= 0) return;
      if ((valueLabel || "").trim()) return;
      if (resolvedLabel.trim()) return;

      try {
        if (!("listar" in clientesComercialesService)) {
          // No mostramos "Cliente #id"; mejor dejamos el id resuelto vacío.
          if (mounted) setResolvedLabel("");
          return;
        }

        const svc = clientesComercialesService as unknown as {
          listar: (
            page?: number,
            pageSize?: number,
          ) => Promise<ClienteComercialOption[]>;
        };

        const data = await svc.listar(1, 200);
        const found = (Array.isArray(data) ? data : []).find(
          (x) => x.id_cliente === valueId,
        );

        if (!mounted) return;

        if (found?.label) {
          setResolvedLabel(found.label);
          setQ(found.label);
          onChange(found);
        } else {
          // Sin label encontrado: no mostramos id.
          setResolvedLabel("");
        }
      } catch {
        if (!mounted) return;
        setResolvedLabel("");
      }
    }

    void resolveById();

    return () => {
      mounted = false;
    };
  }, [valueId, valueLabel, disabled, resolvedLabel, onChange]);

  useEffect(() => {
    if (!open) return;

    // debounce para no pegarle al backend por cada tecla
    if (timerRef.current) window.clearTimeout(timerRef.current);

    const query = q.trim();
    timerRef.current = window.setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const data = await clientesComercialesService.buscar(query);
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [q, open]);

  const hint = useMemo(() => {
    if (!open) return "";
    const query = q.trim();
    if (query.length < 2) return "Escribe al menos 2 letras…";
    if (loading) return "Buscando…";
    if (!loading && results.length === 0) return "Sin resultados";
    return "";
  }, [open, q, loading, results.length]);

  return (
    <div className="relative">
      <input
        value={q}
        disabled={disabled}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);

          // Si está escribiendo manual y ya había un seleccionado, lo limpiamos
          if (valueId > 0) onChange(null);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar cliente comercial por nombre…"
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
      />

      {open && !disabled ? (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
          {hint ? (
            <div className="px-3 py-2 text-xs font-semibold text-black/60">
              {hint}
            </div>
          ) : null}

          {results.map((c) => (
            <button
              key={c.id_cliente}
              type="button"
              onClick={() => {
                onChange(c);
                setResolvedLabel(c.label);
                setQ(c.label);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold hover:bg-black/5"
            >
              <span>{c.label}</span>
            </button>
          ))}

          <div className="px-3 py-2 text-right">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-extrabold text-black/70 hover:bg-black/5"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
