import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { checkAuth } from "@/lib/simple-auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Simple synchronous check - no loading state needed
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
