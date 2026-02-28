// src/app/providers/auth.context.ts

import { createContext } from "react";
import type { SessionUser } from "../../services/auth/tokenStorage";
import type { AppRol } from "../../config/roles";
import type { LoginRequest, LoginResponse } from "../../modules/auth/types/auth.types";

export type AuthContextValue = {
  token: string | null;
  user: SessionUser | null;
  appRol: AppRol | null;

  isAuthenticated: boolean;

  login: (data: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshFromStorage: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);