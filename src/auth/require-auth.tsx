import { useAuth } from "@/auth/auth-context";
import { Navigate, Outlet, useLocation } from "react-router";

export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={"/signin"} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
