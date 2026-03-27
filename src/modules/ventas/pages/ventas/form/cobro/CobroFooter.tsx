// src/modules/ventas/pages/ventas/form/cobro/CobroFooter.tsx

type Props = {
  saving: boolean;
  onClose: () => void;
  onImprimir: () => void;
  onConfirmar: () => void;
};

export default function CobroFooter({
  saving,
  onClose,
  onImprimir,
  onConfirmar,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-black/10 px-6 py-4">
      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5 disabled:opacity-50"
      >
        Cancelar
      </button>

      <button
        type="button"
        onClick={onImprimir}
        disabled={saving}
        className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-extrabold text-blue-800 hover:bg-blue-100 disabled:opacity-50"
      >
        Imprimir
      </button>

      <button
        type="button"
        onClick={onConfirmar}
        disabled={saving}
        className="rounded-xl bg-[#34f334] px-5 py-2 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f] disabled:opacity-50"
      >
        {saving ? "Registrando..." : "Confirmar cobro"}
      </button>
    </div>
  );
}
