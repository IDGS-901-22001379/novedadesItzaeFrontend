// src/app/router/HomeRedirect.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { HOME_BY_ROLE } from "../../config/routes";

export default function HomeRedirect() {
  const { appRol } = useAuth();

  if (!appRol) return <Navigate to="/login" replace />;

  return <Navigate to={HOME_BY_ROLE[appRol]} replace />;
}