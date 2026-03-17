// src/modules/traspasos/pages/traspasos/form/TraspasosFormFooter.tsx

type Props = {
  readOnly: boolean;
  saving: boolean;
  onCancel: () => void;
  onGuardar: () => void;
};

export default function TraspasosFormFooter({
  readOnly,
  saving,
  onCancel,
  onGuardar,
}: Props) {
  if (readOnly) return null;

  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
      >
        Cancelar
      </button>

      <button
        type="button"
        onClick={onGuardar}
        disabled={saving}
        className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Crear"}
      </button>
    </div>
  );
}
