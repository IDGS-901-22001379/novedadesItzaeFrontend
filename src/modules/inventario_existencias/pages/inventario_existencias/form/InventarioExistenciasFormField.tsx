// src/modules/inventario_existencias/pages/inventario_existencias/form/InventarioExistenciasFormField.tsx

type Props = {
  label: string;
  value: string;
  compact?: boolean;
};

export default function InventarioExistenciasFormField({
  label,
  value,
  compact = false,
}: Props) {
  return (
    <div
      className={[
        "rounded-2xl border border-black/10 bg-white",
        compact ? "px-3 py-3" : "px-4 py-3",
      ].join(" ")}
    >
      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
