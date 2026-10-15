import type React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../store/admin/useAdminAuthStore";

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated());
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

export default AdminProtectedRoute;