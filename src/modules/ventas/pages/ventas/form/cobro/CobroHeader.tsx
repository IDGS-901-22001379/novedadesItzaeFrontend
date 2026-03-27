// src/modules/ventas/pages/ventas/form/cobro/CobroHeader.tsx

type Props = {
  saving: boolean;
  onClose: () => void;
};

export default function CobroHeader({ saving, onClose }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
      <div>
        <div className="text-lg font-extrabold text-black/80">Cobrar venta</div>
        <div className="text-sm font-semibold text-black/50">
          Revisa los productos, captura el pago y confirma el ticket.
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={saving}
        className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-black/70 hover:bg-black/5 disabled:opacity-50"
      >
        Cerrar
      </button>
    </div>
  );
}
