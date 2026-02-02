import { Navigate } from "react-router";
import { useAuth } from "../modules/auth/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";
import type React from "react";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
