// src/modules/clientes/constants/clientesForm.validation.ts
// Validaciones del formulario de clientes comerciales.
// Responsabilidades: validar por campo y validar el formulario completo por modo.

export type ClientesFormModo = "CREAR" | "EDITAR" | "VER";

export type ClientesFormState = {
  numero_cliente: string;

  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;

  correo: string;
  telefono: string;
  direccion: string;

  id_tipo_cliente: number;

  credito_habilitado: boolean;
  credito_limite: string;
  credito_dias: string;
  credito_observaciones: string;
};

export type FieldErrors = Partial<Record<keyof ClientesFormState, string>>;

function toNumberOrZero(val: string): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

export function validateNombre(modo: ClientesFormModo, nombre: string): string {
  const v = nombre.trim();
  if (!v) return "Te falta registrar el nombre.";

  const min = modo === "EDITAR" ? 2 : 3;
  if (v.length < min) return `El nombre debe tener al menos ${min} caracteres.`;

  return "";
}

export function validateApellidoPaterno(modo: ClientesFormModo, ap: string): string {
  const v = ap.trim();
  if (!v) return "Te falta registrar el apellido paterno.";

  const min = modo === "EDITAR" ? 2 : 3;
  if (v.length < min) return `El apellido paterno debe tener al menos ${min} caracteres.`;

  return "";
}

export function validateCredito(
  form: ClientesFormState,
): Pick<FieldErrors, "credito_limite" | "credito_dias"> {
  const errors: Pick<FieldErrors, "credito_limite" | "credito_dias"> = {};

  if (!form.credito_habilitado) return errors;

  const limite = toNumberOrZero(form.credito_limite);
  const dias = toNumberOrZero(form.credito_dias);

  if (limite < 0) errors.credito_limite = "El límite de crédito no puede ser negativo.";
  if (dias <= 0) errors.credito_dias = "Los días de crédito deben ser mayor a 0.";

  return errors;
}

export function validateForm(modo: ClientesFormModo, form: ClientesFormState): FieldErrors {
  const errors: FieldErrors = {};

  const errNombre = validateNombre(modo, form.nombre);
  if (errNombre) errors.nombre = errNombre;

  const errAp = validateApellidoPaterno(modo, form.apellido_paterno);
  if (errAp) errors.apellido_paterno = errAp;

  if (!form.id_tipo_cliente || form.id_tipo_cliente <= 0) {
    errors.id_tipo_cliente = "Te falta seleccionar el tipo de cliente.";
  }

  const creditoErrors = validateCredito(form);
  if (creditoErrors.credito_limite) errors.credito_limite = creditoErrors.credito_limite;
  if (creditoErrors.credito_dias) errors.credito_dias = creditoErrors.credito_dias;

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}