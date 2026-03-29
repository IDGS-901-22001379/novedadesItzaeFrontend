// src/modules/cortes_caja/components/cortes_caja/Cortes_cajaAlert.tsx
// Alertas del módulo Cortes de Caja.
// Se encarga de mostrar mensajes de error o informativos con un diseño suave y consistente.

type Props = {
  type: "error" | "info";
  message: string;
};

export default function Cortes_cajaAlert({ type, message }: Props) {
  if (!message) return null;

  const base = "mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold";
  const styles =
    type === "error"
      ? "border-red-300 bg-red-50 text-red-700"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return <div className={`${base} ${styles}`}>{message}</div>;
}
