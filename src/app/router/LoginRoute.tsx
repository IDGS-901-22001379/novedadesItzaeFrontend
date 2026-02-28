// src/app/router/LoginRoute.tsx
import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { HOME_BY_ROLE } from "../../config/routes";

export default function LoginRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, appRol } = useAuth();

  if (isAuthenticated && appRol) {
    return <Navigate to={HOME_BY_ROLE[appRol]} replace />;
  }

  return <>{children}</>;
}