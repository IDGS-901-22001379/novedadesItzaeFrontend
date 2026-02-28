// src/shared/components/EnConstruccion.tsx

import { Link } from "react-router-dom";

export default function EnConstruccion({
  titulo = "En construcción",
  descripcion = "Esta sección se implementará en los siguientes módulos.",
  volverA = "/",
}: {
  titulo?: string;
  descripcion?: string;
  volverA?: string;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">{titulo}</h1>
        <p className="text-gray-600 mb-6">{descripcion}</p>

        <div className="flex gap-3">
          <Link
            to={volverA}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-semibold"
          >
            Volver
          </Link>

          <span className="text-xs text-gray-400 self-center">
            (placeholder para navegación)
          </span>
        </div>
      </div>
    </div>
  );
}