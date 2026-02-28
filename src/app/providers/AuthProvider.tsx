// src/app/providers/AuthProvider.tsx

import React, { useMemo, useState } from "react";
import { AuthContext, type AuthContextValue } from "./auth.context";
import { getUser, getToken, clearSession, type SessionUser } from "../../services/auth/tokenStorage";
import { login as loginService, logout as logoutService } from "../../modules/auth/services/auth.service";
import type { LoginRequest, LoginResponse } from "../../modules/auth/types/auth.types";
import { toAppRol, type AppRol } from "../../config/roles";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<SessionUser | null>(() => getUser());

  const appRol = useMemo<AppRol | null>(() => (user?.rol ? toAppRol(user.rol) : null), [user]);
  const isAuthenticated = Boolean(token && user);

  function refreshFromStorage() {
    setToken(getToken());
    setUser(getUser());
  }

  async function login(data: LoginRequest): Promise<LoginResponse> {
    const res = await loginService(data);
    refreshFromStorage();
    return res;
  }

  async function logout(): Promise<void> {
    try {
      await logoutService();
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
    }
  }

  const value: AuthContextValue = {
    token,
    user,
    appRol,
    isAuthenticated,
    login,
    logout,
    refreshFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}