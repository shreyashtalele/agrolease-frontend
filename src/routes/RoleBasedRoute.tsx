import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

type Role = "farmer" | "provider" | "admin";

interface RoleBasedRouteProps {
  allowedRoles: Role[];
}

export const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role as Role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
