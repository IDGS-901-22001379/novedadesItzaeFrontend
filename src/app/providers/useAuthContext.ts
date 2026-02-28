// src/app/providers/useAuthContext.ts

import { useContext } from "react";
import { AuthContext } from "./auth.context";

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de <AuthProvider>");
  return ctx;
}