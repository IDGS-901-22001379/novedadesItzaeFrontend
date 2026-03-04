// src/modules/clientes_fiscales/constants/clientes_fiscales.validation.ts
// Validaciones y mensajes del formulario Clientes Fiscales.

import type { ClientesFiscalesFormModo, ClientesFiscalesFormState } from "../pages/clientes/ClientesFiscalesForm";

export function validarClienteFiscal(modo: ClientesFiscalesFormModo, form: ClientesFiscalesFormState): string {
  if (!form.rfc.trim()) return "Te falta registrar el RFC.";
  if (!form.razon_social.trim()) return "Te falta registrar la razón social.";
  if (!form.id_regimen_fiscal || form.id_regimen_fiscal <= 0) return "Te falta seleccionar el régimen fiscal.";
  if (!form.codigo_postal_fiscal.trim()) return "Te falta registrar el código postal fiscal.";
  if (!form.correo_envio.trim()) return "Te falta registrar el correo de envío.";
  if (!form.id_uso_cfdi || form.id_uso_cfdi <= 0) return "Te falta seleccionar el uso de CFDI.";

  // id_cliente (ligado a cliente comercial) es obligatorio en tu POST (según swagger)
  if (!form.id_cliente || form.id_cliente <= 0) return "Te falta seleccionar el cliente comercial.";

  // Teléfono puede ser opcional, pero si quieres obligatorio, cambia aquí.
  // if (!form.telefono.trim()) return "Te falta registrar el teléfono.";

  // CREAR/EDITAR comparten validación en este módulo
  if (modo === "VER") return "";

  return "";
}