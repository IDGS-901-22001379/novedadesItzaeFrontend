// src/modules/traspasos/pages/traspasos/list/TraspasosModals.tsx
// Modales del listado de Traspasos.
// Responsabilidades:
// - centralizar modal de creación
// - centralizar modal de visualización

import type { TraspasoDetalle } from "../../../types/traspasos.types";
import type { TraspasosTheme } from "../../../theme/traspasosTheme";
import TraspasosModalForm from "../../../components/traspasos/TraspasosModalForm";
import TraspasosForm from "../TraspasosForm";

type Props = {
  theme: TraspasosTheme;

  openNuevo: boolean;
  openVer: boolean;

  selectedTraspaso: TraspasoDetalle | null;

  onCloseNuevo: () => void;
  onCloseVer: () => void;
  onSuccessNuevo: () => void;
};

export default function TraspasosModals({
  theme,
  openNuevo,
  openVer,
  selectedTraspaso,
  onCloseNuevo,
  onCloseVer,
  onSuccessNuevo,
}: Props) {
  return (
    <>
      <TraspasosModalForm
        open={openNuevo}
        title="Nuevo traspaso"
        theme={theme}
        onClose={onCloseNuevo}
      >
        <TraspasosForm
          key="nuevo"
          modo="CREAR"
          initialTraspaso={null}
          onSuccess={onSuccessNuevo}
          onCancel={onCloseNuevo}
        />
      </TraspasosModalForm>

      <TraspasosModalForm
        open={openVer}
        title="Visualizar traspaso"
        theme={theme}
        onClose={onCloseVer}
      >
        <TraspasosForm
          key={selectedTraspaso?.id_movimiento ?? "ver"}
          modo="VER"
          initialTraspaso={selectedTraspaso}
          onSuccess={() => {}}
          onCancel={onCloseVer}
        />
      </TraspasosModalForm>
    </>
  );
}
