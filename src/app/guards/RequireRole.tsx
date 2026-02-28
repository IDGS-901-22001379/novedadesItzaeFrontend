// src/app/guards/RequireRole.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import type { AppRol } from "../../config/roles";

export default function RequireRole({ allow }: { allow: AppRol[] }) {
  const { appRol } = useAuth();

  if (!appRol) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(appRol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
}