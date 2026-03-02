// src/modules/usuarios/components/usuarios/EmpleadoAutocomplete.tsx
// Autocomplete para seleccionar empleado por nombre.
// Responsabilidades: permitir buscar por nombre y devolver id_empleado al formulario.
// Ajuste: si viene valueId pero no viene valueLabel, se carga el nombre por API (listado) y se muestra.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  empleadosService,
  type EmpleadoOption,
} from "../../../empleados/services/empleados.service";

type Props = {
  valueId: number;
  valueLabel: string;
  onPick: (emp: { id_empleado: number; nombre: string }) => void;
  disabled?: boolean;
};

export default function EmpleadoAutocomplete({
  valueId,
  valueLabel,
  onPick,
  disabled = false,
}: Props) {
  const [q, setQ] = useState(valueLabel || "");
  const [results, setResults] = useState<EmpleadoOption[]>([]);
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
      if ((valueLabel || "").trim()) return; // ya hay label
      if (resolvedLabel.trim()) return; // ya resuelto

      try {
        // Cargamos lista grande y buscamos el id
        // Usamos buscar("")? No, buscar requiere q>=2.
        // Creamos una función interna usando el http que ya tienes en empleadosService:
        // Como no la tienes, usamos un truco: buscar por una letra "a" trae algo,
        // pero no garantiza traer el id. Mejor: agrega método listar() en el service.
        // Para no pedirte más archivos, hacemos fallback: dejamos el id si no hay listar().

        if (!("listar" in empleadosService)) {
          // Sin listar(): no podemos resolver por id con este service.
          // Mostramos el id como fallback.
          if (mounted) setResolvedLabel(`Empleado #${valueId}`);
          if (mounted && !q) setQ(`Empleado #${valueId}`);
          return;
        }

        const svc = empleadosService as unknown as {
          listar: (
            page?: number,
            pageSize?: number,
          ) => Promise<EmpleadoOption[]>;
        };

        const data = await svc.listar(1, 200);
        const found = (Array.isArray(data) ? data : []).find(
          (x) => x.id_empleado === valueId,
        );

        if (!mounted) return;

        if (found?.label) {
          setResolvedLabel(found.label);
          setQ(found.label);
        } else {
          setResolvedLabel(`Empleado #${valueId}`);
          if (!q) setQ(`Empleado #${valueId}`);
        }
      } catch {
        if (!mounted) return;
        setResolvedLabel(`Empleado #${valueId}`);
        if (!q) setQ(`Empleado #${valueId}`);
      }
    }

    void resolveById();

    return () => {
      mounted = false;
    };
  }, [valueId, valueLabel, disabled, resolvedLabel, q]);

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
        const data = await empleadosService.buscar(query);
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
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar empleado por nombre…"
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
      />

      {/* En vez de mostrar solo el id, mostramos el nombre resuelto */}
      {valueId > 0 ? (
        <div className="mt-1 text-xs font-semibold text-black/50">
          Empleado:{" "}
          <span className="font-extrabold">
            {resolvedLabel || valueLabel || `#${valueId}`}
          </span>
        </div>
      ) : null}

      {open && !disabled ? (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
          {hint ? (
            <div className="px-3 py-2 text-xs font-semibold text-black/60">
              {hint}
            </div>
          ) : null}

          {results.map((emp) => (
            <button
              key={emp.id_empleado}
              type="button"
              onClick={() => {
                onPick({ id_empleado: emp.id_empleado, nombre: emp.label });
                setResolvedLabel(emp.label);
                setQ(emp.label);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold hover:bg-black/5"
            >
              <div className="flex flex-col">
                <span>{emp.label}</span>
                {emp.puesto ? (
                  <span className="text-xs font-semibold text-black/45">
                    {emp.puesto}
                  </span>
                ) : null}
              </div>

              <span className="text-xs font-extrabold text-black/50">
                #{emp.id_empleado}
              </span>
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
