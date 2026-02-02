import { useAuth } from "../modules/auth/hooks/useAuth";
import { Navigate } from "react-router";
import LoadingScreen from "./LoadingScreen";

const AuthProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useAuth();
  console.log(user);
  if (loading) {
    return <LoadingScreen />;
  }
  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }
  return <>{children}</>;
};

export default AuthProtectedRoutes;
