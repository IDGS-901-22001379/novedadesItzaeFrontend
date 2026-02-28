// src/shared/components/NoAutorizado.tsx

import { Link } from "react-router-dom";

export default function NoAutorizado() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow">
        <h1 className="text-xl font-bold mb-2">No autorizado</h1>
        <p className="text-gray-600 mb-4">
          No tienes permisos para entrar a esta sección.
        </p>
        <Link className="text-blue-600 underline" to="/">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}