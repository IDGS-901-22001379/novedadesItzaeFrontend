// src/modules/ventas/pages/ventas/form/ventasForm.session.ts
// Utilidades de sesión para el formulario de ventas.
// Responsabilidades:
// - Leer el usuario logeado desde almacenamiento local.
// - Normalizar el vendedor actual para usarlo en defaults.

import type { CurrentVentasUser } from "./ventasForm.catalogs";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readNumber(
  obj: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = obj[key];

    if (typeof value === "number") return value;

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }

  return null;
}

function readString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }

  return "";
}

function extractCurrentVentasUser(
  parsed: Record<string, unknown>,
): CurrentVentasUser | undefined {
  const candidates: Record<string, unknown>[] = [];

  candidates.push(parsed);

  const nestedUser = asRecord(parsed.user);
  const nestedUsuario = asRecord(parsed.usuario);
  const nestedData = asRecord(parsed.data);
  const nestedPayload = asRecord(parsed.payload);
  const nestedResult = asRecord(parsed.result);
  const nestedResponse = asRecord(parsed.response);
  const nestedProfile = asRecord(parsed.profile);

  if (nestedUser) candidates.push(nestedUser);
  if (nestedUsuario) candidates.push(nestedUsuario);
  if (nestedData) candidates.push(nestedData);
  if (nestedPayload) candidates.push(nestedPayload);
  if (nestedResult) candidates.push(nestedResult);
  if (nestedResponse) candidates.push(nestedResponse);
  if (nestedProfile) candidates.push(nestedProfile);

  for (const candidate of candidates) {
    const id_usuario = readNumber(candidate, [
      "id_usuario",
      "idUsuario",
      "user_id",
      "userId",
      "id",
    ]);

    const nombre_en_ticket = readString(candidate, [
      "nombre_en_ticket",
      "nombreEnTicket",
      "nombre_ticket",
      "nombreTicket",
      "username",
      "user_name",
      "nombre_usuario",
      "nombre",
      "name",
      "usuario",
    ]);

    if (id_usuario != null || nombre_en_ticket) {
      return {
        id_usuario,
        nombre_en_ticket,
      };
    }
  }

  return undefined;
}

// Intenta leer el usuario logeado desde localStorage con varias llaves comunes.
// Si no encuentra nada, deja valores vacíos sin romper el formulario.
export function readCurrentVentasUser(): CurrentVentasUser | undefined {
  if (typeof window === "undefined") return undefined;

  const possibleKeys = [
    "session_user",
    "auth_user",
    "authUser",
    "user",
    "usuario",
    "session",
    "auth",
    "currentUser",
    "usuario_logeado",
    "auth_data",
    "authData",
    "profile",
  ];

  for (const key of possibleKeys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsedUnknown = JSON.parse(raw);
      const parsed = asRecord(parsedUnknown);
      if (!parsed) continue;

      const currentUser = extractCurrentVentasUser(parsed);
      if (currentUser) return currentUser;
    } catch {
      continue;
    }
  }

  return undefined;
}