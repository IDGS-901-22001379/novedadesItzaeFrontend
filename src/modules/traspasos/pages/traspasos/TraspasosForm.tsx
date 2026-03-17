// src/modules/traspasos/pages/traspasos/TraspasosForm.tsx
// Formulario de traspasos.
// Responsabilidades: conectar hooks y secciones del formulario.

import type { TraspasosFormProps } from "./form/traspasosForm.types";
import { useTraspasosFormCatalogos } from "./form/useTraspasosFormCatalogos";
import { useTraspasosFormState } from "./form/useTraspasosFormState";
import { useTraspasosFormSubmit } from "./form/useTraspasosFormSubmit";
import TraspasosFormFields from "./form/TraspasosFormFields";
import TraspasosFormItemsSection from "./form/TraspasosFormItemsSection";
import TraspasosFormFooter from "./form/TraspasosFormFooter";
import TraspasosFormReadonlyInfo from "./form/TraspasosFormReadonlyInfo";

export default function TraspasosForm({
  modo,
  initialTraspaso,
  onSuccess,
  onCancel,
}: TraspasosFormProps) {
  const {
    readOnly,
    form,
    setForm,
    subtitulo,
    setItem,
    agregarItem,
    eliminarItem,
  } = useTraspasosFormState(modo, initialTraspaso);

  const {
    loadingCatalogs,
    catalogosError,
    ubicaciones,
    productos,
    ubicacionLabelById,
    productoLabelById,
  } = useTraspasosFormCatalogos();

  const { saving, msgError, setMsgError, guardar } =
    useTraspasosFormSubmit(onSuccess);

  const errorFinal = msgError || catalogosError;

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {errorFinal ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorFinal}
        </div>
      ) : null}

      {loadingCatalogs ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          Cargando ubicaciones y productos...
        </div>
      ) : null}

      <TraspasosFormFields
        readOnly={readOnly}
        form={form}
        setForm={(updater) => {
          setMsgError("");
          setForm(updater);
        }}
        ubicaciones={ubicaciones}
        ubicacionLabelById={ubicacionLabelById}
      />

      <TraspasosFormItemsSection
        readOnly={readOnly}
        form={form}
        productos={productos}
        productoLabelById={productoLabelById}
        setItem={(index, patch) => {
          setMsgError("");
          setItem(index, patch);
        }}
        agregarItem={() => {
          setMsgError("");
          agregarItem();
        }}
        eliminarItem={eliminarItem}
      />

      <TraspasosFormFooter
        readOnly={readOnly}
        saving={saving}
        onCancel={onCancel}
        onGuardar={() => void guardar(form)}
      />

      <TraspasosFormReadonlyInfo
        modo={modo}
        initialTraspaso={initialTraspaso}
        ubicacionLabelById={ubicacionLabelById}
      />
    </div>
  );
}
