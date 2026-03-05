// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposAlert.tsx
// Alertas del módulo Clientes Tipos.
// Responsabilidades: mostrar mensajes de error o informativos con diseño suave.

type Props = {
  type: "error" | "info";
  message: string;
};

export default function ClientesTiposAlert({ type, message }: Props) {
  if (!message) return null;

  const base =
    "mt-3 rounded-2xl border px-3 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm font-semibold";
  const styles =
    type === "error"
      ? "border-red-300 bg-red-50 text-red-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return <div className={`${base} ${styles}`}>{message}</div>;
}
